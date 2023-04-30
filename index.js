import readline from "readline";
import { spawn } from "child_process";

const outputData = (output) => {
  process.stdout.write(
    `${output} \n\x1b[30m\x1b[36m${process.cwd()} \x1b[32mTerminal> \x1b[0m`
  );
};

const parseInput = (inputs) => {
  const args = inputs.split(" ");
  const cmd = args[0];

  switch (cmd) {
    case "exit":
      commands.exit();
      break;
    case "cd":
      commands.cd(args.slice(1));
    default:
      break;
  }
};

const commands = {
  exit: () => {
    process.exit(1);
  },
  cd: (path) => {
    try {
      process.chdir(path[0]);
      outputData("Directory changed");
    } catch (err) {
      outputData(err.msg);
    }
  },
};

process.stdout.write(
  `\x1b[30m\x1b[36m${process.cwd()} \x1b[32mTerminal> \x1b[0m`
);

process.stdin.on("data", (args) => {
  args = args.toString().trim();
  parseInput(args);
});

process.on("SIGINT", function () {
  console.log("\nKilling child process");
  outputData("");
});

process.on("SIGTSTP", function () {
  console.log("\nPutting child process to background");
  outputData("");
});
