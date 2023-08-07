import readline from "readline";
import fs from "fs";
import os from "os";
import { exec, execFile, spawn, fork } from "child_process";
import path from "path";
import { stderr, stdout } from "process";

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
    case "uptime":
      commands.uptime();
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
    case "code":
      commands.code(args.slice(1).join(" "));
      break;
    case "mkdir":
      commands.mkdir(args.slice(1).join(" "));
      break;
    case "rmdir":
      commands.rmdir(args.slice(1).join(" "));
      break;
    case "node": 
      commands.node();
      break;
    case "nano": 
      commands.nano(args.slice(1).join(" "));
      break;
    case "grep":
      commands.grep(args.slice(1), args.slice(2), args.slice(3));
      break;
    case "ps": 
      commands.ps(args.slice(1), args.slice(2), args.slice(3), args.slice(4));
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
  uptime: () => {
    console.log(process.uptime());
    outputData("");
  },
  cd: (path) => {
    try {
      process.chdir(path[0]);
      console.log("Directory changed" + "/n");
      outputData("");
    } catch (err) {
      console.log(err.message);
      outputData("");
    }
  },
  pwd: () => {
    console.log(process.cwd());
    outputData("");
  },
  ls: (folderPath) => {
    if (folderPath.length == 0) {
      folderPath = process.cwd();
    }
    if(folderPath == "-l"){
      exec(`ls ${folderPath}`, (error, stdout, stderr) => {
        if(error){
          console.error(`Error: ${error.message}`);
          return
        }
        console.log(`Command output: \n${stdout}`);
        outputData("");
      });
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
  nano: (filename) => {
    try {
      fs.readFileSync(filename);
    } catch (err) {
      console.log(`Got an error trying to write the file ${err.message}`);
      outputData("");
    }
  },
  code: (path) => {
    try {
      let vscodePath = "";
      if (os.platform() == "win32") {
        const command = spawn("where", ["code"]);
        command.stdout.on("data", (data) => {
          vscodePath = data.toString().trim();
          const code = spawn(vscodePath, [path]);
          // console.log(`\nParent process pid: ${command.pid}`);
          // console.log(`\nChild process pid: ${code.pid}`);
          outputData("");
        });
      }
      if (os.platform() == "linux") {
        const command = spawn("which", ["code"]);
        command.stdout.on("data", (data) => {
          vscodePath = data.toString().trim();
          const code = spawn(vscodePath, [path]);
          // console.log(command.pid);
          // console.log(code.pid);
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

  rmdir: (foldername) => {
    try {
      fs.rmdir(path.join(path.dirname(""), foldername), (err) => {
        if (err) return console.error(err);
      });
      console.log("Directory deleted successfully");
      outputData("");
    } catch (error) {
      outputData("");
    }
  },

  node: () => {
    try {
      execFile('node', ['--version'], (error, stdout, stderr) => {
        if(error){
          throw error;
        }
        console.log(stdout);
        outputData("");
      })
    } catch (error) {
      outputData("");
    }
  },

  grep: (options) => {
    const childProcess = spawn('grep', [`${options[0]}`, `${options[1]}`, `${options[2]}`]);
    childProcess.stdout.on("data", (data) => {
      console.log(`\n${data}`);
      outputData("");
    })
    childProcess.stderr.on('data', (data) => {
      console.error(`\nError output:${data}`);
      outputData("")
    });
    
    childProcess.on('close', (code) => {
      console.log(`\nCommand exited with code: ${code}`);
      outputData("")
    });
  },

  ps: (options) => {
    const childProcess = spawn('ps', [`${options[0]}`, `${options[1]}`, `${options[2]}`, `${options[3]}`]);
    childProcess.stdout.on("data", (data) => {
      console.log(`\n${data}`);
      outputData("");
    })
    childProcess.stderr.on('data', (data) => {
      console.error(`\nError output:${data}`);
    });
    
    childProcess.on('close', (code) => {
      console.log(`\nCommand exited with code: ${code}`);
      outputData("")
    });
  }
};

process.stdout.write(
  `\x1b[30m\x1b[36m${process.cwd()} \x1b[32mTerminal> \x1b[0m`
);

process.on('uncaughtException', (err, origin) => {
  fs.writeSync(process.stderr.fd, `\nCaught exception: ${err}\n` + `Exception origin: ${origin}`);
  outputData("");
});

process.stdin.on("data", (args) => {
  args = args.toString().trim();
  parseInput(args);
});

process.on("SIGINT", function () {
  console.log(`\nKilling child process with process id: ${process.pid}`);
  outputData("");
});

process.on("SIGTSTP", function () {
  console.log("\nPutting child process to background");
  outputData("");
});
