var mysql = require("mysql");

var inquirer = require("inquirer");

//loads environment variables from .env file
//.env holds access keys for twitter and spotify APIs
require("dotenv").config();

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

  purchaseItem();
});


function purchaseItem() {
  connection.query("SELECT * FROM product", function(err, results) {
    if(err) throw err;
    console.log("\n Items For Sale: \n");

    for(i=0; i< results.length; i++) {
      console.log(results[i].item_id + ": " + results[i].product_name + " - $" + results[i].price);
    }

    console.log("\n");

    inquirer.prompt([
      {
        name: "choice",
        type: "list",
        choices: function() {
          var choiceArray = [];
          for (var i = 0; i < results.length; i++) {
            choiceArray.push(results[i].item_id.toString());
          }
          return choiceArray;
        },
        message: "What item would you like to purchase?"
      },
      {
        name: "quantity",
        type: "input",
        message: "How many would you like to purchase?"
      }
    ]).then(function(answer) {

      var chosenItem;

      for(var i=0; i< results.length; i++) {

        if(results[i].item_id === parseInt(answer.choice)) {
          chosenItem = results[i];
        }
      }
      
      if(chosenItem.stock_quantity < parseInt(answer.quantity)) {
        console.log("I'm sorry but we don't have that many in stock!");
        purchaseItem();
      } else {

        var cost = chosenItem.price * answer.quantity;
        cost = cost.toFixed(2);
        console.log("\n Your order has been accepted.  The total cost of your purchase is $" + cost);

        var newInventoryQty = chosenItem.stock_quantity - parseInt(answer.quantity);

        var prodSales = chosenItem.product_sales + cost;

        connection.query("UPDATE product SET ? WHERE ?",
          [
            {
              stock_quantity: newInventoryQty,
              product_sales: prodSales
            },
            {
              item_id: chosenItem.item_id
            }
          ],
          function(err, res) {
            if (err) throw err;
          }
        );
        connection.end(function(err) {
          if(err) {
            console.log(err);
          }
        });
      }
    });
  });
}

