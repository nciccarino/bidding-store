var mysql = require("mysql"); 
var inquirer = require("inquirer"); 

//connection info for sql database
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	//your username 
	user: "root", 

	//your password 
	password: "",
	database: "bamazon"
}); 

connection.connect(function(err) {
	if (err) throw err; 
	console.log("\n Welcome to Bamazon!"); 
	console.log(""); 
	start(); 
}); 

//asks user to either look at a list of available items or pick one for purchase 
function start() {
	console.log(""); 
	inquirer.prompt([

		{
			type: "list", 
			name: "start", 
			message: "Choose an Option to Begin", 
			choices: ["Find a Product", "Purchase an Item"]
		}

	]).then(function(user) {
		switch(user.start) {
			case "Find a Product": 
			queryProducts(); 
			break;
			case "Purchase an Item":
			queryItem();  
			break; 
		}
	}); 
}; 

//queries current product list
function queryProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
  	if (err) throw err;
  	console.log("\n ID | Product | Department | Price | Quantity in Stock |"); 
  	console.log("");
    for (var i = 0; i < res.length; i++) {
      console.log("\n " + res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity + " | ");
    }
    console.log("-----------------------------------");
    start(); 
  });
}; 

//asks user to pick an item
function queryItem() {
	inquirer.prompt([
		{
			name: "item",
			type: "input",
			message: "Which item ID would you like to select?"
		}
	]).then(function(user) {
		connection.connect(function(err) {
			connection.query("SELECT * FROM products WHERE id = ?", [user.item], function(err, res) {
				if (err) throw err;
				for (var i = 0; i < res.length; i++) {
      	console.log("\n " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity + " | ");
    		} 
    		console.log(""); 
    		confirm(); 
			}); 
		});
	});
}; //end queryItem

//confirm if this is the correct item 
var confirm = function() {
	inquirer.prompt([

		{
			type: "confirm", 
			message: "Is this correct?", 
			name: "yes"
		}

	]).then(function(user){
		if (user.yes) {
			quantity(); 
		}
		else {
			queryItem();  
		}
	}); 
}; //end confirm

function quantity() {
	console.log("Quantity"); 
}
