const express = require('express')
let users = require('./users.json')
const shortid = require('shortid')

const server = express()

server.use(express.json())
server.use((req, res, next) => {
  console.log(req.url, req.method)
  next()
})

// returns all users
server.get('/api/users', (req, res) => {
  try {
    res.status(200).json(users)
  } catch(err) {
    console.error(err)
    res.status(500).json({ errorMessage: "The user information could not be retrieved." })
  }
})

// adds a user
server.post('/api/users', async (req, res) => {
  try {
    const { bio, name } = req.body

    if(name && bio) {
      const newUser = {
        id: shortid(),
        ...req.body
      }
      await users.push(newUser)
      res.status(201).json(newUser)
    } else {
      res.status(400).json({ errorMessage: 'Please provide name and bio for the user' })
    }
  } catch(err) {
    console.error(err)
    res.status(500).json({ errorMessage: "There was an error while saving the user to the database" })
  }
})

// returns user with specified ID
server.get('/api/users/:id', async (req, res) => {
  try{
    const userId = req.params.id
    const specifiedUser = users.find(user => user.id === userId)
    if(!specifiedUser) {
      res.status(404).json({ message: "The user with the specified ID does not exist." })
    } else {
      res.status(200).json(specifiedUser)
    }
  } catch(err) {
    console.error(err)
    res.status(500).json({ errorMessage: "The user information could not be retrieved." })
  }
})

// deletes user with specified ID
server.delete('/api/users/:id', (req, res) => {
  try {
    const userId = req.params.id
    const deletedUser = users.find(user => user.id === userId)
    const newUsers = users.filter(user => user.id !== userId)
    if(newUsers.length === users.length) {
      res.status(404).json({ message: "The user with the specified ID does not exist." })
    } else {
      users = newUsers
      res.status(200).json(deletedUser)
    }
  } catch(err) {
    console.error(err)
    res.status(500).json({ errorMessage: "The user could not be removed" })
  }
})

server.put('/api/users/:id', (req, res) => {
  try {
    const userId = req.params.id
    const { bio, name } = req.body

    if(!userId) {
      res.status(404).json({ message: "The user with the specified ID does not exist." })
    } else if(!name || !bio) {
      res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    } else {
      const user = users.find(user => user.id === userId)
      user.bio = bio
      user.name = name
      res.status(200).json(user)
    } 
  } catch(err) {
    console.error(err)
    res.status(500).json({ errorMessage: "The user information could not be modified." })
  }
})

server.listen(3000, () => console.log('\n-- API running on port 8000 --\n'))