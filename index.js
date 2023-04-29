import * as readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("What is your name?", (answer) => {
  console.log(`Hello, ${answer}!`);
  rl.close();
});
