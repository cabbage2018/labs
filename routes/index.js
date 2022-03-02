var express = require('express');
var router = express.Router();
let path = require('path')
let fs = require('fs')

// gray-matter to read the .md files better
const matter = require('gray-matter');

// use markdown-it to convert content to HTML
var md = require("markdown-it")();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('page/index', { title: 'Express' });
  res.send('<p><a href="./blog">My blog</a></p>')
  res.end()
});

let dir = path.resolve('./public/blog/')
// router.get("/docs/", (req, res, next) => {
//   const files = fs.readdirSync(path.join(dir, '/')).filter(file => file.endsWith('.md'))
//   console.log(files)
//   files.forEach((item, index)=>{
//     let fullpath = path.join(dir, item)
//     console.log(fullpath)
//     const stat = fs.statSync(fullpath)
//     if(!stat.isDirectory()){
//       console.log(item, index)
//       res.send(item)
//     }
//   })
//   res.end()
// })

router.get("/blog", (req, res, next)  => {  
  // console.log(req.params)
  console.log(dir)
  const posts = fs.readdirSync(path.join(dir, '/')).filter(file => file.endsWith('.md'));
  console.log(posts)
  res.render("blogs", {
    posts: posts
  });
});

router.get("/blog/:article", (req, res, next)  => {
  console.log(req.params.article)
  // read the markdown file
  const files = matter.read(dir + '/' + req.params.article + '.md');
  let content = files.content;
  var result = md.render(content);
  res.render("blog", {
    post: result,
    title: files.data.title,
    description: files.data.description,
    image: files.data.image
  });
});
module.exports = router;
