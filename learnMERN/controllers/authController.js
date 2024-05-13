const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const login = asyncHandler( async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await User.findOne({ username }).exec()

    if (!foundUser || !foundUser.active) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) return res.status(401).json({ message: 'Unauthorized' })

    const accessToken = signAccessToken(foundUser.username)

    const refreshToken = signRefreshToken(foundUser.username)

    // Create secure cookie with refresh token
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server
        secure: true, //https
        sameSite: 'None', //cross-site cookie
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })

    // Send accessToken containing username and roles
    res.json({ accessToken })
})

const refresh = asyncHandler( async (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ username: decoded.username }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = signAccessToken(foundUser.username)

            res.json({ accessToken })
        })
    )
})

const logout = asyncHandler( async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
})

const signAccessToken = (username) => {
    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": username,
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )
    return accessToken
}

const signRefreshToken = (username) => {
    const refreshToken = jwt.sign(
        { "username": username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )
    return refreshToken
}

module.exports = {
    login,
    refresh,
    logout
}