const express = require('express');
const hbs     = require('express-hbs');
const path    = require('path');

const logger = require('./middleware/logger');
const index  = require('./routes/index');

const app = express();

app.engine('hbs', hbs.express4({
	partialsDir:   __dirname + '/views/partials',
	defaultLayout: __dirname + '/views/layouts/global',
	layoutsDir:    __dirname + '/views'
}));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(logger);

app.use('/', index);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

const server = app.listen(process.env.PORT || 3000, function () {
	const host = server.address().address;
	const port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});
