
class UsersRepository {
  users = []

  getAll() {
    return this.users
  }

  create(user) {
    this.users.push(user)
  }

  get(email) {
    const user = this.users.find(user => user.email === email)

    return user
  }

  async uptade(newUserCredentials) {
    // Achar usuário
    const user = this.get(newUserCredentials.email)

    // Deletar usuário desatualizado
    this.delete(newUserCredentials.email)

    // Atualizar usuário: password ou usename (só um ou os dois)
    // verificar se foi enviado um novo userName ou um novo password

    const updatedUser = user
    if (newUserCredentials.newCredentials?.password) {
      const hashedPassword = await bcrypt.hash(newUserCredentials.newCredentials.password, 10)
      updatedUser.password = hashedPassword
    }

    if (newUserCredentials.newCredentials?.userName) {
      updatedUser.userName = newUserCredentials.newCredentials.userName
    }

    if (newUserCredentials.newCredentials.hasOwnProperty("isPrivate")) {
      updatedUser.isPrivate = newUserCredentials.newCredentials.isPrivate
    }

    this.create(updatedUser)
  }

  delete(email) {
    this.users = this.users.filter(user => user.email !== email)
  }
}

module.exports = UsersRepository