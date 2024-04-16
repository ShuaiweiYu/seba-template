const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    // Get all users from MongoDB
    // await User.find(): 这一部分是使用Mongoose的find()方法来查询数据库中的用户数据。User是一个Mongoose模型，代表了数据库中的用户集合（collection）。
    // .select('-hashedPassword'): 通过select()方法，我们告诉Mongoose不要返回用户对象中的hashedPassword字段。
    // .lean(): 这是Mongoose的一个方法，用于将Mongoose文档转换为普通的JavaScript对象。这样做是为了更好地控制返回的数据。
    const users = await User.find().select('-hashedPassword').lean()

    // If no users
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }

    res.json(users)
})


const getUserByUsername = asyncHandler(async (req, res) => {
    const {username} = req.params

    const user = await User.findOne({ username }).select('-hashedPassword').lean().exec()

    if (user) {
        res.json(user)
    } else {
        res.status(404).json({ message: 'User not found' })
    }
})

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { username, hashedPassword } = req.body

    // Confirm data
    if (!username || !hashedPassword) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate username
    // await User.findOne({ username }): 这一部分是使用Mongoose的findOne()方法来查询数据库中是否存在指定用户名的用户数据。
    // .exec(): exec()是Mongoose提供的方法，用于执行查询。在这个例子中，它确保查询被执行，并且返回一个Promise以供await使用。
    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    // Hash Password
    const hashedPwd = await bcrypt.hash(hashedPassword, 10) // salt rounds

    const userObject = { username, "hashedPassword": hashedPwd }

    // Create and store new user
    const user = await User.create(userObject)

    if (user) { //created
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, hashedPassword } = req.body

    // Confirm data
    if (!id || !username) {
        return res.status(400).json({ message: 'All fields except hashedPassword are required' })
    }

    // Does the user exist to update?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()

    // Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    user.username = username

    if (hashedPassword) {
        // Hash Password
        user.hashedPassword = await bcrypt.hash(hashedPassword, 10) // salt rounds
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })
})

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    // Does the user still have assigned notes?
    const note = await Note.findOne({ user: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'User has assigned notes' })
    }

    // Does the user exist to delete?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllUsers,
    getUserByUsername,
    createNewUser,
    updateUser,
    deleteUser
}