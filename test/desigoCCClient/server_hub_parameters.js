
///\\DESKTOP-5UMGIOG

let host = '10.0.0.14'
let port = 80

module.exports = {
  host: host,
  port: port,
  hr: `http://${host}:${port}/signalr`,
  ms: `http://${host}:${port}/Notifier/hubs`,
}