const router = require('express').Router()
const { User, Session } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.get('/', tokenExtractor, async (request, response, next) => {
  const currentUserId = request.decodedToken.id

  try {
    const currentUser = await User.findByPk(currentUserId)
    if (currentUser.admin === true) {
      const allSessions = await Session.findAll()
      response.status(200).send({ allSessions })
      return
    }
    response.status(403).send({ error: "user who is not an admin can't view the sessions" })
  } catch(error) {
    next(error)
  }
})

module.exports = router


/*
  make route to check sessions is delete
  go inside db instead make a route to check
  select * from sessions;
*/
