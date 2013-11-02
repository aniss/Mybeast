define(['underscore', 'backbone'],function(_, Backbone){
	var hypedtracks_collection = Backbone.Collection.extend({
		url: "",
		parse: function(response){
			return response.tracks.track;
		},
		initialize: function(props) {
			this.url = props.url;
		},
		fetchSuccess: function(collection, response) {
			console.log('done!');
		},
		fetchError: function(collection, response) {
			console.log('error');
		}
	});
	return hypedtracks_collection;
});