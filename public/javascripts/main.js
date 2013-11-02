// main page 
//------------------

require.config({
  
        paths: {
          jquery: 'libs/jquery.min',
          underscore: 'libs/underscore',
          backbone: 'libs/backbone',
          text: 'libs/text',
          sticky: 'libs/sticky',
          jcarousel: 'libs/jcarousel',
          mousewheel: 'libs/mousewheel',
          easing: 'libs/easing',
          localStorage: 'libs/localStorage',
          handlebars: 'libs/handlebars'
        }
  
    });

require(['app'], function(App) {
   
        // initialize the application on load
        App.initialize();
        console.log(App);
   
    });