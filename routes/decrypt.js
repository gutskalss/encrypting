const { Router } = require('express')
const router = Router()
const Message = require('../models/message')
const crypto = require('crypto')

function decrypt(text) {
  let iv = Buffer.from(text.iv, 'hex')
  let key = Buffer.from(text.key, 'hex')
  let encryptedText = Buffer.from(text.encryptedData, 'hex')
  let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
  let decrypted = decipher.update(encryptedText)

  decrypted = Buffer.concat([decrypted, decipher.final()])

  return decrypted.toString()
}

router.get('/', (req, res) => {
  res.render('decrypt', {
    title: 'Decrypt message',
    isDecrypt: true,
  })
})

router.post('/', async (req, res) => {
  const message = await Message.getByKey(req.body.key)

  const decryptedMessage = decrypt(message)

  res.render('decrypted-message', {
    decryptedMessage,
  })
})

module.exports = router
