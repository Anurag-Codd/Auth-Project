import jwt from "jsonwebtoken";
import {client} from "../database/redis.js";

export const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("authAppToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

export const storeTempUser  = async (user) => {
  try {
    await client.set(user.verificationToken, JSON.stringify(user), "EX", 900);
  } catch (error) {
    console.error("Error storing temporary user:", error);
  }
};

export const getTempUserByToken = async (token) => {
  try {
    const userString = await client.get(token);
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error("Error retrieving temporary user by token:", error);
    return null;
  }
};

export const clearTempUser  = async (token) => {
  try {
    await client.del(token);
  } catch (error) {
    console.error("Error clearing temporary user by token:", error);
  }
};
