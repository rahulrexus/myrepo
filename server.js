var express = require('express');
var bp = require('body-parser');
var _ = require('underscore');

var app = express();
app.use(bp.json());

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

app.delete('/deletetask/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(mytasks, {id: todoId});
	
	if (!matchedTodo)
		res.status(404).json({"error": "id not found"});
	else {
		// Elegant and shorter way using underscore, instead of pop, slice, etc. on array
		mytasks = _.without(mytasks, matchedTodo);
		res.json(matchedTodo);
	}
});

app.post('/postmytask', function(req,res) {
	var data = req.body;
	data.id = taskId++;
	mytasks.push(data);
	res.json(data);
});

app.listen(3000, function() {
	console.log('app is running on port 3000');
});