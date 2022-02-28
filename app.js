var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let opcuaBridgeRouter = require('./routes/OpcUaBridge/index')
let modbusTCPRouter = require('./routes/ModbusTCP/index')
let signalRRouter = require('./routes/signalR/index')

const jwt = require('jsonwebtoken')
const SECRET = 'qwe123asdzxc!@#$%^&*(000'

var app = express();

// cookieSignKey 可选，设置cookie时可以使用sign:true使之生效，也可以不使用
// 使用sign时，在路由部分使用req.signedCookies.cookieName来获取cookie
// 未使用sign的cookie，使用req.cookies.cookieName获取
app.use(cookieParser("cookieSignKey"));



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



var session = require('express-session');
app.use(session({
    secret: '8koWiI433lzm404p=251xno7r',
    resave: true,
    saveUninitialized: true,
    cookie: {        maxAge: 1000 * 60 * 60 * 24 * 30    }}))


app.use(logger('dev'));
// app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/bridge', opcuaBridgeRouter);
app.use('/modbus', modbusTCPRouter);
app.use('/signalR', signalRRouter);



app.use(express.json());
app.get('/api/users', async function(req, res) {//获取用户列表的所有用户信息
    const users = await User.find()
    res.send(users)
})
app.post('/api/register', async function(req, res) {//用户注册
    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
    })
    res.send(user)
})
app.post('/api/login', async function(req, res) {//用户登录
    const user = await User.findOne({//检验用户名
        username: req.body.username
    })
    if(!user) {
        return res.status(422).send({
            msg:" 用户名不存在"
        })
    }
    const ispassword = require('bcryptjs').compareSync(//检验密码
        req.body.password,
        user.password
    )
    if(!ispassword) {
        return res.status(422).send({
            msg:" 密码错误"
        })
    }

    //JWT通过用户id和密钥生成token
    const token = jwt.sign({
        id: String(user._id),
    }, SECRET)
    res.send({
        user,
        token: token
    })
})

const auth = async (req, res, next) => {//中间件
    const raw = String(req.headers.authorization).split(' ').pop()//获取token
    const { id } = jwt.verify(raw, SECRET)//验证token返回id
    req.user = await User.findById(id)//通过id找到用户
    next()
}
app.get('/api/profile', auth, async function(req,res) {//使用中间件获取用户信息
    res.send(req.user)
})




var session = require('express-session');
var FileStore = require('session-file-store')(session);

var identityKey = 'skey';

app.use(session({
    name: identityKey,
    secret: 'chyingp',  // 用来对session id相关的cookie进行签名
    store: new FileStore(),  // 本地存储session（文本文件，也可以选择其他store，比如redis的）
    saveUninitialized: false,  // 是否自动保存未初始化的会话，建议false
    resave: false,  // 是否每次都重新保存会话，建议false
    cookie: {
        maxAge: 10 * 1000  // 有效期，单位是毫秒
    }
}));


/* 登录拦截 */
app.use((req,res,next)=>{
  let url=req.originalUrl
    if (url != "/login" && !req.session.user) {
        return res.redirect("/login");
    }
    next();
  })


// 使用 session 中间件
app.use(session({
  secret :  'secret', // 对session id 相关的cookie 进行签名
  resave : true,
  saveUninitialized: false, // 是否保存未初始化的会话
  cookie : {
      maxAge : 1000 * 60 * 3, // 设置 session 的有效时间，单位毫秒
  },
  store: new MongoStore({
    db: 'sessiondb'
  })
}));

// 获取主页
app.get('/', function (req, res) {
  if(req.session.userName){  //判断session 状态，如果有效，则返回主页，否则转到登录页面
      res.render('home',{username : req.session.userName});
  }else{
      res.redirect('login');
  }
})
// 退出
app.get('/logout', function (req, res) {
  req.session.userName = null; // 删除session
  res.redirect('login');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
  
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

