
/*
 * GET player page
 */

exports.player = function(req, res, next) {
	if(req.isAuthenticated()) {
		res.render('player');
	}
	else {
		req.authenticate(function(error, authenticated) {
			if(authenticated) {
				res.end('authenticated');
			} else {
				res.end('error');
			}
		});
	}
}