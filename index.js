var bodyParser = require('body-parser'),
    mongoose   = require('mongoose'),
    express    = require('express'),
    app        = express(),
    methodOverride = require('method-override'),
    expressSanitizer = require('express-sanitizer');


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

app.get('/', function(req, res){
   res.render('index');
});


app.listen(3000, function(){
    console.log('Server is running!');
});