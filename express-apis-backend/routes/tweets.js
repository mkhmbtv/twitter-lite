const express = require('express');
const { check } = require('express-validator');

const db = require('../db/models');

const { Tweet, User } = db;
const { asyncHandler, handleValidationErrors } = require('../utils');
const { requireAuth } = require('../auth');

const tweetNotFound = (id) => {
  const err = Error(`Tweet with id of ${id} could not be found`);
  err.title = 'Tweet not found.'
  err.status = 404;
  return err;
};

const router = express.Router();

router.use(requireAuth);

router.get('/', asyncHandler(async (req, res) => {
  const tweets = await Tweet.findAll({
    include: [{ model: User, as: 'user', attributes: ['username'] }],
    order: [['createdAt', 'DESC']],
    attributes: ['message'],
  });
  res.json({ tweets });
}));

router.get('/:id(\\d+)', asyncHandler(async (req, res, next) => {
  const tweetId = parseInt(req.params.id, 10);
  const tweet = await Tweet.findByPk(tweetId);
  
  if (tweet) {
    res.json({ tweet });
  } else {
    next(tweetNotFound(tweetId));
  }
}));

const validateTweet = [
  check('message')
    .exists({ checkFalsy: true })
    .withMessage('Message can\'t be empty.')
    .isLength({ max: 280 })
    .withMessage('Message can\'t be longer than 280 characters.'),
];

router.post('/', validateTweet, handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { message } = req.body;
    const tweet = await Tweet.create({ message, userId: req.user.id });
    res.json({ tweet });
  }));

router.put('/:id(\\d+)', validateTweet, handleValidationErrors,
  asyncHandler(async (req, res, next) => {
    const tweetId = parseInt(req.params.id, 10);
    const tweet = await Tweet.findByPk(tweetId);

    if (tweet) {
      await tweet.update({ message: req.body.message });
      res.json({ tweet });
    } else {
      next(tweetNotFound(tweetId));
    }
  }));

router.delete('/:id(\\d+)', asyncHandler(async (req, res, next) => {
  const tweetId = parseInt(req.params.id, 10);
  const tweet = await Tweet.findByPk(tweetId);

  if (tweet) {
    await tweet.destroy();
    res.status(204).end();
  } else {
    next(tweetNotFound(tweetId));
  }
}));

module.exports = router;