define(['jquery', 'underscore', 'backbone', 'handlebars', 'collections/tracks', 'collections/artists', 'text!templates/explore.html', 'mousewheel', 'jcarousel'],
	function($, _, Backbone, Handlebars, tracks, artists, explore_template, mousewheel, jCarouselLite){

		var explore_view = Backbone.View.extend({

			initialize: function() {
				/*
				 * Load hyped tracks
				 */
				this.hypedtracks = new tracks({url: "/api?get=hypedtrack"});
				this.hypedtracks.fetch({async:false});
				/*
				 * Load hyped artists
				 */
				this.hypedartists = new artists({url: "/api?get=hypedartists"});
				this.hypedartists.fetch({async:false});

				/*
				 * Load loved tracks
				 */
				this.lovedtracks = new tracks({url: "/api?get=lovedtracks"});
				this.lovedtracks.fetch({async:false});

				_.bindAll(this, 'render', 'slide', 'setPlayer');
				this.template = Handlebars.compile(explore_template);
				/*
				 * register Handlebars helpers
				 */
				Handlebars.registerHelper('mediumImage', function() {
					if(typeof(this.image) !== "undefined") { return this.image[2]['#text']; }
				});
				Handlebars.registerHelper('bigImage', function() {
					if(typeof(this.image) !== "undefined") { return this.image[3]['#text']; }
				});
			},

			events: {
				'dblclick #tracks-list li': 'setPlayer'
			},

			render: function() {
				var compiled_template = this.template({
					hypedtracks: this.hypedtracks.toJSON(), 
					hypedartists: this.hypedartists.toJSON(),
					lovedtracks: this.lovedtracks.toJSON()
				});
				$(this.el).html(compiled_template);
				return this;
			},

			setPlayer: function(event) {
				// get clicked track by mbid
				this.options.player.reset();
				var track_mbid = $(event.target).closest('li').data('mbid');
				// get track model by mbid
				var model = (this.lovedtracks.where({mbid:track_mbid})[0] !== 'undefined') ? this.lovedtracks.where({mbid:track_mbid})[0] : this.hypedtracks.where({mbid:track_mbid})[0];
				// change player model
				this.options.player.model.set(model.toJSON());
				this.options.player.loadVideo();
			},



			slide: function() {
				$("#tracks-slider, #artists-slider").jCarouselLite({
               		 mouseWheel: true,
                	 circular: false
            	});
			}


		});

		return explore_view;
	
	});