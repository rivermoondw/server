var express = require('express');
var mongodb = require('mongodb');
var bodyParser = require('body-parser');

const SENSOR_COLLECTION = "sensor";
var app = express();
var db;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': 'true'}));

mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://boonie:Loccoi123@airtracker-shard-00-00-d8kyf.mongodb.net:27017,airtracker-shard-00-01-d8kyf.mongodb.net:27017,airtracker-shard-00-02-d8kyf.mongodb.net:27017/airmonitor?ssl=true&replicaSet=airtracker-shard-0&authSource=admin", function(err, client){
	if (err) {
		console.log(err);
		process.exit(1);
	}
	db = client.db('airmonitor');
	var server = app.listen(process.env.PORT || 8080, function(){
		var port = server.address().port;
		console.log('App now running on port: '+ port);
	})
})


function handleError(res, reason, message, code) {
	console.log("ERROR: "+reason);
	res.status(code || 500).json({"error": message});
}

/*	"/api/sensor"
	GET: get all sensor
	POST: create a new sensor
*/
//get list sensor
app.get("/api/sensor", function(req, res){
	db.collection(SENSOR_COLLECTION).find({}).toArray(function(err, docs){
		if (err){
			handleError(res, err.message, "Failed to get sensor");
		}
		else {
			res.status(200).json(docs);
		}
	})
})
//create sensor
app.post("/api/sensor", function(req, res){
	console.log('create sensor');
	var newSensor = req.body;
	db.collection(SENSOR_COLLECTION).insertOne(newSensor, function(err, doc){
		if (err){
			handleError(res, err.message, 'Failed to create new sensor');
		}
		else {
			res.status(201).json(doc.ops[0]);
		}
	})
})


//get sensor by id
app.get("/api/sensor/:id", function(req, res){
	db.collection(SENSOR_COLLECTION).findOne({id: req.params.id}, function(err, doc){
		if (err) {
			handleError(res, err.message, "Failed to get sensor");
		}
		else {
			res.status(200).json(doc);
		}
	})
})
