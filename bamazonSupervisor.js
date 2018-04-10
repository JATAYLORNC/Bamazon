//node package for mysql
var mysql = require("mysql");

//node package for inquirer to enable CLI prompts to user
var inquirer = require("inquirer");

//loads environment variables from .env file
//.env holds access keys for twitter and spotify APIs
require("dotenv").config();

//node package to print database query results to CLI in table format
const cTable = require('console.table');

//create connection to local host(server) bamazon database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: process.env.password,
  database: "bamazon"
});

//connect to bamazon database
connection.connect(function(err) {
  if (err) throw err;

  //call superisor management function
  superManage();
});

//supervisor management function
function superManage() {

  //prompt user for action to take
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

      //call function to view product sales
      vProdSales();
    } else if (answer.choice === "Create New Department") {

      //call function to create new department
      cDept();
    } 
  });
}

//function to view product sales
function vProdSales() {

  //left join query for department information from departments table and
  //the sum of all product sales from products table for each department
  connection.query("SELECT d.department_id, d.department_name, d.over_head_costs, " + 
  "SUM(p.product_sales) AS total_sales FROM departments AS d LEFT JOIN product AS p ON " + 
  "d.department_name = p.department_name GROUP BY d.department_name", 
    function(err, result) {
      if(err) {
        console.log(err);
      }

      //loop through results
      for(i=0; i<result.length; i++) {

        //compute total profit
        var totalProfit = result[i].total_sales - result[i].over_head_costs;

        //push total profit as new item in result object array
        //ensure profit is fixed to 2 digits after decimal
        result[i].total_profit = totalProfit.toFixed(2);
      }

      // print results to CLI in table format
      console.log("\n");
      console.table(result);
    }
  );

  //end connection to bamazon
  connection.end(function(err) {
    if(err) {
      console.log(err);
    }
  });
}

//call function to create new department
function cDept() {

  //prompt user for required information to add new record to departments table
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

    //store user responses in variables and convert to a number as required
    var deptName = answer.dept_name;
    var overHeadCosts = parseInt(answer.overhead_costs);

    //query bamzon to add new record to deparments table
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

          //message to user to indicate transaction was successful
          console.log(result.affectedRows + " new record added.  New department_id = " + result.insertId + "\n");
        }
      );

    //end connection to bamazon
    connection.end(function(err) {
      if(err) {
        console.log(err);
      }
    });
  });
}







