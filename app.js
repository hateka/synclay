
/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);
// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'inuExpress'
  });
});

io.set('transports', [
    'websocket'
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
]);


io.sockets.on('connection',function(socket){
	 socket.on('user message',function(data){
		//socket.broadcast.emit('user message',data);
		io.sockets.emit('user message',data);
	       console.log(data.my);
	 });
        socket.on('draw',function(path){
               socket.broadcast.emit('draw',path);
               console.log(path);
         });
        socket.on('img',function(imk){
              socket.broadcast.emit('img',imk);
		//io.sockets.emit('img',imk);
         });
    });


app.listen(3000);

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
