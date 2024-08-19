const router = require('express').Router()
const { tokenExtractor } = require('../util/middleware')
const { Session } = require('../models')

router.delete('/', tokenExtractor, async (request, response, next) => {
  const currentUserId = request.decodedToken.id
  try {
    const userSession = await Session.destroy({ 
      where: { user_id : currentUserId },
      force: true,
    })

    response
      .status(204)
      .send({ userSession })

  } catch(error) {
    next(error)
  }
})

module.exports = router


/* use update instead of delete
  const userSession = await Session.findOne({ where: { user_id : currentUserId } })
    userSession.iat = 0
    userSession.save()
*/
