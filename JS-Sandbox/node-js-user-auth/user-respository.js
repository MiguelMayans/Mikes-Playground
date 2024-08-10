import DBLocal from 'db-local'
import bcrypt from 'bcrypt'

const { Schema } = new DBLocal({ path: './db' })

const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
})

export class UserRespository {
  static async create({ username, password }) {
    Validation.username(username)
    Validation.password(password)

    const user = User.findOne({ username })
    if (user) {
      throw new Error('username already exists')
    }

    const id = crypto.randomUUID()

    const hashedPassword = await bcrypt.hash(password, 10)

    User.create({
      _id: id,
      username,
      password: hashedPassword,
    }).save()

    return id
  }

  static async login({ username, password }) {
    Validation.username(username)
    Validation.password(password)

    const user = User.findOne({ username })

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      throw new Error('invalid password')
    }

    // forma elegante de quitar una propiedad de un objeto

    const { password: _, ...userWithoutPassword } = user

    return userWithoutPassword
  }
}

class Validation {
  static username(username) {
    if (typeof username !== 'string') {
      throw new Error('username must be a string')
    }
    if (username.length < 3) {
      throw new Error('username must be at least 3 characters')
    }
  }

  static password(password) {
    if (typeof password !== 'string') {
      throw new Error('password must be a string')
    }
    if (password.length < 8) {
      throw new Error('password must be at least 8 characters')
    }
  }
}
