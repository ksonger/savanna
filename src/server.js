
/**
 * Module dependencies.
 */

var express = require('express')
    , http = require('http')
    , path = require('path')
    , modRewrite = require('connect-modrewrite')
    , fs = require('fs');

var app = express();

// Templating engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(addCorsHeaders);
app.use(app.router);
app.use(modRewrite([
    '(.*);jsessionid=(.*)$ $1 [L]'
]));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// Interrupt the SpecRunner.html request and insert tests requested
app.get('/test/SpecRunner.html', function(req,res) {
    fs.readFile('./public/test/SpecRunner.html', function(err, data){
        var html = data.toString();

        // If no querys are present or it's 'all', send back the HTML
        if(!Object.keys(req.query).length || req.query === 'all'){
            res.send(html);

        // Strip the scripts, and insert the js file into the page
        } else {
            var scriptRequested = '<script type="text/javascript" src="specs/' + req.query.test + '"></script>'
                , scriptStartLocation = html.indexOf('<!--[#parserstart]-->')
                , scriptEndLocation = html.indexOf('<!--[#parserend]-->');
            html = html.replace(html.substring(scriptStartLocation, scriptEndLocation), scriptRequested);
            res.send(html);
        }
    });
});

app.get('/tests', function(req, res) {
    var testsLocation = './public/test/specs';
    res.render('test-picker', { tests: fs.readdirSync(testsLocation) });
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

function addCorsHeaders(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
    res.set('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Requested-With');

    if ('OPTIONS' === req.method) {
        res.send(200);
    }
    else {
        next();
    }
}
