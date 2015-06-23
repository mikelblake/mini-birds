'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongo = require('mongojs');

var app = express();
var db = mongo('birds', ['sightings']);

app.use(bodyParser.json());
app.use(cors());

app.route('/api/sightings')
	.get(function(req, res) {
		db.sightings.find(req.query, function(err, response){
			if(err){
				res.status(500).json(err);
			} else {
				res.json(response);
			}
		});
		res.send('you got it');
	})

	.post(function(req, res) {
		res.send('it posted');
		db.sightings.save(req.body, function(err, response){
			if(err){
				res.status(500).json(err);
			} else {
				res.json(response);
			}
		});
	})

	.put(function(req, res) {
		if(!req.query.id){
			res.status(500).send('you need to send an id');
		} else {
			db.sightings.findAndModify({
				query: {
					_id: mongo.ObjectId(req.query.id)
				},
				update: {
					$set: req.body
				}
			}, function(err, response){
				if(err){
					res.status(500).json(err);
				}	else {
					res.json(response);
				}
			});
		}
		res.send('you put it');
	})

	.delete(function(req, res) {
		if(!req.query.id){
			res.status(500).send('you need to send an id, please');
		} else {
			db.sightings.remove({
				_id: mongo.ObjectId(req.query.id)
			}, function(err, response){
				if(err){
					res.status(500).json(err);
				} else {
					res.json(response);
				}
			});
		}
		res.send('you deleted it');
	});

app.listen(8888, function(){
	console.log('LISTENING');
});
