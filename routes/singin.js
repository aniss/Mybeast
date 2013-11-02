
/*
 *	GET singin page
 */

 exports.singin = function(req, res, next) {
 	if(req.isAuthenticated()) res.redirect('/i/#explore');
 	else {
		req.authenticate(function(error, authenticated){
			if(authenticated) {
				res.redirect('/i/#explore');
			} else {
				res.end('facebook authentication failed:(');
			}
		});
 	}
}