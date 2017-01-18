var format      = require('util').format;
var _           = require('underscore');

var Datastore   = require('nedb');

var Equipment   = require('./models/Equipment.js');
var User        = require('./models/User.js');
var Tag         = require('./models/Tag.js');

module.exports = {
	addEquipment:      Equipment.addEquipment,
	checkoutEquipment: Equipment.checkoutEquipment,
	deleteEquipment:   Equipment.deleteEquipment,
	getAllEquipment:   Equipment.getAllEquipment,
	getEquipment:      Equipment.getEquipment,
	returnEquipment:   Equipment.returnEquipment,
	updateEquipment:   Equipment.updateEquipment,
	addUser:           User.addUser,
	deleteUser:        User.deleteUser,
	getAllUsers:       User.getAllUsers,
	getUser:           User.getUser,
	updateUser:        User.updateUser,
	getTag:            Tag.getTag,
};
