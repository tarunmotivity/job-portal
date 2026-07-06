import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { refreshToken, logoutUser } from "../controllers/authController.js";

import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);


router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account", 
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    
    if (!req.user.role) {
      return res.redirect(
  `${process.env.CLIENT_URL}/select-role?token=${token}`
);
    }

    
    res.redirect(
  `${process.env.CLIENT_URL}/oauth-success?token=${token}&role=${req.user.role}&name=${req.user.name}&email=${req.user.email}`
);
  }
);




export default router;
