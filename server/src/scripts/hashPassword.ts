import bcrypt from "bcryptjs";

const password = "Admin@123";
const hashed = bcrypt.hash(password, 10);
console.log("password", hashed);
