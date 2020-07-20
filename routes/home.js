const { Router } = require('express')
const router = Router()
const Message = require('../models/message')
const crypto = require('crypto')

function encrypt(text) {
  const key = crypto.randomBytes(32)
  const iv = crypto.randomBytes(16)
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv)
  let encrypted = cipher.update(text)

  encrypted = Buffer.concat([encrypted, cipher.final()])

  return {
    iv: iv.toString('hex'),
    key: key.toString('hex'),
    encryptedData: encrypted.toString('hex'),
  }
}

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Main page',
    isHome: true,
  })
})

router.post('/', async (req, res) => {
  const encryptedMessage = encrypt(req.body.message)
  const message = new Message(
    encryptedMessage.iv,
    encryptedMessage.key,
    encryptedMessage.encryptedData
  )

  await message.save()

  res.render('info-message', {
    key: encryptedMessage.key,
  })
})

module.exports = router
