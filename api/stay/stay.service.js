import { ObjectId } from 'mongodb'

import { logger } from '../../services/logger.service.js'
import { makeId } from '../../services/util.service.js'
import { dbService } from '../../services/db.service.js'
import { asyncLocalStorage } from '../../services/als.service.js'

const PAGE_SIZE = 3

export const stayService = {
	remove,
	query,
	getById,
	add,
	update,
	addStayMsg,
	removeStayMsg,
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

async function getById(stayId) {
	try {
        const criteria = { _id: stayId }

		const collection = await dbService.getCollection('stay')
		const stay = await collection.findOne(criteria)
        console.log('stay: ', stay);
		
		return stay
	} catch (err) {
		logger.error(`while finding stay ${stayId}`, err)
		throw err
	}
}

async function remove(stayId) {
    const { loggedinUser } = asyncLocalStorage.getStore()
    const { _id: ownerId, isAdmin } = loggedinUser

	try {
        const criteria = { 
            _id: stayId, 
        }
        if(!isAdmin) criteria['owner._id'] = ownerId
        
		const collection = await dbService.getCollection('stay')
		const res = await collection.deleteOne(criteria)

        if(res.deletedCount === 0) throw('Not your stay')
		return stayId
	} catch (err) {
		logger.error(`cannot remove stay ${stayId}`, err)
		throw err
	}
}

async function add(stay) {
	try {
		const collection = await dbService.getCollection('stay')
		await collection.insertOne(stay)

		return stay
	} catch (err) {
		logger.error('cannot insert stay', err)
		throw err
	}
}

async function update(stay) {
	const stayToSave = {
		// _id: stay._id,
		name: stay.name,
		type: stay.type,
		imgUrls: stay.imgUrls,
		price: stay.price,
		summary: stay.summary,
		capacity: stay.capacity,
		amenities: stay.amenities,
		bathrooms: stay.bathrooms,
		bedrooms: stay.bedrooms,
		roomType: stay.roomType,
		host: stay.host,
		loc: stay.loc,
		// reviews: stay.reviews,
		// likedByUsers: stay.likedByUsers
	};
	
    try {
        const criteria = { _id: stay._id }

		const collection = await dbService.getCollection('stay')
		await collection.updateOne(criteria, { $set: stayToSave })

		return stay
	} catch (err) {
		logger.error(`cannot update stay ${stay._id}`, err)
		throw err
	}
}

async function addStayMsg(stayId, msg) {
	try {
        const criteria = { _id: ObjectId.createFromHexString(stayId) }
        msg.id = makeId()
        
		const collection = await dbService.getCollection('stay')
		await collection.updateOne(criteria, { $push: { msgs: msg } })

		return msg
	} catch (err) {
		logger.error(`cannot add stay msg ${stayId}`, err)
		throw err
	}
}

async function removeStayMsg(stayId, msgId) {
	try {
        const criteria = { _id: ObjectId.createFromHexString(stayId) }

		const collection = await dbService.getCollection('stay')
		await collection.updateOne(criteria, { $pull: { msgs: { id: msgId }}})
        
		return msgId
	} catch (err) {
		logger.error(`cannot remove stay msg ${stayId}`, err)
		throw err
	}
}

function _buildCriteria(filterBy = {}) {
    const icon = filterBy.icon || ''; // Default to empty string if undefined
	const where = filterBy.where || '';
	const checkIn = filterBy.checkIn || '';
	const checkOut = filterBy.checkOut || '';
	const adults = filterBy.adults || '';
	const childrens = filterBy.childrens || '';
	const infants = filterBy.infants || '';
	const pets = filterBy.pets || '';


    let criteria = {}; // Define criteria at the top
    if (icon) {
        criteria = {
            labels: { $in: [new RegExp(icon, 'i')] } // Case-insensitive regex
        };
    }
    // Add where criteria
    if (where) {
        criteria['loc.region'] = { $regex: new RegExp(where, 'i') }; // Case-insensitive regex for region
    }
	// Add checkIn criteria
    if (checkIn){
	}
	// Add checkOut criteria
    if (checkOut){
	}
	// Add adults criteria
    if (adults != 0){
    	criteria['capacity'] = { $eq: Number(adults) }; 
	}
	// Add childrens criteria
    if (childrens != 0){
    	criteria['capacity'] = { $eq: Number(childrens) + Number(adults) }; 

	}
	// Add infants criteria
    if (infants != 0){
    	criteria['capacity'] = { $eq: Number(infants) + Number(adults) }; 
	}
	// Add pets criteria
    if (pets != 0){
		criteria['amenities'] = { $elemMatch: { $regex: /pet/i } };
	}



    return criteria;
}



function _buildSort(filterBy) {
    if(!filterBy.sortField) return {}
    return { [filterBy.sortField]: filterBy.sortDir }
}