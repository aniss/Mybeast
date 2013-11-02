define(['underscore', 'backbone'],function(_, Backbone){
	var artists_collection = Backbone.Collection.extend({
		url: "",
		parse: function(response){
			return response.artists.artist;
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
	return artists_collection;
});