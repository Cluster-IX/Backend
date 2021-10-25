const express = require('express')
const cors = require('cors')

const app = express()

// Routers
const searchRouter = require('./routes/search')
const skorRouter = require('./routes/skor')
const onDemandRouter = require('./routes/on-demand')
const completeRouter = require('./routes/complete')

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

const routes = [
  ["/skor", skorRouter],
  ["/on-demand", onDemandRouter],
  ["/complete", completeRouter]
]

routes.map(([_route, _router]) => {
  app.use(_route, _router)
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})
