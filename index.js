import readline from "readline";
import fs from "fs";
import os from "os";
import { exec, spawn } from "child_process";
import path from "path";

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
    case "pwd":
      commands.pwd();
      break;
    case "ls":
      commands.ls(args.slice(1).join(" "));
      break;
    case "cat":
      commands.cat(args.slice(1).join(" "));
      break;
    case "nano":
      commands.nano(args.slice(1).join(" "));
      break;
    case "code":
      commands.code(args.slice(1).join(" "));
      break;
    case "mkdir":
      commands.mkdir(args.slice(1).join(" "));
      break;
    default:
      if (cmd.length == 0) {
        process.stdout.write(
          `\x1b[30m\x1b[36m${process.cwd()} \x1b[32mTerminal> \x1b[0m`
        );
      }
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
  pwd: () => {
    outputData(process.cwd());
  },
  ls: (folderPath) => {
    if (folderPath.length == 0) {
      folderPath = process.cwd();
    }
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        outputData(err.message);
      } else {
        files.forEach((file) => {
          process.stdout.write(`${file}  `);
        });
        outputData("");
      }
    });
  },
  cat: (filename) => {
    // const child = spawn("cat", [filename]);
    // child.stdout.on("data", (data) => {
    //   console.log(data.toString());
    // });
    try {
      const data = fs.readFileSync(filename);
      console.log(data.toString());
      outputData("");
    } catch (err) {
      console.log(`Got an error trying to read the file ${err.message}`);
      outputData("");
    }
  },
  // nano: (filename) => {
  //   try {
  //     fs.writeFileSync(filename);
  //   } catch (err) {
  //     console.log(`Got an error trying to write the file ${err.message}`);
  //     outputData("");
  //   }
  // },
  code: (path) => {
    try {
      let vscodePath = "";
      if (os.platform() == "win32") {
        const command = spawn("where", ["code"]);
        command.stdout.on("data", (data) => {
          vscodePath = data.toString().trim();
          const code = spawn(vscodePath, [path]);
          console.log(command.pid);
          console.log(code.pid);
          outputData("");
        });
      }
      if (os.platform() == "linux") {
        const command = spawn("which", ["code"]);
        command.stdout.on("data", (data) => {
          vscodePath = data.toString().trim();
          const code = spawn(vscodePath, [path]);
          console.log(command.pid);
          console.log(code.pid);
          outputData("");
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  mkdir: (foldername) => {
    try {
      fs.mkdir(path.join(path.dirname(""), foldername), (err) => {
        if (err) return console.error(err);
      });
      console.log("Directory created successfully");
      outputData("");
    } catch (error) {
      console.log(error);
      outputData("");
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
