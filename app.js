const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/era', { useMongoClient: true });
const db = mongoose.connection;
db.once('open', function() {
    console.log('connected to MongoDB');
});

db.on('error', function(err) {
    console.log(err);
});

const app = express();

const Article = require('./models/article');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', function(req, res) {
    Article.find({}, function(err, blogs) {
        if(err) {
            console.log(err);
        }else {
            res.render('index',{
                title:'BlogEra',
                blogs:blogs
            });
        }
    });
});

app.get('/add-articles', function(req, res) {
    res.render('add_article',{
        title:'Add Articles'
    });
});

app.listen(3000, function(req, res) {
    console.log('Server has started at port 3000');
});