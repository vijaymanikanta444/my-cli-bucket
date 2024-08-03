#!/usr/bin/env node

// Import required modules
import { Command } from "commander"; // Import Commander for CLI argument parsing
import simpleGit from "simple-git"; // Import Simple-Git for Git operations
import chalk from "chalk"; // Import Chalk for colorful console output
import { mkdirSync, readdirSync, existsSync } from "fs"; // Import mkdirSync to create directories
import { execSync } from "child_process"; // Import execSync to run shell commands
import process from "process"; // Import process to change the working directory
import path from "path";

// Create a new Command instance
const program = new Command();
// Initialize Simple-Git
const git = simpleGit();

// Define the CLI command
program
  .version("1.0.0") // Set version of the CLI tool
  .description("CLI to clone a boilerplate React application for TODO") // Describe what the tool does
  .argument("<app-name>", "name of the application") // Define the argument for the application name
  .action(async (appName) => {
    try {
      // Path for the new application directory
      const appPath = path.resolve(process.cwd(), appName);

      // Check if the directory already exists
      if (existsSync(appPath)) {
        // Check if the directory is empty
        const files = readdirSync(appPath);
        if (files.length > 0) {
          throw new Error("Destination directory is not empty.");
        }
      } else {
        // Create the directory for the new application
        mkdirSync(appPath);
      }
      // Change the current working directory to the newly created app directory
      try {
        process.chdir(appPath);
        console.log(chalk.blue(`Changed working directory to ${appPath}`));
      } catch (chdirError) {
        throw new Error(
          `Failed to change directory to ${appPath}: ${chdirError.message}`
        );
      }
      // Initialize a new git repository
      await git.init();
      console.log(chalk.blue(`Initialized git inside the PATH : ${appPath}`));

      // URL of the boilerplate repository (replace this with your own URL)
      const boilerplateRepo =
        "git@github.com:vijaymanikanta444/react-todos.git";
      // Clone the boilerplate repository into the current directory
      try {
        await git.clone(boilerplateRepo, appPath, ["--verbose"]);
        console.log(
          chalk.blue(
            "Cloned boilerplate repository into the current directory."
          )
        );
      } catch (cloneError) {
        throw new Error(`Failed to clone repository: ${cloneError.message}`);
      }
      // Install dependencies using npm
      console.log(chalk.blue("Installing dependencies...")); // Log message in blue color
      execSync("npm install", { stdio: "inherit" }); // Execute npm install command

      console.log(chalk.green("React application created successfully!")); // Log success message in green color
      console.log(chalk.yellow("Run `npm start` to start your application.")); // Log message with instruction in yellow color
    } catch (error) {
      // Handle errors
      console.error(chalk.red("Error creating application:"), error.message); // Log error message in red color
    }
  });

// Parse command-line arguments
program.parse(process.argv);
