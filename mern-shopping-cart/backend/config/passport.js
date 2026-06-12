import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import User from "../models/User.js";

const createOrFindOAuthUser = async ({ name, email, provider, providerId }) => {
  let user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    user = await User.create({
      name,
      email: email.toLowerCase(),
      provider,
      providerId,
      password: undefined,
      role: "user",
      passkeys: [],
    });
  }

  return user;
};

export const setupPassport = () => {
  const serverUrl = process.env.SERVER_URL || "http://localhost:5001";

  console.log("Checking OAuth ENV values...");
  console.log("GOOGLE_CLIENT_ID exists:", Boolean(process.env.GOOGLE_CLIENT_ID));
  console.log(
    "GOOGLE_CLIENT_SECRET exists:",
    Boolean(process.env.GOOGLE_CLIENT_SECRET)
  );
  console.log("FACEBOOK_APP_ID exists:", Boolean(process.env.FACEBOOK_APP_ID));
  console.log(
    "FACEBOOK_APP_SECRET exists:",
    Boolean(process.env.FACEBOOK_APP_SECRET)
  );

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      "google",
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: `${serverUrl}/api/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value;

            if (!email) {
              return done(null, false, {
                message: "No email received from Google",
              });
            }

            const user = await createOrFindOAuthUser({
              name: profile.displayName || "Google User",
              email,
              provider: "google",
              providerId: profile.id,
            });

            return done(null, user);
          } catch (error) {
            return done(error, null);
          }
        }
      )
    );

    console.log("Google OAuth strategy loaded");
  } else {
    console.log("Google OAuth strategy NOT loaded");
  }

  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(
      "facebook",
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_APP_SECRET,
          callbackURL: `${serverUrl}/api/auth/facebook/callback`,
          profileFields: ["id", "displayName", "emails"],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email =
              profile.emails?.[0]?.value || `${profile.id}@facebook.local`;

            const user = await createOrFindOAuthUser({
              name: profile.displayName || "Facebook User",
              email,
              provider: "facebook",
              providerId: profile.id,
            });

            return done(null, user);
          } catch (error) {
            return done(error, null);
          }
        }
      )
    );

    console.log("Facebook OAuth strategy loaded");
  } else {
    console.log("Facebook OAuth strategy NOT loaded");
  }

  return passport;
};

export default passport;