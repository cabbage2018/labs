
let host = '10.0.0.14'
let port = 80

module.exports = {
  host: host,
  port: port,
  corporate: `http://${host}:${port}/ManagementServer/ServerCommandService.svc?wsdl`,
  platform: `http://${host}:${port}/ServerCommandService/ServerCommandService.asmx?wsdl`,
}