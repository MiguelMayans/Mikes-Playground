import express from 'express'
import { PORT } from './config.js'
import { UserRespository } from './user-respository.js'

const app = express()

app.set('view engine', 'ejs')

app.use(express.json())

app.get('/', (req, res) => {
  res.render('protected', { username: 'Miky' })
})

app.get('/protected', (req, res) => {})

app.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await UserRespository.login({ username, password })
    res.send({ user })
  } catch (error) {
    res.status(401).send(error.message)
  }
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body

  try {
    const id = await UserRespository.create({ username, password })
    res.send({ id })
  } catch (error) {
    res.status(400).send(error.message)
  }
})

app.post('/logout', (req, res) => {})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
