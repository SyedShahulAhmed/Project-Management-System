import dotenv from 'dotenv';
dotenv.config();


console.log("Hello Backend ");
let u = process.env.NAME;
let p = process.env.PASSWORD;
console.log(p);
console.log(`Welcome, ${u}!`);