# Bamazon
Bamazon is a command line node app that presents a virtual storefront for the sales of items to customers while also providing additional views for a store manager to manage inventory and a supervisor to add departments and generate profit reports.  The following video demonstrates the various features of Bamazon:

[![](http://img.youtube.com/vi/Zr6D8Pcmdt8/0.jpg)](http://www.youtube.com/watch?v=Zr6D8Pcmdt8 "Bamazon Demo")

## About
Bamazon is a command line node app that is programmed in javascript and makes use of the following npm packages

* inquirer &ensp; Used to prompt the user for input (e.g. choose a letter, play again)

* mysql &ensp; Used for all sql database transactions

* console.table &ensp; Used to print database query results to CLI in table format

Bamazon utilizes a SQL database called bamazon that was set up with the following tables:

* product - stores all product related information including inventory and total sales

* departments - stores department names and overhead cost information
