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
			choices: ["Find a Product", "Find a Product by Department", "Purchase an Item", "Exit Bamazon"]
		}

	]).then(function(user) {
		switch(user.start) {
			case "Find a Product": 
			queryProducts(); 
			break;
			case "Find a Product by Department":
			queryDepts();
			break; 
			case "Purchase an Item":
			queryItem();  
			break; 
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
    start(); 
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
    						start(); 
            });
        });
	});
}; 

//asks user to pick an item
function queryItem() {
	console.log(""); 
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
				var chosenItem;
				for (var i = 0; i < res.length; i++) {
				console.log("\n ID | Product | Department | Price | Quantity in Stock |");
      	console.log("\n " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity + " | "); 
    		console.log(""); 
    		chosenItem = res[i]; 
	    		inquirer.prompt([
						{
							name: "quantity",
							type: "input",
							message: "How many " + chosenItem.product_name + "(s) would you like?" 
						},
						{
							type: "confirm", 
							message: "Is this correct? By selecting Yes, you will be placing your order", 
							name: "yes"
						}
					]).then(function(answer) {
						if (answer.yes) {
							if (chosenItem.stock_quantity >= parseInt(answer.quantity)) {
								connection.query(
									"UPDATE products SET ? WHERE ?",
									[
										{
											stock_quantity: chosenItem.stock_quantity - answer.quantity
										},
										{
											id: chosenItem.id 
										}
									],
									function(err) {
										if (err) throw err;
										console.log("\n Order placed successfully!"); 
										console.log("\n Your Total is: $" + chosenItem.price * answer.quantity); 
										start();
									}
								);
							}
							else {
								console.log("\n Sorry! not enough " + chosenItem.product_name + "(s) in stock!");
								console.log("\n We have " + chosenItem.stock_quantity + " left."); 
								start(); 
							}
						} //answer yes
						else {
							start(); 
						}
					}); //second then function 
    		} //for statement
			}); //connection query
		}); //connection connect
	}); // then function 

}; //end queryItem

//exit function
function exit() {
	inquirer.prompt([
		{
			type: "confirm",
			name: "yes",
			message: "\n Would you like to leave Bamazon?" + "\n By clicking Yes you will Exit the page." + "\n By clicking No you can continue shopping."
		}
	]).then(function(user) {
		if (user.yes) {
			console.log("\n Come Back Soon!");
			process.exit(0); 
		}
		else {
			console.log("\n Glad to have you back!"); 
			start(); 
		}
	});
}