const express = require('express')
const cors = require('cors')

const app = express()

// Routers
const searchRouter = require('./routes/search')

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

const routes = [
  ["/s", searchRouter]
]

routes.map(([_route, _router]) => {
  app.use(_route, _router)
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})
