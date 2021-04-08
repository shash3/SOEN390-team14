const express = require('express')

const router = express.Router()
const auth = require('../../../middleware/auth')
const User = require('../../../models/User')

const { sendSuggestion } = require('../../../emails/signup')

// Retrieve specific inventory by name
router.post('/suggestion', auth, async (req, res) => {
  const { text } = req.body
  try {
    const user = await User.findById(req.user.id).select('-password')
    sendSuggestion(user.name, text)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

module.exports = router