import express from "express"; import passport from "passport";
import { register, login, profile, passkeyRegisterOptions, passkeyRegisterVerify, passkeyLoginOptions, passkeyLoginVerify, oauthSuccess } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/register", register); router.post("/login", login); router.get("/profile", protect, profile);
router.post("/passkey/register-options", passkeyRegisterOptions); router.post("/passkey/register-verify", passkeyRegisterVerify);
router.post("/passkey/login-options", passkeyLoginOptions); router.post("/passkey/login-verify", passkeyLoginVerify);
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
    session: false,
  }),
  oauthSuccess
);
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"], session: false }));
router.get("/facebook/callback", passport.authenticate("facebook", { session: false, failureRedirect: `${process.env.CLIENT_URL}/login` }), oauthSuccess);
export default router;
