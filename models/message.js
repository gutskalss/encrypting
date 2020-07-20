const fs = require('fs')
const path = require('path')

class Message {
  constructor(iv, key, encryptedData) {
    this.iv = iv
    this.key = key
    this.encryptedData = encryptedData
  }

  toJSON() {
    return {
      iv: this.iv,
      key: this.key,
      encryptedData: this.encryptedData,
    }
  }

  async save() {
    const messages = await Message.getAll()
    messages.push(this.toJSON())

    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.join(__dirname, '..', 'data', 'messages.json'),
        JSON.stringify(messages),
        err => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        }
      )
    })
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      fs.readFile(
        path.join(__dirname, '..', 'data', 'messages.json'),
        'utf-8',
        (err, content) => {
          if (err) {
            reject(err)
          } else {
            resolve(JSON.parse(content))
          }
        }
      )
    })
  }

  static async getByKey(key) {
    const messages = await Message.getAll()
    return messages.find(c => c.key === key)
  }
}

module.exports = Message
