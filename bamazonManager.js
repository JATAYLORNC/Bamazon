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

  invManage();
});

function invManage() {

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
      vprod();
    } else if (answer.choice === "View Low Inventory") {
      vlowinv();
    } else if (answer.choice === "Add to Inventory") {
      addinv();
    } else if (answer.choice === "Add New Product") {
      addnewprod();
    }
  });
}

function vprod() {

  connection.query("SELECT * FROM product",
    function(err, result) {
      if(err) {
        console.log(err);
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

function vlowinv() {
  connection.query("SELECT * FROM product WHERE stock_quantity < 5",
    function(err, result) {
      if(err) {
        console.log(err);
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

function addinv() {

  vprod();

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

    var itemID = parseInt(answer.item_id);
    var addQty = parseInt(answer.add_qty);

    if(typeof addQty === "number") {

      connection.query("UPDATE product SET stock_quantity = stock_quantity + ? WHERE item_id = ?",
        [addQty, itemID],          
        function(err, result) {
          if(err) {
            console.log(err);
          }

          console.log("\n Stock Quantity of item " + itemID + " increased by " + addQty + " units.");

          vprod();
        }
      );
    } else {
      addinv();
    }
  });
}

function addnewprod() {

  inquirer.prompt([
    {
      name: "prod_name",
      type: "input",
      message: "What is the name of the product you'd like to add?"
    },
    {
      name: "prod_dept",
      type: "input",
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

    var prodName = answer.prod_name;
    var prodDept = answer.prod_dept;
    var prodPrice = parseInt(answer.prod_price);
    var prodQty = parseInt(answer.prod_qty);

    connection.query("INSERT INTO product SET ?",
        [
          {
            product_name: prodName,
            department_name: prodDept,
            price: prodPrice,
            stock_quantity: prodQty
          }
        ],
        function(err, result) {
          if(err) {
            console.log(err);
          }

          console.log(result.affectedRows + " new record added.  New item_id = " + result.insertId + "\n");

          vprod();
        }
      );
  });
}