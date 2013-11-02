
/*
 * Image Proxy
 */

var request = require('request')
   ,sys = require('sys')
   ,image = "http://userserve-ak.last.fm/serve/300x300/75352964.png";

exports.imageproxy = function(req, res, next) {
	request({url:image, encoding: 'binary'}, function(error, response, body){
		if (!error && response.statusCode == 200) {
			res.setHeader('Cache-Control', 'public, max-age=31557600000');
			res.writeHead(200, {'Content-Type': 'image/png' });
			res.end(body,'binary');
		}
	});
}