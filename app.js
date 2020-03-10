const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const renderHTML = require("./lib/renderHtml");

// regular expression for emails (credit: https://emailregex.com/)
let re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

let questions = [
  {
    type: "list",
    name: "employeeType",
    message: "Employee Type: ",
    choices: ["Manager", "Engineer", "Intern"]
  },
  {
    type: "input",
    name: "name",
    message: "Name: ",
  },
  {
    type: "number",
    name: "id",
    message: "ID: ",
  },
  {
    type: "input",
    name: "email",
    message: "Email: ",
    validate: function(value) {
      var pass = value.match(re);
      if (pass) return true;
      return "Please Enter A Valid Email Address"
    }
  },
  {
    type: "input",
    name: "github",
    message: "Github: ",
    when: function(answers) {
      const value = answers.employeeType == "Engineer" ? true : false;
      return value;
    }
  },
  {
    type: "input",
    name: "school",
    message: "School: ",
    when: function(answers) {
      const value = answers.employeeType == "Intern" ? true : false;
      return value;
    }
  },
  {
    type: "input",
    name: "officeNumber",
    message: "Office Number: ",
    when: function(answers) {
      const value = answers.employeeType == "Manager" ? true : false;
      return value;
    }
  },

  {
    type: "confirm",
    name: "addEmployee",
    message: "Add another Employee"
  }
]

let employees = [];

// function that allows us to loop with promises
async function promptLoop() {
  let bool = false;
  do {
    const answers = await inquirer.prompt(questions);
    
    // add employees to array
    switch (answers.employeeType) {
      case "Manager":
        let manager = new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
        employees.push(manager);
        break;
      case "Engineer":
        let engineer = new Engineer(answers.name, answers.id, answers.email, answers.github);
        employees.push(engineer);
        break;
      case "Intern":
        let intern = new Intern(answers.name, answers.id, answers.email, answers.school);
        employees.push(intern);
        break;
    }

    bool = answers.addEmployee;
  }
  while (bool);

  // async functions return a promise
  return "success" 
}
//

async function main() {
  await promptLoop();

  // call function to render team html
  let html = renderHTML(employees);
  
  fs.writeFile(outputPath, html, (err) => {
    if (err) throw err;
    console.log("wrote html file");
  })


}

main();



// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// here
// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.

// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

//done
// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

//done
// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an 
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work!```
