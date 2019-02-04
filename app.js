const express = require('express');
const expHbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// map global promise
mongoose.Promise = global.Promise;

// connect to mongoose
mongoose.connect('mongodb://localhost:27017/vidjot-dev', {
    // useMongoClient: true,
    useNewUrlParser: true
})
.then((db) => console.log('MongoDB connected'))
.catch((err) => {
    console.log(err)
})

// load Idea Model
require('./models/Idea')
const Idea = mongoose.model('ideas')

// handlebars middleware
app.engine('handlebars', expHbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// index route
app.get('/', (req, res) => {
    const title = 'Welcome'
    res.render('index', {
        title: title
    })
});

//about route
app.get('/about', (req, res) => {
    res.render('about')
})

// Add Idea form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add')
})

// Idea Index Page
app.get('/ideas', (req, res) => {
    Idea.find({

    })
    .sort({date: 'desc'})
    .then((ideas) => {
        res.render('ideas/index', {
            ideas: ideas
        });
    })
})

app.post('/ideas', (req, res) => {
    let errors = [];

    if(!req.body.title) {
        errors.push({
            text: 'Please add a Title'
        })
    }
    if (!req.body.details) {
        errors.push({
            text: 'Please add some details'
        })
    }
    if(errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
       const newUser = {
           title: req.body.title,
           details: req.body.details,
       }
       new Idea(newUser).save()
       .then((idea) => {
            res.redirect('/ideas')
       })
    }
})

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})