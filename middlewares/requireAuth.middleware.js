import { config } from "../config/index.js";
import { logger } from "../services/logger.service.js";
import { asyncLocalStorage } from "../services/als.service.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config();


export function requireAuth(req, res, next) {
  const token = req.cookies?.loginToken;
  console.log("tokem: ", token);
  if (!token) return res.status(401).send("Not Authenticated");

  try {
    const loggedinUser = jwt.verify(token, process.env.JWT_SECRET);
    req.loggedinUser = loggedinUser;
    return next();
  } catch (err) {
    console.error("Token verification failed", err);
    res.status(401).send("Invalid Token");
  }
  return next();
}

export function requireAdmin(req, res, next) {
  const { loggedinUser } = asyncLocalStorage.getStore();

  if (!loggedinUser) return res.status(401).send("Not Authenticated");
  if (!loggedinUser.isAdmin) {
    logger.warn(loggedinUser.fullname + "attempted to perform admin action");
    res.status(403).end("Not Authorized");
    return;
  }
  next();
}
