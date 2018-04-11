//node package for mysql
var mysql = require("mysql");

//node package for inquirer to enable CLI prompts to user
var inquirer = require("inquirer");

//loads environment variables from .env file
//.env holds access keys for twitter and spotify APIs
require("dotenv").config();

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

  //call purchaseItem function
  purchaseItem();
});

//purchaseItem function
function purchaseItem() {

  //query bamazon product table for all products that are for sale
  connection.query("SELECT * FROM product", function(err, results) {

    //error handling
    if(err) {
      console.log(err);
    }

    //CLI display of items for sale
    console.log("\n Items For Sale: \n");

    //loop through query results
    for(i=0; i< results.length; i++) {

      //print each record to the CLI
      console.log(results[i].item_id + ": " + results[i].product_name + " - $" + results[i].price);
    }

    console.log("\n");

    //prompt user for which items to purchase and how many
    inquirer.prompt([
      {
        name: "choice",
        type: "list",
        choices: function() {
          var choiceArray = [];
          for (var i = 0; i < results.length; i++) {
            choiceArray.push(results[i].product_name.toString());
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

      //loop through query results to confirm which record is the item_id being purchased
      for(var i=0; i< results.length; i++) {

        //check if query result is item user wishes to purchase
        if(results[i].product_name === answer.choice) {
          
          //save purchase item record in variable
          chosenItem = results[i];
        }
      }
      
      //check if item being purchased is in stock
      if(chosenItem.stock_quantity < parseInt(answer.quantity)) {

        //message user that item is not in stock
        console.log("I'm sorry but we don't have that many in stock!");

        //call function to allow user to purchase another item
        purchaseItem();
      } else {

        //calculate cost of item(s) being purchased
        var cost = chosenItem.price * answer.quantity;

        //ensure cost is fixed to 2 digits after decimal
        cost = cost.toFixed(2);

        //message user to indicate order acceptance and total cost of purchase
        console.log("\n Your order has been accepted.  The total cost of your purchase is $" + cost);

        //calculte new inventory quantity after purchase
        var newInventoryQty = chosenItem.stock_quantity - parseInt(answer.quantity);

        //calculatenew total product sales for purchased item
        var prodSales = chosenItem.product_sales + cost;

        //query bamazon to update inventory quantity and product sales fields for purchase item
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

        //end connection to bamazon
        connection.end(function(err) {
          if(err) {
            console.log(err);
          }
        });
      }
    });
  });
}

