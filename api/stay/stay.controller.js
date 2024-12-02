import { logger } from '../../services/logger.service.js'
import { stayService } from './stay.service.js'

export async function getStays(req, res) {
	console.log('req: ', req.query);
	
	try {
		const filterBy = {
			icon: req.query.icon,
			where: req.query.where,
			checkIn: req.query.checkIn,
			checkOut: req.query.checkOut,
			adults: req.query.adults,
			childrens: req.query.childrens,
			infants: req.query.infants,
			pets: req.query.pets,
		}
		console.log('filterBy: ', filterBy);
		
		const stays = await stayService.query(filterBy)
		res.json(stays)
	} catch (err) {
		logger.error('Failed to get stays', err)
		res.status(400).send({ err: 'Failed to get stays' })
	}
}

export async function getStayById(req, res) {
	try {
		const stayId = req.params.id
		const stay = await stayService.getById(stayId)
		res.json(stay)
	} catch (err) {
		logger.error('Failed to get stay', err)
		res.status(400).send({ err: 'Failed to get stay' })
	}
}

export async function addStay(req, res) {
	const { loggedinUser, body: stay } = req
	console.log('req: ', req)


	try {
		stay.owner = loggedinUser
		const addedStay = await stayService.add(stay)
		res.json(addedStay)
	} catch (err) {
		logger.error('Failed to add stay', err)
		res.status(400).send({ err: 'Failed to add stay' })
	}
}

export async function addStays(req, res) {
	const { loggedinUser, body: stays } = req

	try {
		// stay.owner = loggedinUser
		const addedStay = await stayService.add(stay)
		res.json(addedStay)
	} catch (err) {
		logger.error('Failed to add stay', err)
		res.status(400).send({ err: 'Failed to add stay' })
	}
}

export async function updateStay(req, res) {
	const { loggedinUser, body: stay } = req
    const { _id: userId, isAdmin } = loggedinUser

    if(!isAdmin && stay.owner._id !== userId) {
        res.status(403).send('Not your stay...')
        return
    }

	try {
		const updatedStay = await stayService.update(stay)
		res.json(updatedStay)
	} catch (err) {
		logger.error('Failed to update stay', err)
		res.status(400).send({ err: 'Failed to update stay' })
	}
}

export async function removeStay(req, res) {
	try {
		const stayId = req.params.id
		const removedId = await stayService.remove(stayId)

		res.send(removedId)
	} catch (err) {
		logger.error('Failed to remove stay', err)
		res.status(400).send({ err: 'Failed to remove stay' })
	}
}

export async function addStayMsg(req, res) {
	const { loggedinUser } = req

	try {
		const stayId = req.params.id
		const msg = {
			txt: req.body.txt,
			by: loggedinUser,
		}
		const savedMsg = await stayService.addStayMsg(stayId, msg)
		res.json(savedMsg)
	} catch (err) {
		logger.error('Failed to update stay', err)
		res.status(400).send({ err: 'Failed to update stay' })
	}
}

export async function removeStayMsg(req, res) {
	try {
		const { id: stayId, msgId } = req.params

		const removedId = await stayService.removeStayMsg(stayId, msgId)
		res.send(removedId)
	} catch (err) {
		logger.error('Failed to remove stay msg', err)
		res.status(400).send({ err: 'Failed to remove stay msg' })
	}
}
