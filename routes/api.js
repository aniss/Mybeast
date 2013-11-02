
/*
 * GET api
 */

var request = require('request')
	,api_key = "b25b959554ed76058ac220b7b2e0a026"
	,Cache2File = require("cache2file")
	,cachePath = "./cache"
	,timeout = 86400000
	,cache = new Cache2File(cachePath, timeout);

var audioscrobbler = function(method, limit, callback) {
	request('http://ws.audioscrobbler.com/2.0/?method='+method+'&api_key='+api_key+'&format=json&limit='+limit, function (error, response, data) {
	  if (!error && response.statusCode == 200) {
	    callback(data);
	  } 
	});
}

exports.api = function(req, res, next) {

	if(req.param('get') == 'hypedtrack') {
		console.log('batata');
		// get data from cache
		cache.get('hypedtrack', function(err, data){
			if(!err) {
				res.end(data);
			} else {
				audioscrobbler('chart.gethypedtracks', 20, function(data){
					res.end(data);
					cache.set('hypedtrack', data);
				});
			}
		});
	};

	if(req.param('get') == 'lovedtracks') {
		// get data from cache
		cache.get('lovedtracks', function(err, data){
			if(!err) {
				res.end(data);
			} else {
				audioscrobbler('chart.getlovedtracks', 14, function(data){
					res.end(data);
					cache.set('lovedtracks', data);
				});
			}
		});
	};

	if(req.param('get') == 'hypedartists') {
		// get data from cache
		cache.get('hypedartists', function(err, data){
			if(!err) {
				res.end(data);
			} else {
				audioscrobbler('chart.gethypedartists', 20, function(data){
					res.end(data);
					cache.set('hypedartists', data);
				});
			}
		});
	}

	if(req.param('get') == 'music') {
		var title = req.param('title');
		request("https://gdata.youtube.com/feeds/api/videos?q="+title+"&alt=json&max-results=1&v=2",
			function(error, response, data){
				if(!error && response.statusCode == 200) {
					var videoJSON = JSON.parse(data);
					var videoID = videoJSON['feed']['entry'][0]['media$group']['yt$videoid']['$t'];
					var duration = videoJSON['feed']['entry'][0]['media$group']['yt$duration']['seconds'];
					res.json({ vID: videoID, duration: duration });
				}
			});
	}

};
