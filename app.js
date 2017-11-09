const express = require('express');
const path = require('path');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', function(req, res) {
    const blogs = [
        {
            id: 1,
            title: 'blog one',
            author: 'John Doe'
        },
        {
            id: 2,
            title: 'blog two',
            author: 'John Doe'
        },
        {
            id: 3,
            title: 'blog three',
            author: 'John Doe'
        }
    ];
    res.render('index',{
        title:'BlogEra',
        blogs:blogs
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