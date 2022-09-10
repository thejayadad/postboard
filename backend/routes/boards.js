const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Story = require('../models/Board')

router.get('/add', ensureAuth, (req, res) => {
  res.render('board/add')
})

// @desc    Process add form
// @route   POST /stories
router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id
    await Board.create(req.body)
    res.redirect('/board')
  } catch (err) {
    console.error(err)
  }
})


router.get('/', ensureAuth, async (req, res) => {
  try {
    const boards = await Board.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()

    res.render('board/index', {
      boards,
    })
  } catch (err) {
    console.error(err)
  }
})


router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let board = await Board.findById(req.params.id).populate('user').lean()

    if (!board) {
      return res.send("No Board")
    }

    if (board.user._id != req.user.id && board.status == 'private') {
      res.send("Error")
    } else {
      res.render('board/show', {
        board,
      })
    }
  } catch (err) {
    console.error(err)
  }
})


router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const story = await Board.findOne({
      _id: req.params.id,
    }).lean()

    if (!board) {
      return res.send('error')
    }

    if (board.user != req.user.id) {
      res.redirect('/boards')
    } else {
      res.render('stories/edit', {
        story,
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Update story
// @route   PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean()

    if (!story) {
      return res.render('error/404')
    }

    if (story.user != req.user.id) {
      res.redirect('/stories')
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })

      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Delete story
// @route   DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean()

    if (!story) {
      return res.render('error/404')
    }

    if (story.user != req.user.id) {
      res.redirect('/stories')
    } else {
      await Story.remove({ _id: req.params.id })
      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    User stories
// @route   GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean()

    res.render('stories/index', {
      stories,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

module.exports = router