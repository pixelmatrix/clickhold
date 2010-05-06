/*

clickHold 0.02
Copyright © 2010 Josh Pyles / Pixelmatrix Design LLC
http://pixelmatrixdesign.com

Requires jQuery 1.3 or newer

License:
MIT License - http://www.opensource.org/licenses/mit-license.php

Usage:

$("#holdme").clickHold(1000, function(){
  alert("You clicked and held!");
});

Parameters:

clickHold( time[integer or string], callback[function], options[object] )

----
time:
Length of hold before event is fired.
Use an integer, or either "short", "normal", or "long"
----
callback:
Function to run when it's called.
----
options:
touchEvents: (boolean)
Enable this event for Touch devices (iPhone/iPad)

Dedicated to Josh Jenkins and Mike Sigler

Enjoy!

*/
var _t, _r;
(function($) {
  $.fn.clickHold = function(ms, options, trigger) {
    //map vars correctly
    if(typeof(options) == "function"){
      trigger = options;
      options = "";
    }
    //debug(this);
    // build main options before element iteration
    var opts = $.extend({}, $.fn.clickHold.defaults, options);
    // iterate and setup each matched element
    return this.each(function() {
      var $this = $(this);
      // build element specific options
      var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
      
      //support keywords
      if(typeof(ms) == "string"){
        if(ms == "short" || ms == "fast"){
          ms = 300;
        }else if(ms == "normal"){
          ms = 500;
        }else if(ms == "long" || ms == "slow"){
          ms = 2000;
        }
      }
      
      if(typeof(ms) == "number"){
        //unbind previously set clickHold events
        $this.unbind(".clickHold");
        //call events
        $this.bind("mousedown.clickHold",function(){
          $.fn.clickHold.mdown(trigger, ms, $this, o);
        }).bind("mouseup.clickHold",function(){
          $.fn.clickHold.mup();
        });
        //call touch events if enabled
        if(o.touchEvents){
          $this.bind("touchstart.clickHold", function(){
            $.fn.clickHold.mdown(trigger, ms, $this, o);
          }).bind("touchend.clickHold", function(){
            $.fn.clickHold.mup();
          }).bind("touchcancel.clickHold", function(){
            $.fn.clickHold.mup();
          });
        }
      }else{
        console.error("You didn't specify a valid time interval");
      }
    });
  };
  
  $.fn.clickHold.mdown = function(trigger, ms, el, o){
      el.unbind("click.clickHold");
      _t = setTimeout(function(){
        el.bind("click.clickHold", function(){
          return false;
        });
        if(o.repeat){
          _r = setInterval(trigger, o.interval);
        }else{
          trigger();
        }
      }, ms);
  }

  $.fn.clickHold.mup = function(){
    clearTimeout(_t);
    clearInterval(_r);
  }
  //
  // plugin defaults
  //
  $.fn.clickHold.defaults = {
    touchEvents: true,
    repeat: false,
    interval: 300
  };
})(jQuery);