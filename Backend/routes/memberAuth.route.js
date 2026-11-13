import express from "express";

import {
  registerMember,
  loginMember,
  logoutMember,
 
  
} from "../controllers/memberAuth.controller.js";

const memberAuthRouter = express.Router();

// Member Registration
memberAuthRouter.post("/register", registerMember);

// Member Login
memberAuthRouter.post("/login", loginMember);

// Member Logout
memberAuthRouter.post("/logout", logoutMember);



export default memberAuthRouter;

