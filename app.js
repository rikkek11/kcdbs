//const http = require('http');

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var app = express();
var mongojs = require('mongojs');
var $ = require('jquery');
var ObjectId = mongojs.ObjectId;
var http = require('http');

var fs = require('fs');

var db = mongojs('customersdbs', ['customers']);
const port = 3000;
const host = "85.220.5.86";

/*
var logger = function(req, res, next){
	console.log('logging...');
	next();
}

app.use(logger);
*/


//View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



//Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Global Variables
app.use(function(req, res, next){
	res.locals.errors = null;
	next();
});

//ExpressValidator middleware

app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		var namespace = param.split('.'),
		root = namespace.shift(),
		formParam = root;
		
		while (namespace.length){
			formParam += '[' + namespace.shift(); + ']';
		}
		return {
			param : formParam,
			msg : msg,
			value : value
		};
	}
}));

//Set static path
app.use(express.static(path.join(__dirname, 'client')));


function send404Response(response){
	response.writeHead(404, {"Content-type": "text/plain"});
	response.write("Error 404: Page not found!");
	response.end();
}



function onRequest(request, response){
	//if(request.method == 'GET' && request.url == '/'){
		app.get('/', function(req, res){
		db.customers.find(function (err, docs){
			res.render('index', {
			customers: docs
			});
		});
	
	});
//	} else{
//		send404Response(response);
//	}
}





app.post('/customers/add', function(req, res){
	
	req.checkBody('ordernummer', 'Ordernummer behövs').notEmpty();
	req.checkBody('namn', 'Kundnamn behövs').notEmpty();
	
	var errors = req.validationErrors();
	
	
	
	if(errors){
		console.log('Error with form');
		res.render('index', {
			errors: errors
		});
	} else{
		console.log('New customer added');
		
		var newcustomer = {
			datum: req.body.datum,
			tid: req.body.tid,
			veckodag: "Någon dag",
			ordernummer: req.body.ordernummer,
			namn: req.body.namn,
			adress: req.body.adress,
			postnummer: req.body.postnummer,
			telefonnummer: req.body.telefonnummer,
			produkter: req.body.produkt,
			fasttid: req.body.fasttid
		}
		
		db.customers.insert(newcustomer, function(err, result){
			if(err){
				console.log(err);
			}
			else {
				res.redirect('/skapaBokning');
			}
		});
		
	}

	
});

	app.delete('/users/delete/:id', function(req, res){
		db.customers.remove({_id: ObjectId(req.params.id)}, function(err, result){
			if(err){
				console.log(err);
			}
			res.redirect('/skapaBokning');
				
		});
	});

app.get('/', function(req, res){
	db.customers.find(function (err, docs){
		res.render('index', {
			customers: docs
		});
	});
});

app.get('/index', function(req, res){
	db.customers.find(function (err, docs){
		res.render('index', {
			customers: docs
		});
	});
});

app.get('/skapaBokning', function(req, res){
	db.customers.find(function (err, docs){
		res.render('skapaBokning', {
			customers: docs
		});
	});
});

app.get('/kommandeKorningar', function(req, res){
	res.render('kommandeKorningar');
});

/*
function getpick(geturl){
	console.log(geturl);
	if(geturl =="/" || "/index"){
		console.log("Hej");
		app.get(geturl, function(req, res){
			console.log(req);
		db.customers.find(function (err, docs){
			res.render(geturl, {
				customers: docs
			});
		});
		
		});
	}
	else if(geturl == "/skapaBokning"){
		app.get(geturl, function(req, res){
			db.customers.find(function (err, docs){
				res.render(geturl, {
					customers: docs
				});
			});
		});
	}
	else if(geturl == "/bokningar"){
		app.get(geturl, function(req, res){
			res.render(geturl);
		});
	}

	app.get('/index', function(req, res){
		db.customers.find(function (err, docs){
			res.render('index', {
				customers: docs
			});
		});
	});

	

//	app.get('/bokningar', function(req, res){
//		res.render('bokningar');
//	});
	else {
	}

}
//listen(port, host);

function renderer(req, res){
	app.get(req.url, function(req, res){
		res.render(req.url);
	})
}
*/
/*
http.createServer(function (request, response){
	fs.readFile('index.html', function(err, page) {
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write(page);
		response.end();
    });
}).listen(port);
*/


app.listen(port, function(){  
	console.log('Server started on port ' + port);
});
