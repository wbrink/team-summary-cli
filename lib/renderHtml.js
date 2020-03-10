const path = require("path");
const fs = require("fs");

const renderEngineer = require("../templateRenderers/engineer");
const renderIntern = require("../templateRenderers/intern");
const renderManager = require("../templateRenderers/manager");
const renderMain = require("../templateRenderers/main");

let html = [];

// takes in array of employee objects
function renderHtml(employees) {
  employees.forEach(employee => {
    switch (employee.getRole()) {
      case "Manager":
        html.push(renderManager(employee.name, employee.id, employee.email, employee.officeNumber, employee.getRole()));
        break;
      case "Intern":
        html.push(renderIntern(employee.name, employee.id, employee.email, employee.school, employee.getRole()));
        break;
      case "Engineer":
        html.push(renderEngineer(employee.name, employee.id, employee.email, employee.github, employee.getRole()));
        break;
    }
    
    

  });

  let mainHTML = renderMain(html.join(""));
  return mainHTML;
}



module.exports = renderHtml;