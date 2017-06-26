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
	console.log("\n Bamazon Manager Page"); 
	console.log(""); 
	startManager(); 
}); 

function startManager() {
	console.log(""); 
	inquirer.prompt([

		{
			type: "list", 
			name: "start", 
			message: "Choose an Option to Begin", 
			choices: ["View Products for Sale", "Find a Product by Department", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit Bamazon"]
		}

	]).then(function(user) {
		switch(user.start) {
			case "View Products for Sale": 
			queryProducts(); 
			break;
			case "Find a Product by Department":
			queryDepts();
			break; 
			// case "View Low Inventory":
			 
			// break; 
			// case "Add to Inventory"

			// break; 
			// case "Add New Product"

			// break; 
			case "Exit Bamazon":
			exit(); 
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
    console.log("\n-----------------------------------");
    startManager(); 
  });
}; 

//find products by Department
function queryDepts() {
	console.log("\n Departments");
	console.log("\n Appliances | Electronics | Fitness | Furniture | Patio,_Lawn_&_Garden | Sports_&_Outdoor |")
	inquirer.prompt([

	{
		type: "input", 
		name: "name",
		message: "Choose a Department"
	}

	]).then(function(user) {
		connection.connect(function(err){
            connection.query("SELECT * FROM products WHERE department_name = ?", [user.name], function(err, res){
                if (err) throw err;
                console.log("\n" + user.name);
                for (var i = 0; i < res.length; i++) {
      						console.log("\n " + res[i].id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity + " | ");
    						}
    						console.log("\n-----------------------------------");
    						startManager(); 
            });
        });
	});
}; 

function exit() {
	inquirer.prompt([
		{
			type: "confirm",
			name: "yes",
			message: "\n Would you like to leave the Bamazon Manager Page?" + "\n By clicking Yes you will Exit the page." + "\n By clicking No you can continue working."
		}
	]).then(function(user) {
		if (user.yes) {
			console.log("\n Come Back Soon!");
			process.exit(0); 
		}
		else {
			console.log("\n Glad to have you back!"); 
			startManager(); 
		}
	});
}