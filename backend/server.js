require('dotenv').config()
const express = require('express')
const cors = require('cors')

const geoRoutes = require('./routes/geo')

const app = express()
app.use(cors())

app.use('/api', geoRoutes)

app.listen(3000, () => {
  console.log('Server running on port 3000')
})