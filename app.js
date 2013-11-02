
/**
 * Module dependencies.
 */

var express = require('express')
  , engine = require('ejs-locals')
  , auth = require('connect-auth')
  , routes = require('./routes')
  , singin = require('./routes/singin').singin
  , player = require('./routes/player').player
  , imageproxy = require('./routes/imageproxy').imageproxy
  , api = require('./routes/api').api
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 4000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.engine('ejs', engine);
  app.locals._layoutFile = '/layout.ejs';
  app.use(express.cookieParser());
  app.use(express.session({secret: "8fd763d28b975fe127ca6f8f01a1fd5b0d2524b4"}));
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(auth( [
    auth.Facebook({appId : "217986608328841", appSecret: "6fea868067da5f2f8948e22e32bb0d0a", scope: "email", callback: "http://localhost:4000/singin"})
  ]) );
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// GET home page
app.get('/', routes.index);

// GET singin page
app.get('/singin', singin);

// GET player page
app.get('/i', player);

app.get('/api', api);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
