define(['jquery', 'underscore', 'backbone', 'handlebars', 'collections/tracks', 'text!templates/player.html'],
	function($, _, backbone, Handlebars, tracks, player_template){

		var player_view = backbone.View.extend({

			initialize: function() {
				console.log('player view generated');
				_.bindAll(this, 'render', 'play', 'pause', 'seek','stoop', 'loadVideo', 'reset', 'changeStates');
				this.template = Handlebars.compile(player_template);
				this.lovedtracks = new tracks({url: "/api?get=lovedtracks"});
				this.lovedtracks.fetch({async:false});
				this.model = this.lovedtracks.first();
				this.model.bind('change', this.render);
				this.loaded = false;
				Handlebars.registerHelper('bigImage', function() {
					if(typeof(this.image) !== "undefined") { return this.image[3]['#text']; }
				});
			},

			events: {
				'click .play-track': 'play',
				'click .pause-track': 'pause',
				'click .bar': 'seek'
			},

			render: function() {
				var compiled_template = this.template(this.model.toJSON());
				$(this.el).html(compiled_template);
				return this;
			},

			play: function(event) {
				var ytplayer = document.getElementById("myytplayer");
				if(!this.loaded) {
					this.loadVideo();
				} else {
					ytplayer.playVideo();
					$('.icon-play').removeClass('icon-play').addClass('icon-pause');
					$('.play-track').removeClass('play-track').addClass('pause-track');
					this.state = setInterval(this.changeStates, 250);
				}
			},

			pause: function(event) {
				var ytplayer = document.getElementById("myytplayer");
				if(ytplayer) {
					ytplayer.pauseVideo();
					$('.icon-pause').removeClass('icon-pause').addClass('icon-play');
					$('.pause-track').removeClass('pause-track').addClass('play-track');
				}
				clearInterval(this.state);
			},

			stoop: function() {
				$('.icon-pause').removeClass('icon-pause').addClass('icon-play');
				$('.pause-track').removeClass('pause-track').addClass('play-track');
			},

			seek: function(event) {
				this.loaded = true;
				var ytplayer = document.getElementById("myytplayer");
				var position = event.clientX - 40;
				var seconds = (ytplayer.getDuration() * position)/210;
				ytplayer.seekTo(seconds);
				this.play();
			},

			reset: function() {
				clearInterval(this.state);
				$('.elapsed').css({width:0});
				$('.current-length').html('0:00');
				this.loaded = false;
			},

			// when double click

			loadVideo: function() {
				var data = this.model.toJSON();
				var that = this;
				var ytplayer = document.getElementById("myytplayer");
				$.ajax({
					url: '/api?get=music&title='+data.name+' - '+data.artist.name,
					success: function(data) {
						// get duration as string 0:00
						// change model data and rend time details
						var date = new Date(data.duration * 1000);
						that.model.set({vID:data.vID, duration: data.duration, duration_str: date.getMinutes()+':'+("0"+date.getSeconds()).slice(-2)});
						ytplayer.cueVideoById({videoId:data.vID, suggestedQuality:'small'});
						that.loaded = true;
						$('.icon-play').removeClass('icon-play').addClass('icon-pause');
						$('.play-track').removeClass('play-track').addClass('pause-track');
						ytplayer.playVideo();
						that.state = setInterval(that.changeStates, 250);					
					}
				});
			},

			changeStates: function() {
				var ytplayer = document.getElementById("myytplayer");
				if(ytplayer && this.loaded){
					var sidebar_width = (ytplayer.getCurrentTime()*210/ytplayer.getDuration()).toString()+'px';
					var date = new Date(ytplayer.getCurrentTime() * 1000);
					var currentTime = date.getMinutes()+':'+("0"+date.getSeconds()).slice(-2);
					$('.elapsed').css({width:sidebar_width});
					$('.current-length').html(currentTime);
					if(ytplayer.getCurrentTime() != 0 && ytplayer.getCurrentTime() == ytplayer.getDuration()) {
						this.reset();
						this.stoop();
					}
				}
			}

		});

		return player_view;
	});