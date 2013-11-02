define(['jquery','underscore','backbone', 'views/explore', 'views/player', 'http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js'], 
    function($, _, Backbone, explore_view, player_view) {
    
    var Router = Backbone.Router.extend({
        initialize: function() {
        	// initialise the yplayer 
            var params = { allowScriptAccess: "always" };
            var atts = { id: "myytplayer" };
            swfobject.embedSWF("http://www.youtube.com/v/EtR5OHS5I_o?enablejsapi=1&playerapiid=ytplayer&version=3",
                       "ytapiplayer", "0", "0", "8", null, null, params, atts);
            $("#swooby-content").animate({left:'296px'}, 700);
            this.player = new player_view();
            $("#swooby-player").html(this.player.render().el);
        },

        routes: {
            '': 'home',
            'explore': 'explore'
        },

        home: function() {
        },

        explore: function() {
            var explore_page = new explore_view({player: this.player});
            $("#swooby-content").html(explore_page.render().el);
            explore_page.slide();
            window.tracks = explore_page;
        }

    });
    
    var initialize = function() {
        var router = new Router();
        Backbone.history.start();
    }
    
    return { initialize: initialize };
});