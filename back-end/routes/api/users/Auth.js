/* eslint-disable no-underscore-dangle */
const express = require('express')

const router = express.Router()
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../../../models/User')
const auth = require('../../../middleware/auth')
const writeToFile = require('../../../variables/logWriter')

// Retrieve user information by token
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// Retrieve user information by name
router.post('/name', auth, async (req, res) => {
  const { name } = req.body
  try {
    const user = await User.find({ name }).select('-password')
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// Change permission by admin
router.put('/permission', auth, async (req, res) => {
  const { email, permission } = req.body
  try {
    // eslint-disable-next-line no-unused-vars
    const user1 = await User.find({ email }).updateOne({ permission })
    const date = new Date().toUTCString()
    const user = await User.findById(req.user.id).select('-password')
    const action = `changed permission of ${email} to ${permission}`
    writeToFile(date, action, user._id)
    res.json('changed')
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// Retrieve all users information
router.get('/all', auth, async (req, res) => {
  try {
    const user = await User.find()
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// Login: Auth user, get token
router.post(
  '/login',
  [
    // form validation
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  // eslint-disable-next-line consistent-return
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('permission')
    const { permission } = user
    try {
      // Verify email
      // eslint-disable-next-line no-shadow
      const user = await User.findOne({ email })

      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid login' }] })
      }

      // Verify pw matches ( pw against encrypted pw)
      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid login' }] })
      }

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      }

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err
          res.json({ token, permission })
        },
      )
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
  },
)

module.exports = router
