const moment = require('moment');

module.exports = (req, res, next) => {
	const format = 'YYYY-MM-DD HH:SS';

	const start = moment();
	console.log('>', start.format(format), '|', req.method, req.url);

	next();

	const end = moment();
	console.log('<', end.format(format), '|', end.diff(start), 'ms');
}
