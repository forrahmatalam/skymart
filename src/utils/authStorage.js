// Centralized localStorage helpers for authentication.
// This is a frontend-only demo. Passwords are stored in plain text in
// localStorage purely to simulate an account system - this is NOT secure
// and should never be used as a pattern for a real production app.

const USERS_KEY = "skymart_users";
const CURRENT_USER_KEY = "skymart_current_user";

function readUsers() {
  try {
    const rawUsers = localStorage.getItem(USERS_KEY);
    return rawUsers ? JSON.parse(rawUsers) : [];
  } catch (error) {
    console.error("Failed to read stored users:", error);
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function findUserByEmail(email) {
  const users = readUsers();
  const normalizedEmail = email.trim().toLowerCase();
  return users.find((user) => user.email.toLowerCase() === normalizedEmail);
}

export function createUser({ name, email, password }) {
  const users = readUsers();

  const newUser = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  writeUsers(users);

  return newUser;
}

export function updateStoredUser(userId, updates) {
  const users = readUsers();
  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    return null;
  }

  const updatedUser = { ...users[userIndex], ...updates };
  users[userIndex] = updatedUser;
  writeUsers(users);

  return updatedUser;
}

export function setCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function getStoredCurrentUser() {
  try {
    const rawUser = localStorage.getItem(CURRENT_USER_KEY);
    return rawUser ? JSON.parse(rawUser) : null;
  } catch (error) {
    console.error("Failed to read current user:", error);
    return null;
  }
}
