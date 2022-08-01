/**  
 * Module dependencies.  
 */  
var express = require('express');  
var routes = require('./routes');  
var http = require('http');  
var path = require('path');

//load crud route  
var crud = require('./routes/crud');   
var app = express();  
var connection  = require('express-myconnection');   
var mysql = require('mysql');

// all environments  
app.set('port', process.env.PORT || 4300);  
app.set('views', path.join(__dirname, 'views'));  
app.set('view engine', 'ejs');  
//app.use(express.favicon());  
app.use(express.logger('dev'));  
app.use(express.json());  
app.use(express.urlencoded());  
app.use(express.methodOverride());  
app.use(express.static(path.join(__dirname, 'public')));

// development only  
if ('development' == app.get('env')) {  
  app.use(express.errorHandler());  
}

/*------------------------------------------  
    connection peer, register as middleware  
    type koneksi : single,pool and request   
-------------------------------------------*/  
app.use(

    connection(mysql,{

        host: 'localhost',  
        user: 'root',  
        password : '123456',  
        port : 3306, //port mysql  
        database:'plc'  
    },'request')  
);

//route index, hello world  
app.get('/', routes.index);

//route customer list  
app.get('/crud', crud.list);

//route add customer, get n post  
app.get('/crud/add', crud.add);  
app.post('/crud/add', crud.save);

//route delete customer  
app.get('/crud/delete/:id', crud.delete_customer);

//edit customer route , get n post  
app.get('/crud/edit/:id', crud.edit);   
app.post('/crud/edit/:id',crud.save_edit);

app.use(app.router);  
http.createServer(app).listen(app.get('port'), function(){

  console.log('Express server listening on port ' + app.get('port'));  
});