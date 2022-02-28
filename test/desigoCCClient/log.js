module.exports = {
  //日志格式等设置
  appenders: {
    "archive": {
      "type": "file",
      "filename": "./logs/app-host-local.log",
      "pattern": "yyyy-MM-dd.log",
      "maxLogSize": 10485760,
      "numBackups": 13,
      "layout": {
        "type": "pattern",
        "pattern": "[%r] [%[%5.5p%]] - %m%n",
        "tokens": { "pid": "function() { return process.pid; }" }
      },
      "path": './logs/',
      "compress": false
    },
    "rule-console": {
      "type": "console"
    },
    "critical": {
      "type": "dateFile",
      "filename": './logs/critical',
      "pattern": "yyyy-MM-dd.log",
      "layout": {
        "type": "pattern",
        "pattern": "[%r] [%[%5.5p%]] - %m%n",
      },
      "alwaysIncludePattern": true,
      "encoding": "utf-8",
      "path": './logs/'
    },
    "access": {
      type: 'DateFile',
      filename: './logs/access.log',
      pattern: '-yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      category: 'access'
    },
    "reports": {
      "type": "dateFile",
      "filename": './logs/reports',
      "pattern": "yyyy-MM-dd.log",
      "alwaysIncludePattern": true,
      "encoding": "utf-8",
      "path": './logs/'
    },
  },

  //供外部调用的名称和对应设置定义
  categories: {
    "default": { "appenders": ["rule-console", "archive", "critical"], "level": "all" },
    "access": { "appenders": ["access"], "level": "all" },
    "critical": { "appenders": ["critical"], "level": "error" },
    "report": { "appenders": ["reports"], "level": "info" },
    "response": { "appenders": ["access"], "level": "info" },
    "request": { "appenders": ["access"], "level": "info" }
  },
  pm2: true,
  replaceConsole: true,
  "baseLogPath": './logs/'
}