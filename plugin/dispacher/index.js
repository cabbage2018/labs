var express = require('express');
var router = express.Router();
let path = require('path')
let fs = require('fs')

// use markdown-it to convert content to HTML
var md = require("markdown-it")();

/* GET home page. */
router.get('/', function (req, res, next) {
	res.write('<p><a href="./blog">My blog</a></p>')
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

router.get("/blog", (req, res, next) => {
	// console.log(req.params)
	console.log(dir)
	const posts = fs.readdirSync(path.join(dir, '/')).filter(file => file.endsWith('.md'));
	console.log(posts)
	res.render("blogs", {
		posts: posts
	});
});

router.get("/blog/:article", (req, res, next) => {
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

/*
	MODBUSTCP FUNCTIONS
*/
router.get("/modbus", async (req, res, next) => {

	let modbus = require('../plugin/channel/daq/modbustcp')

	req.protocols = require('../project/Laboratory/physical.json')

	let candidates = req.protocols.filter((entry) => {
		let matched = entry.protocol.toUpperCase().indexOf('MODBUSTCP') >= 0
		if (matched) {
			res.write('<p>')
			res.write(JSON.stringify(entry))
			res.write('</p>')
		}
		return matched
	})

	let physicals = []
	candidates.forEach(e => {
		e.array.forEach(g => {
			physicals.push(g)
			res.write('<p>')
			res.write(JSON.stringify(g))
			res.write('</p>')
		})
	})

	req['candidates'] = physicals

	res['physicals'] = []
	modbus.instantiate(req, res, () => { })
	console.log(res.physicals, '++++++++++++++')

	let results = []
	if (res.physicals && res.physicals.length > 0) {
		await modbus.commission(req, res, (runtimeData) => {
			console.log(runtimeData)
			/// progressively append data
			res.write('<p>')
			res.write(JSON.stringify(runtimeData))
			res.write('</p>')

			results.push(runtimeData)
		})
	}

	// console.log(results.map(runtimeData.response._body._fc + '=' + runtimeData.response._body._valuesAsBuffer).join(', '))

	res.end()
})

/*
	MODBUSRTU FUNCTIONS(RTU OVER TCP LIKE SENTRON4200 BRIDGE)
*/

/*
	OPCUA FUNCTIONS
*/

/*
	SNAP7 FUNCTIONS
*/

module.exports = router
module.exports.dataCrawl = dataCrawl