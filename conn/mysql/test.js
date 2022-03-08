var mysql  = require('mysql');  //调用MySQL模块

//创建一个connection
var connection = mysql.createConnection({     
  host     : 'localhost',           //主机
  user     : 'root',                //MySQL认证用户名
  // password : '000000',           //MySQL认证用户密码，没有密码可省略
  // port: '3306',                  //端口号，默认为3306
  database: 'test'                  //数据库名称
}); 

//创建一个connection
connection.connect(function(err){
    if(err){        
        console.log('[query] - :'+err);
        return;
    }
    console.log('[connection connect]  succeed!');
});  
//执行SQL语句
connection.query('SELECT * FROM websites', function(err, result) { 
     if (err) {
        console.log('[query] - :'+ err.message);
        return;
     }
     console.log('--------------------------------');  
     console.log('Result: \n', result);  
     console.log('--------------------------------');    
});  
//关闭connection
connection.end(function(err){
    if(err){        
        return;
    }
    console.log('[connection end] succeed!');
});


// 插入数据
var addSQL = 'INSERT INTO websites(id, name, url, alexa, country) VALUES (0, ?, ?, ?, ?)'
var addSQLParams = ['咋啦爸爸','http://localhost','2','CN']
connection.query(addSQL, addSQLParams, function (err, result) {
    if (err) {
        console.log('[INSERT ERROR] - ', err.message)
        return
    }
    console.log('----------------- INSERT ---------------')
    console.log('[INSERT ID] - ', result)
    console.log('----------------------------------------')
}) 


// 修改数据
var modSQL = 'UPDATE websites SET name = ?, url = ? WHERE id = ?'
var modSQLParams = ['咋了妈妈', 'http://127.0.0.1', 6]
connection.query(modSQL, modSQLParams, function (err, result) {
    if (err) {
        console.log('[UPDATE ERROR] - ', err.message)
        return
    }
    console.log('------------- UPDATE --------------');  
     console.log('Result: \n', result);  
     console.log('----------------------------------'); 
})


// 删除数据
var modSQL = 'DELETE FROM websites WHERE id = 6'
connection.query(modSQL, function (err, result) {
    if (err) {
        console.log('[DELETE ERROR] - ', err.message)
        return
    }
    console.log('------------- DELETE --------------');  
     console.log('Result: \n', result);  
     console.log('----------------------------------'); 
})



