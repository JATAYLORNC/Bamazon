var mysql = require("mysql");

var inquirer = require("inquirer");

//loads environment variables from .env file
//.env holds access keys for twitter and spotify APIs
require("dotenv").config();

const cTable = require('console.table');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: process.env.password,
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;

  superManage();
});

function superManage() {

  inquirer.prompt([
    {
      name: "choice",
      type: "list",
      choices: [
        "View Product Sales by Department",
        "Create New Department"
      ],
      message: "What would you like to do?"
    }
  ]).then(function(answer) {
    
    if(answer.choice === "View Product Sales by Department") {
      vProdSales();
    } else if (answer.choice === "Create New Department") {
      cDept();
    } 
  });
}

  function vProdSales() {

    connection.query("SELECT d.department_id, d.department_name, d.over_head_costs, " + 
    "SUM(p.product_sales) AS total_sales FROM departments AS d LEFT JOIN product AS p ON " + 
    "d.department_name = p.department_name GROUP BY d.department_name", 
      function(err, result) {
        if(err) {
          console.log(err);
        }

        for(i=0; i<result.length; i++) {
          var totalProfit = result[i].total_sales - result[i].over_head_costs;
          result[i].total_profit = totalProfit.toFixed(2);
        }

        console.log("\n");
        console.table(result);
      }
    );

    connection.end(function(err) {
      if(err) {
        console.log(err);
      }
    });
  }

  function cDept() {

    inquirer.prompt([
      {
        name: "dept_name",
        type: "input",
        message: "What is the name of the new department?"
      },
      {
        name: "overhead_costs",
        type: "input",
        message: "What is the overhead cost for the new department?"
      }
    ]).then(function(answer) {
  
      var deptName = answer.dept_name;
      var overHeadCosts = answer.overhead_costs;
  
      connection.query("INSERT INTO departments SET ?",
          [
            {
              department_name: deptName,
              over_head_costs: overHeadCosts
            }
          ],
          function(err, result) {
            if(err) {
              console.log(err);
            }
  
            console.log(result.affectedRows + " new record added.  New department_id = " + result.insertId + "\n");
          }
        );

      connection.end(function(err) {
        if(err) {
          console.log(err);
        }
      });
    });
  }







