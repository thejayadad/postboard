 
 const express = require("express")
 const router = express.Router()
 const { ensureAuth, ensureGuest } = require('../middleware/auth')
const Board = require("../models/Board")


router.get("/", ensureGuest, (req, res) => {
    res.render("login")
})

router.get("/board", ensureAuth, async (req, res) => {
try {
    const boards = await Board.find({ user: req.user.id}).lean()
    res.render("board", {
        name: req.user.firstName,
        boards
    })
} catch (error) {
 console.log(err)    
}    
})

 module.exports = router