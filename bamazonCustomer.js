'use-strict'

// DECLARING VARIABLES TO USE FOR NODE PACKAGES
// ===============================================================

var mysql = require('mysql');
var inquirer = require('inquirer');

// CONNECTING TO SQL DB
// ===============================================================

var connection = mysql.createConnection({
    host: 'localhost', // update with host
    port: 3306, // update with port
    user: 'root', // update with user id
    password: '', // update with user password
    database: 'BAMAZON' // update with created database
});

// connecting to db, and displaying connection id
connection.connect(function(err) {

    // error catcher
    if (err) throw err;

    console.log("\nConnected to database BAMAZON on thread " + connection.threadId);

    // call display cars function 
    displayProducts();

    // terminate sql connection
    // terminateConnection();
});

// FUNCTIONS TO QUERY SQL DATABASE
// ===============================================================

// function to display all cars that are currently for sale
var displayProducts = function() {

    // var to hold our SQL query
    let sqlQuery = "SELECT ITEM_ID, PRODUCT_NAME, PRICE FROM PRODUCTS";

    // query to render available products from database
    connection.query(sqlQuery, function(err, res) {

        // error catcher
        if (err) throw err;

        console.log("\n-------------------------------------------------------------------------");
        console.log("| Here is a list of all of the cars available at our Bamazon storefront.|");
        console.log("-------------------------------------------------------------------------\n");

        // for loop to run through our data array
        for (var i = 0; i < res.length; i++) {

            // render data to log
            console.log("ID:", res[i].ITEM_ID, "\nCAR:", res[i].PRODUCT_NAME, "\nPRICE: $", res[i].PRICE);
            console.log("\n------------------------------\n");
        }

        // prompt user about purchases
        promptCustomer();
    })
}

// function to prompt user what they would like to buy
var promptCustomer = function() {

    // prompt user what they would like to purchase
    inquirer.prompt([{
        name: "buyingID",
        message: "What is the ID of the vehicle that you would like to purchase?",
        type: "input",
    }, {
        name: "buyingQuanity",
        message: "How many vehicles would you like to purchase?",
        type: "input"
    }]).then(function(customerResponse) {

        // SQL query
        let sqlQuery = "SELECT * FROM PRODUCTS WHERE ITEM_ID = ?";

        // selecting data from our database
        connection.query(sqlQuery, [customerResponse.buyingID], function(err, res) {

            // err catcher
            if (err) throw err;

            // var to hold buying price
            let buyingPriceTotal = res[0].PRICE;
            
            // if else to check if stock available
            if (customerResponse.buyingQuanity < res[0].STOCK_QUANITY) { // fulfill order

                // var to hold sql query
                let sqlQuery = "UPDATE PRODUCTS SET STOCK_QUANITY = STOCK_QUANITY - ? WHERE ITEM_ID = ?";

                // query to update our database
                connection.query(sqlQuery, [customerResponse.buyingQuanity, customerResponse.buyingID], function(err, res) {

                    // err catcher
                    if (err) throw err;

                    // provide customer with order details
                    console.log("\nThank you, your order has been submitted successfuly. \n\nYour total that will be billed is: $", buyingPriceTotal * customerResponse.buyingQuanity);
                })

                // terminate the sql connection
                terminateConnection();
            }
            else { 

                // cancel order
                console.log("Sorry, there is an insufficient quantity of that vehicle in stock right now, please try again at a later time, or select another vehicle to purchase.");

                // ask customer to choose another vehicle, or quit application.
                promptCustomer();
            }
        })
    })
}

// function to terminate the application
var terminateConnection = function() {

    // terminating connection
    connection.end(function(err) {

        // error catcher
        if (err) throw err;

        // The connection is terminated now 
        console.log("\nYour SQL connection has been terminated.\n");
    })
}
