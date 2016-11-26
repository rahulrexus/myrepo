var express = require('express');
var bp = require('body-parser');
var _ = require('underscore');

var MongoClient = require('mongodb').MongoClient;

var app = express();
app.use(bp.json());

var db;

MongoClient.connect('mongodb://admin:admin@ds111188.mlab.com:11188/rahdb', (err, database) => {
	if(err)
		return console.log(err);
	db = database;
});

var taskId = 0;

app.use(express.static('public'));

var mytasks = [
	{
		description: 'First task',
		status: 'Complete'
	},
	{
		description: 'Second task',
		status: 'Incomplete'
	}
];

app.get('/getmytasks', function(req, res) {
	res.json(mytasks);
});


app.get('/getmytasks/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	
	/* Commented because of shorter and elegant way using underscore module below
	var matchedTodo;
	mytasks.forEach(function(todo) {
		if (todoId == todo.id) {
			matchedTodo = todo;
			// Break not directly allowed in forEach!
			//break;
		}
	});
	*/
	var matchedTodo = _.findWhere(mytasks, {id: todoId});
	
	if(matchedTodo)
		res.json(matchedTodo);
	else
		res.status(404).send();

});

app.delete('/deletetask', function(req, res) {
	db.collection('userdb').findOneAndDelete({description: req.body.description}, (err, result) => {
		if (err)
			return res.send(500, err);
		res.send('record deleted');
	})
});

app.post('/postmytask', function(req,res) {
	db.collection('userdb').save(req.body, (err, result) => {
		if (err)
			return console.log(err);
		console.log('saved to database: ' + result);
	});
});

app.put('/updatetask', (req, res) => {
	db.collection('userdb')
	.findOneAndUpdate({description: req.body.description}, {
		$set:  {
			description: req.body.description,
			status: req.body.status
		}
		}, 
		{
		//	sort: {_id, -1},
			upsert: true
		}, 
		(err, result) => {
			if (err)
				return res.send(err);
			res.send(result);
		}
	)
});

app.listen(3000, function() {
	console.log('app is running on port 3000');
});