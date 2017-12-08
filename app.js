const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

mongoose.connect('mongodb://localhost/era', { useMongoClient: true });
const db = mongoose.connection;
db.once('open', function() {
    console.log('connected to MongoDB');
});

db.on('error', function(err) {
    console.log(err);
});

const app = express();

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'keyboard cat', resave: true, saveUninitialized: true}));
const Article = require('./models/article');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(expressValidator({
    errorFormatter: function(param, msg, value){
        const namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

        while(namespace.lenght){
            formParam += '[' + namespace.shift()+']';
        }
        return {
            param : formParam,
            msg : msg,
            value : value
        };
    }
}));

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
app.post('/add-article', function(req, res) {
    req.checkBody("title", "Title is required").notEmpty();
    const article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err) {
        if(err) {
            console.log(err);
            return;
        }else{
            req.flash('success', 'Article Added');
            res.redirect('/');
        }
    });
});

app.get('/article/:id', function(req, res){
    Article.findById(req.params.id, function(err, articles){
        res.render('article',{
            article:articles
        });
    });
});

app.get('/article/edit/:id', function(req, res){
    Article.findById(req.params.id, function(err, articles){
        res.render('edit_article',{
            title:'Edit Articles',
            article:articles
        });
    });
});

app.post('/article/edit/:id', function(req, res) {
    const article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    const query = {_id:req.params.id};
    Article.update(query, article, function(err) {
        if(err) {
            console.log(err);
            return;
        }else{
            req.flash('success', 'Articles updated successfully');
            res.redirect('/');
        }
    });
});

app.delete('/article/:id', function(req, res){
    const query = {_id:req.params.id}
    Article.remove(query, function(err){
        if(err){
            console.log(err);
        }else{
            req.flash('danger', 'Articles deleted');
            res.send('Success');
        }
    });
});

app.get('/about', function(req, res){
    res.render('about_us',{
        title:'About Us'
    });
});


app.listen(3000, function(req, res) {
    console.log('Server has started at port 3000');
}).on('error', function(err) { });