// src/auth.js
import { account } from "../lib/appwrite";

// Sign up
export async function signup(email, password, username) {
  return await account.create("unique()", email, password, username);
}

// Login
export async function login(email, password) {
    return await account.createEmailPasswordSession(email, password);
}

// Get current user
export async function getCurrentUser() {
  return await account.get();
}

// Logout
export async function logout() {
  return await account.deleteSession("current");
}

// Update name
export async function updateName(name) {
  return await account.updateName(name);
}

// Update email (requires password)
export async function updateEmail(email, password) {
  return await account.updateEmail(email, password);
}

// Update password
export async function updatePassword(newPassword, oldPassword) {
  return await account.updatePassword(newPassword, oldPassword);
}