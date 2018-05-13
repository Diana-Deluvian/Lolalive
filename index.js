var bodyParser = require('body-parser'),
    mongoose   = require('mongoose'),
    express    = require('express'),
    app        = express(),
    methodOverride = require('method-override'),
    expressSanitizer = require('express-sanitizer');
    passport = require('passport'),
    LocalStrategy = require('passport-local');
    middleware = require('./middleware/index');
    passportLocalMongoose = require('passport-local-mongoose');


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

mongoose.connect('mongodb://Senbonzakura:123456@ds133496.mlab.com:33496/lolalive');

app.locals.moment = require('moment');

app.use(require('express-session')({
    secret: 'The Earth turns slowly.',
    resave: false,
    saveUninitialized: false
}));

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model('Blog', blogSchema);

var userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    admin: {type: Boolean, default: false}
});
userSchema.plugin(passportLocalMongoose);
var User = mongoose.model('User', userSchema);

app.get('/', function(req, res){
    console.log(req.session);
    res.redirect('/blogs');
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});


app.get('/blogs',  function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log('Error!');
        } else{
            res.render('index', {blogs:blogs});
            //sound.play();
        }
    });
});



app.post('/blogs', middleware.isLoggedIn, function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render('new');
        } else{
            res.redirect('/blogs');
        }
    });
});

app.get('/blogs/new', middleware.isLoggedIn, function(req, res){
    res.render('new');
});



app.get('/blogs/:id', function(req, res){
    Blog.findById(req.params.id, function(err, foundBlogpost){
        if(err){
            res.redirect('/blogs');
        } else {
            res.render('show',{blog: foundBlogpost});
        }
    });
    
});

app.get('/blogs/:id/edit', middleware.isLoggedIn, function(req, res){
   Blog.findById(req.params.id, function(err, foundBlogpost){
        if(err){
            res.redirect('/blogs');
        } else {
            res.render('edit',{blog: foundBlogpost});
        }
    });
});

app.put('/blogs/:id', middleware.isLoggedIn, function(req, res){
    setTimeout(function(){}, 10000);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlogpost){
        if(err){
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs/'+req.params.id);
        }
    });
});

app.delete('/blogs/:id', middleware.isLoggedIn, function(req, res){
   Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect('/blogs');
       } else {
           res.redirect('/blogs');
       }
   });
});
app.get('/register', function(req, res) {
    res.render('register');
})
app.post('/register', function(req, res) {
    var newUser = new User({username: req.body.username, email: req.body.email});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            return res.redirect('register');
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/blogs');
        });
    });
});

app.get('/login', function(req, res){
    res.render('login');
});

app.post('/login', passport.authenticate('local',
    {
        successRedirect: '/blogs',
        failureRedirect:'/blogs/new'}),
    function(req, res){ console.log("here")
});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

app.listen(8080, function(){
    console.log('Server is running!');
});