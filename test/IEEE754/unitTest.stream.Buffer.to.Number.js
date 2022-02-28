var temp = new Buffer.allocUnsafe(countOfRegister).fill('\0');
var moved = buf.copy(temp, 0, position, position + countOfRegister);
var floatValue = temp.readFloatBE(0);

var temp = new Buffer.allocUnsafe(countOfRegister).fill('\0');
var moved = buffer.copy(temp, 0, position, position + countOfRegister);
var doubleValue = temp.readDoubleBE(0);

var buf = Buffer.from([67,94,191,128,67,95,18,64,67,94,248,178,0,0,0,0,0,0,0,0,0,0,0,0,62,247,85,72,62,247,15,153,62,247,121,239,66,215,52,249]);
var invalids = Buffer.from([0,0,0,0]);
for (let index = 0; index < buf.length / 4; index++) {
    var buf2 = Buffer.allocUnsafe(4).fill('\0');
    buf.copy(buf2, 0, index*4, index*4 + 4);
    if(!Buffer.compare(buf2, invalids)){
        console.log("invalid float")
    }
    else{
        var n2 = buf2.readFloatBE(0);
        console.log(n2)
    }
}


var outputDir = "C:/Temp2/";

if (!fs.existsSync(outputDir)) {//不存在就创建一个
  fs.mkdirSync(outputDir, "0755")
}


for (var x of historyDictionary) { // 遍历Map
  console.log(x[0] + ':= ' + x[1]);
}



const root1 = path.join(__dirname, "../public/buffer/");
console.log(root1);

fs.watch(root1, function (event, filename) {
	// always had been called twice for single file~~~
  if (event === "change") {
    if (filename) {
			var oldpath = path.join(root1, filename);
			//console.log("old:   ", root1, filename, ": ", oldpath);
			if(historyDictionary.get(oldpath) !== undefined ){
				console.log("duplicated   ", oldpath);
				return;
			}

      try {
        if (fs.readFileSync(oldpath, "utf8").length > 0) {

          const archiveDir = "z/";
          var newdir = path.join(root1, archiveDir);

          if (!fs.existsSync(newdir)) {
            fs.mkdirSync(newdir, "0755")
          };
					var newpath = path.join(newdir, filename);

					var jsonobj = JSON.parse(fs.readFileSync(oldpath, "utf8"));
					var decoderPath = path.join("./public/decoder/", jsonobj.decoderlink);
					var result = buildup_timeseries(oldpath, decoderPath, outputDir);

					if (result === null) { } else {
						//console.log("rename   ", ": ", path.join(newdir, filename));

						historyDictionary.set(oldpath, new Date().toISOString());
						if (!fs.existsSync(newpath)) {
							if (fs.existsSync(oldpath)) {
								//console.log("delete   ", ": ", path.join(newdir, filename));
								//fs.unlinkSync(oldpath);
								fs.renameSync(oldpath, newpath);
							}
						}														
					}
        }
      } catch (error) {
        // The check failed
      }
    }
  }
});



var temp = new Buffer.allocUnsafe(counts).fill('\0');
var split = buffer.copy(temp, 0, start, start + counts);
console.log(split, start, counts, temp.toString(), " :->String");

var job = schedule.scheduleJob('30 */5 * * * *', function(){    
  const wrap = config.readJson("modbus.json");
  master.acquire(wrap.datasources, (buffer)=>{
      console.log(__filename, new Date(), buffer);
  });
});

if(job === null || job === undefined || typeof job === "undefined"){
  console.log('定时器运行');

  job = schedule.scheduleJob('45 * * * * *', function(){
      res.render('index', { title: 'Measure: ->' + slave });           
  }); 
}



fs.watch(folder, function (event, filename) {    
  const archiveDir = "mo/";
  var newdir = path.join(folder, archiveDir);
  if(!fs.existsSync(newdir)){
    fs.mkdirSync(newdir, "0755")
  }

  if(event === "change" ){
    if (filename) {
      try {

        oldpath = path.join(folder, filename);
        newpath = path.join(newdir, filename);
        
        if (fs.existsSync(oldpath)) {
          
          var samples = uploading(oldpath);

          if (result === null){
            filelist.push("error:" + oldpath + "=" + new Date());
          } else {
            filelist.push(oldpath);
          }
          
          fs.renameSync(oldpath, newpath);
        }            
      } catch (error) {
        filelist.push(error.toString());
      }
    } else {
      console.log('filename not provided');
    }
  }
});




function search(root, handler, handler2){
  var files = fs.readdirSync(root);    
  for(var i=0;i<files.length;i++){

      var fileStat = fs.statSync(path.join(root,files[i]));
      //判断是否是文件夹
      if(fileStat.isDirectory()){
      }else{
          var fullpath = path.join(root, files[i]);
          handler(fullpath);
          handler2(fullpath);
      }
  }
}
