const express = require('express')
const cors = require('cors')
const bodyParrser = require('body-parser')
const helmet = require('helmet')
const log = require('npmlog')
const path = require('path')

const api = require('./api');

const app = express()

log.level = 'verbose'

app.use(helmet())
app.use(cors())
app.use(bodyParrser.json())

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/views/index.html'))
})

app.use('/api', api)

app.use(express.static(path.join(__dirname, '../public')))

app.listen(5000, () => {
  log.info('server', 'Server listening on 5000')
})