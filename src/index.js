const express = require('express')
const cors = require('cors')
const bodyParrser = require('body-parser')
const helmet = require('helmet')
const log = require('npmlog')

const api = require('./api');

const app = express()

log.level = 'verbose'

app.use(helmet())
app.use(cors())
app.use(bodyParrser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api', api)

app.listen(5000, () => {
  log.info('server', 'Server listening on 5000')
})