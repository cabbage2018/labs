
function scan() {
  if (fs.existsSync(path.join(process.cwd(), './logs/errors.trp'))) {
    let alarmString = fs.readFileSync(path.join(process.cwd(), './logs/errors.trp'))
    email.error(`${new Date().toISOString()} :\r\n\r\n ${alarmString} and;\r\n then this source is deleted.`)
    fs.unlinkSync(path.join(process.cwd(), './logs/errors.trp'))
    log.warn('deleting: ', path.join(process.cwd(), './logs/errors.trp'))
  } else {
    log.debug('what a nice day.')
  }
}

function flat(jsonObj) {
  for (var val in jsonObj) {
    alert(val + " " + myJson[val]);//输出如:name 
  }
}


//   var reg = new RegExp('address*', 'gi')
//   var match = reg.exec(files[i])
//   if(null !== match) {
//     const fullfilepath = path.join(folder, files[i])
//     let p = path.join(__dirname, fullfilepath)
//     pathList.push(p)
//   }

function typeObj(obj) {
  var str = Object.prototype.toString.call(obj);
  if (str == '[object Array]') {
    return 'Array';
  } else if (str == '[object Object]') {
    return 'Object';
  } else {
    return typeof (obj)///"Primitive"
  }
}

let globalArray = []

function flat(prefix, jsonObj) {

  for (var val in jsonObj) {

    if (typeObj(jsonObj[val]).indexOf('Array') >= 0) {

      for (let i = 0, l = jsonObj[val].length; i < l; i++) {
        let sample = jsonObj[val][i]
        flat(prefix + val + '[' + i + ']', sample)
      }

    } else if (typeObj(jsonObj[val]).indexOf('Object') >= 0) {

      for (var zoom in jsonObj[val]) {
        flat(prefix + '{' + val + '}', jsonObj[val][zoom])
      }

    } else {

      globalArray.push(prefix + typeObj(jsonObj[val]) + '-' + val + '=' + jsonObj[val])

    }
  }
}

function list(folder, extname = '.json', wildchars = "model") {
  let absolutePath = folder///path.join(__dirname, folder)

  var files = fs.readdirSync(absolutePath, { encoding: 'utf-8' })

  let filepathList = []
  for (var i = 0; i < files.length; i++) {
    let filepath1 = path.join(absolutePath, files[i])
    var fileStat = fs.statSync(filepath1)
    if (fileStat.isDirectory()) {
      ;
    } else {
      if (path.extname(filepath1) === extname) {

        var reg = new RegExp(wildchars, "gi") ///*model*/gi ////**/
        var match = reg.exec(files[i])
        if (null !== match) {
          const fp = path.join(absolutePath, files[i])
          filepathList.push(fp)
          // console.log(fp)
        }
      }
    }
  }

  return filepathList
}
