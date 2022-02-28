
let host = '10.0.0.14'
let port = 443

module.exports = {
  host: host,
  port: port,
  cmdsvc: `http://${host}:${port}/ManagementServer/ServerCommandService.svc?wsdl`,
  rgrsvc: `http://${host}:${port}/ManagementServer/ServiceRegistrationService.svc?wsdl`,
}