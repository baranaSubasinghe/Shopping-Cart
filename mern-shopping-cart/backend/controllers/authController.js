import jwt from "jsonwebtoken";
import User from "../models/User.js";

import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";

import { isoUint8Array } from "@simplewebauthn/server/helpers";

const rpName = () => process.env.PASSKEY_RP_NAME || "Shopping Cart App";
const rpID = () => process.env.PASSKEY_RP_ID || "localhost";
const origin = () => process.env.CLIENT_URL || "http://localhost:5173";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  token: generateToken(user._id),
});

// NORMAL REGISTER
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });

    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      provider: "local",
    });

    res.status(201).json(publicUser(user));
  } catch (error) {
    next(error);
  }
};

// NORMAL LOGIN
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await user.matchPassword(password))) {
      return res.json(publicUser(user));
    }

    res.status(401).json({ message: "Invalid email or password" });
  } catch (error) {
    next(error);
  }
};

// PROFILE
export const profile = async (req, res) => {
  res.json(req.user);
};

// PASSKEY REGISTER OPTIONS
export const passkeyRegisterOptions = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      user = await User.create({
        name,
        email: email.toLowerCase(),
        password: undefined,
        provider: "passkey",
        role: "user",
        passkeys: [],
      });
    }

    const options = await generateRegistrationOptions({
      rpName: rpName(),
      rpID: rpID(),
      userID: isoUint8Array.fromUTF8String(user._id.toString()),
      userName: user.email,
      userDisplayName: user.name,
      attestationType: "none",

      excludeCredentials: user.passkeys.map((passkey) => ({
        id: passkey.credentialID,
        transports: passkey.transports || [],
      })),

      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
      },
    });

    req.session.currentChallenge = options.challenge;
    req.session.passkeyUserId = user._id.toString();

    res.json(options);
  } catch (error) {
    next(error);
  }
};

// PASSKEY REGISTER VERIFY
export const passkeyRegisterVerify = async (req, res, next) => {
  try {
    const credential = req.body.credential || req.body.response || req.body;

    if (!credential || !credential.id || !credential.response) {
      return res.status(400).json({
        message: "Invalid passkey response from browser",
      });
    }

    const userId = req.session.passkeyUserId;
    const expectedChallenge = req.session.currentChallenge;

    if (!userId || !expectedChallenge) {
      return res.status(400).json({
        message: "Passkey session expired. Try again.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const verification = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge,
      expectedOrigin: origin(),
      expectedRPID: rpID(),
    });

    const { verified, registrationInfo } = verification;

    if (!verified || !registrationInfo) {
      return res.status(400).json({
        message: "Passkey verification failed",
      });
    }

    const { credential: newCredential } = registrationInfo;

    const alreadyExists = user.passkeys.some(
      (passkey) => passkey.credentialID === newCredential.id
    );

    if (!alreadyExists) {
      user.passkeys.push({
        credentialID: newCredential.id,
        credentialPublicKey: Buffer.from(newCredential.publicKey).toString(
          "base64url"
        ),
        counter: newCredential.counter,
        transports: credential.response.transports || [],
      });
    }

    await user.save();

    req.session.currentChallenge = null;
    req.session.passkeyUserId = null;

    res.status(201).json(publicUser(user));
  } catch (error) {
    next(error);
  }
};

// PASSKEY LOGIN OPTIONS
export const passkeyLoginOptions = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !user.passkeys || user.passkeys.length === 0) {
      return res.status(404).json({
        message: "No passkey found for this email",
      });
    }

    const options = await generateAuthenticationOptions({
      rpID: rpID(),
      allowCredentials: user.passkeys.map((passkey) => ({
        id: passkey.credentialID,
        transports: passkey.transports || [],
      })),
      userVerification: "preferred",
    });

    req.session.currentChallenge = options.challenge;
    req.session.passkeyLoginUserId = user._id.toString();

    res.json(options);
  } catch (error) {
    next(error);
  }
};

// PASSKEY LOGIN VERIFY
export const passkeyLoginVerify = async (req, res, next) => {
  try {
    const { email } = req.body;
    const credential = req.body.credential || req.body.response;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!credential || !credential.id || !credential.response) {
      return res.status(400).json({
        message: "Invalid passkey response from browser",
      });
    }

    const expectedChallenge = req.session.currentChallenge;
    const sessionUserId = req.session.passkeyLoginUserId;

    if (!expectedChallenge || !sessionUserId) {
      return res.status(400).json({
        message: "Passkey session expired. Try again.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const dbPasskey = user.passkeys.find(
      (passkey) => passkey.credentialID === credential.id
    );

    if (!dbPasskey) {
      return res.status(400).json({ message: "Unknown passkey" });
    }

    const verification = await verifyAuthenticationResponse({
      response: credential,
      expectedChallenge,
      expectedOrigin: origin(),
      expectedRPID: rpID(),

      credential: {
        id: dbPasskey.credentialID,
        publicKey: Buffer.from(dbPasskey.credentialPublicKey, "base64url"),
        counter: dbPasskey.counter,
        transports: dbPasskey.transports || [],
      },
    });

    if (!verification.verified) {
      return res.status(400).json({
        message: "Passkey login failed",
      });
    }

    dbPasskey.counter = verification.authenticationInfo.newCounter;

    req.session.currentChallenge = null;
    req.session.passkeyLoginUserId = null;

    await user.save();

    res.json(publicUser(user));
  } catch (error) {
    next(error);
  }
};

// GOOGLE / FACEBOOK OAUTH SUCCESS
export const oauthSuccess = (req, res) => {
  const token = generateToken(req.user._id);

  const params = new URLSearchParams({
    token,
    name: req.user.name || "",
    email: req.user.email || "",
    role: req.user.role || "user",
    id: req.user._id.toString(),
  });

  res.redirect(`${process.env.CLIENT_URL}/oauth-success?${params.toString()}`);
};