const connection = require('../app/dataBase')

class UserService {
  async userServiceCeate(data) {
    const {user, password} = data
    const statement = `INSERT INTO user(user, password) VALUES(?, ?)`
    const result = await connection.execute(statement, [user, password])
    return result[0]
  }

  async getUserByName(user) {
    const statement = `SELECT * FROM user WHERE user = ?`
    const result = await connection.execute(statement, [user])
    return result[0]
  }
}
// const cs = new UserService()
// console.log(cs.userServiceCeate());

module.exports = new UserService()