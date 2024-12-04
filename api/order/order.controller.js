import { logger } from '../../services/logger.service.js'
import { orderService } from './order.service.js';
// import { stayService } from './stay.service.js'

// export async function getStays(req, res) {
// 	console.log('req: ', req.query);
	
// 	try {
// 		const filterBy = {
// 			icon: req.query.icon,
// 			where: req.query.where,
// 			checkIn: req.query.checkIn,
// 			checkOut: req.query.checkOut,
// 			adults: req.query.adults,
// 			childrens: req.query.childrens,
// 			infants: req.query.infants,
// 			pets: req.query.pets,
// 		}
// 		console.log('filterBy: ', filterBy);
		
// 		const stays = await stayService.query(filterBy)
// 		res.json(stays)
// 	} catch (err) {
// 		logger.error('Failed to get stays', err)
// 		res.status(400).send({ err: 'Failed to get stays' })
// 	}
// }

// export async function getStayById(req, res) {
// 	try {
// 		const stayId = req.params.id
// 		const stay = await stayService.getById(stayId)
// 		res.json(stay)
// 	} catch (err) {
// 		logger.error('Failed to get stay', err)
// 		res.status(400).send({ err: 'Failed to get stay' })
// 	}
// }

export async function addOrder(req, res) {
	const { loggedinUser, body: order } = req
	console.log('req: ', req)

	try {
		order.owner = loggedinUser
		// const addedOrder = await orderService.add(order)
		// res.json(addedOrder)
	} catch (err) {
		logger.error('Failed to add order', err)
		res.status(400).send({ err: 'Failed to add order' })
	}
}