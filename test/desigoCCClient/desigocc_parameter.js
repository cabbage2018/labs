///\\DESKTOP-5UMGIOG
let host = 'https://DESKTOP-EKA5VDD'
let port = 8443
module.exports = {
  host: host,
  port: port,
  app: `http://${host}/signalr`,
  urlpath: `/WSI/api/token`,
  token: `http://${host}:${port}/signalr`,
  ms: `http://${host}:${port}/Notifier/hubs`,
}