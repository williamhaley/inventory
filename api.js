var database = require('./database.js');

function getAllUsers (req, res) {
	database.getAllUsers(afterGet);

	function afterGet (err, users) {
		res.render('all_users.html', { users: users });
	};
}

module.exports.getAllUsers = getAllUsers;
