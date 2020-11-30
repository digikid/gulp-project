@@if(config.babel) {
// import modules
@@include('import/modules.js')}

// global variables
@@include('base/global/window.js')

// global helpers
@@include('base/global/helpers.js')

// jQuery helpers
;(function($) {
    @@include('base/global/jquery.js')
}(jQuery));

// when document ready
$(document).ready(function() {
    @@include('base/main/ready.js')
});
