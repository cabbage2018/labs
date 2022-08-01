'use strict'
const fs = require("fs")
const path = require('path')
const dispacher = require('../dispacher/index')

const modbusTcp = require('./daq/modbustcp/index')
modbusTcp.register(dispacher)

const opcUa = require('./daq/opcua/index')
opcUa.register(dispacher)

const snap7 = require('./daq/snap7/index')
snap7.register(dispacher)