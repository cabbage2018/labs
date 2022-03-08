var mysql=require('mysql');

var connection = mysql.createConnection({
    host     : '192.168.0.108',
    user     : 'root',
    password : '123456',
    database : 'test1',
    port:'3306'
});

connection.connect();

var usr={name:'zhangsan',password:'pwdzhangsan',mail:'zhangsan@gmail.com'};

connection.query('insert into users set ?', usr, function(err, result) {
    if (err) throw err;

    console.log('inserted zhangsan');
    console.log(result);
    console.log('\n');
});

connection.query('select * from users', function(err, rows, fields) {
    if (err) throw err;

    console.log('selected after inserted');
    for(var i= 0,usr;usr=rows[i++];){
        console.log('user nae='+usr.name + ', password='+usr.password);
    }

    console.log('\n');
});

connection.query('update users set password="ddd" where name="zhangsan"', {password:'ppp'}, function(err, result) {
    if (err) throw err;

    console.log('updated zhangsan\'s password to ddd');
    console.log(result);
    console.log('\n');
});

connection.query('select * from users', function(err, rows, fields) {
    if (err) throw err;

    console.log('selected after updated');
    for(var i= 0,usr;usr=rows[i++];){
        console.log('user nae='+usr.name + ', password='+usr.password);
    }

    console.log('\n');
});

connection.query('delete from  users where name="zhangsan"', {password:'ppp'}, function(err, result) {
    if (err) throw err;

    console.log('deleted zhangsan');
    console.log(result);
    console.log('\n');
});

connection.query('select * from users', function(err, rows, fields) {
    if (err) throw err;

    console.log('selected after deleted');
    for(var i= 0,usr;usr=rows[i++];){
        console.log('user nae='+usr.name + ', password='+usr.password);
    }

    console.log('\n');

});

connection.end();











//查询ajax
      $.ajax({
            type:'get',
            url:'getJob',
            success:function(data){
                console.log(data);
                $.each(data,function(i,d){
                    _data=data;
                    $('#select').append('<div></div>')
                    $('#select').find('div').eq(i).
                            append('<span class="job">工作:'+ d.job+'</span><span class="age">年龄:'+ d.age+'</span><span class="id">学号:'+ d.id+'</span><button>删除</button>');
//
                });
            }
        })
    });

//增加ajax
  var _obj={
            job:$('.job').val(),
            id:$('.id').val(),
            age:$('.age').val()
        };
        $.ajax({
            type:'POST',
            url:'/insertJob',
            data: _obj,
            success:function(data){}
        })

//删除ajax
  $.ajax({
         type:'delete',
         url:'delete/'+_id,
         success:function(data){}
                    })
--------------------- 