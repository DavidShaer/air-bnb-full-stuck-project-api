import express from 'express'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'

const router = express.Router()

// We can add a middleware for the entire router:
// router.use(requireAuth)

router.get('/', log, () => {})//get orders
router.post('/',log,requireAuth, () => {})//post order
// router.post('/', log, requireAuth, addStay)
// router.post('/createDatabase', log, requireAuth, addStays)
// router.put('/:id', requireAuth, updateStay)
// router.delete('/:id', requireAuth, removeStay)
// router.delete('/:id', requireAuth, requireAdmin, removeStay)

// router.post('/:id/msg', requireAuth, addStayMsg)
// router.delete('/:id/msg/:msgId', requireAuth, removeStayMsg)

export const orderRoutes = router;