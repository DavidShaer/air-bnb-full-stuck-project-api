import { ObjectId } from 'mongodb'

import { logger } from '../../services/logger.service.js'
import { makeId } from '../../services/util.service.js'
import { dbService } from '../../services/db.service.js'

const PAGE_SIZE = 3

export const orderService = {
	query,
	add,
}

async function query(filterBy) {
	try {
        const criteria = _buildCriteria(filterBy)
        const sort = _buildSort(filterBy)

		const collection = await dbService.getCollection('stay')
		
		console.log('criteria: ', criteria);
		var stayCursor = await collection.find(criteria, { sort })

		if (filterBy.pageIdx !== undefined) {
			stayCursor.skip(filterBy.pageIdx * PAGE_SIZE).limit(PAGE_SIZE)
		}

		const stays = stayCursor.toArray()
		return stays
	} catch (err) {
		logger.error('cannot find stays', err)
		throw err
	}
}

// async function getById(stayId) {
// 	try {
//         const criteria = { _id: stayId }

// 		const collection = await dbService.getCollection('stay')
// 		const stay = await collection.findOne(criteria)
//         console.log('stay: ', stay);
		
// 		return stay
// 	} catch (err) {
// 		logger.error(`while finding stay ${stayId}`, err)
// 		throw err
// 	}
// }

async function add(order) {
	try {
		const collection = await dbService.getCollection('order')
		await collection.insertOne(order)

		return order
	} catch (err) {
		logger.error('cannot insert order', err)
		throw err
	}
}