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

  if (err) { 
    console.log(err);
  }

  // call inventory management function
  invManage();
});

//inventory management function
function invManage() {

  //prompt inventory manager to confirm what action to take
  inquirer.prompt([
    {
      name: "choice",
      type: "list",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product"
      ],
      message: "How would you like to manage inventory?"
    }
  ]).then(function(answer) {
    
    if(answer.choice === "View Products for Sale") {

      //call function to view all products for sale
      vprod();
    } else if (answer.choice === "View Low Inventory") {

      //call function to view all products with low inventory
      vlowinv();
    } else if (answer.choice === "Add to Inventory") {

      //call function to add inventory to a specific item
      addinv();
    } else if (answer.choice === "Add New Product") {

      //call function to add a new product for sale
      addnewprod();
    }
  });
}

//function to view all products for sale
function vprod() {

  //query bamazon database for all product table records
  connection.query("SELECT * FROM product",
    function(err, result) {

      if(err) {
        console.log(err);
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

//function to view all products with low inventory
function vlowinv() {

  //query database for all records in product table with stock quantity < 5
  connection.query("SELECT * FROM product WHERE stock_quantity < 5",
    function(err, result) {
      if(err) {
        console.log(err);
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

//function to add inventory to a specific item
function addinv() {

  //query bamazon database for all product table records
  connection.query("SELECT * FROM product",
    function(err, result) {

      if(err) {
        console.log(err);
      }

      // print results to CLI in table format
      console.log("\n");
      console.table(result);
    }
  );

  //prompt user to determine which item to increase inventory an by how many
  inquirer.prompt([
    {
      name: "item_id",
      type: "input",
      message: "Enter the ID # of the item which you want to add inventory to."
    },
    {
      name: "add_qty",
      type: "input",
      message: "How many units would you like to add to the inventory?"
    }
  ]).then(function(answer) {

    //store user responses in variables and convert to numbers
    var itemID = parseInt(answer.item_id);
    var addQty = parseInt(answer.add_qty);

    if(typeof addQty === "number") {

      //query bamazon database to increase inventory by addQty for itemID
      connection.query("UPDATE product SET stock_quantity = stock_quantity + ? WHERE item_id = ?",
        [addQty, itemID],          
        function(err, result) {
          if(err) {
            console.log(err);
          }

          //message to user that transaction was successful
          console.log("\n Stock Quantity of item " + itemID + " increased by " + addQty + " units.");

          //call function to display table of all products to show new inventory quantity
          vprod();
        }
      );
    } else {
      //call back function to add inventory if user did not enter a number
      addinv();
    }
  });
}

//function to add a new product for sale
function addnewprod() {

  //query bamazon departments table to get all deparment names
  connection.query("SELECT * FROM departments", function(err, results) {

    //error handling
    if(err) {
      console.log(err);
    }

    console.log("\n");

    //prompt user for data needed to add a new record to products table
    inquirer.prompt([
      {
        name: "prod_name",
        type: "input",
        message: "What is the name of the product you'd like to add?"
      },
      {
        name: "prod_dept",
        type: "list",
        choices: function() {
          var choiceArray = [];
          for (var i = 0; i < results.length; i++) {
            choiceArray.push(results[i].department_name);
          }
          return choiceArray;
        },
        message: "What department does the product belong to?"
      },
      {
        name: "prod_price",
        type: "input",
        message: "What is the price of the product?"
      },
      {
        name: "prod_qty",
        type: "input",
        message: "How many units would you like to add to the inventory?"
      }
    ]).then(function(answer) {

      //store user responses in variables and convert appropriate values to numbers
      var prodName = answer.prod_name;
      var prodDept = answer.prod_dept;
      var prodPrice = parseFloat(answer.prod_price);
      var prodQty = parseFloat(answer.prod_qty);
      var prodSales = 0;

      //query bamazon to insert new record into products table
      connection.query("INSERT INTO product SET ?",
          [
            {
              product_name: prodName,
              department_name: prodDept,
              price: prodPrice,
              stock_quantity: prodQty,
              product_sales: 0
            }
          ],
          function(err, result) {
            if(err) {
              console.log(err);
            }

            //messsage to user to indicate that transaction was successful
            console.log("\n" + result.affectedRows + " new record added.  New item_id = " + result.insertId + "\n");

            //call function to display table of all products to show new item for sale
            vprod();
          }
        );
    });
  });
}