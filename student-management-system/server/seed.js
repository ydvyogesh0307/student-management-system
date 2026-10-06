// Fills the database with sample students so you can try search, filters and pagination.
// Usage: npm run seed
import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Student from "./models/Student.js";

const first = ["Aarav", "Diya", "Rohan", "Isha", "Kabir", "Meera", "Vivaan", "Anaya", "Arjun", "Saanvi", "Karan", "Riya"];
const last = ["Sharma", "Verma", "Singh", "Gupta", "Mehta", "Yadav", "Malik", "Chauhan", "Joshi", "Nair"];
const courses = ["Computer Science", "Mechanical", "Electronics", "Civil", "Business Administration"];

const students = Array.from({ length: 42 }, (_, i) => {
  const f = first[i % first.length];
  const l = last[(i * 3) % last.length];
  return {
    name: `${f} ${l}`,
    email: `${f}.${l}${i + 1}@example.com`.toLowerCase(),
    rollNumber: `STU${String(1001 + i)}`,
    course: courses[i % courses.length],
    year: (i % 4) + 1,
    phone: `98${String(10000000 + i * 7919).slice(0, 8)}`,
    status: i % 7 === 0 ? "Inactive" : "Active",
  };
});

await connectDB();
await Student.deleteMany({});
await Student.insertMany(students);
console.log(`Seeded ${students.length} students`);
await mongoose.disconnect();
