/* ===========================================================
 * bootstrapx-bubble.js v1.0.0
 * ===========================================================
 * 
 * Written by Tim Camuti - based on tooltip, popover and modal
 * ========================================================== */

!function ($) {

  "use strict"; // jshint ;_;

 /* BUBBLE PUBLIC CLASS DEFINITION
  * =============================== */

  var Bubble = function (element, options) {
    this.init('bubble', element, options)
  }

  Bubble.prototype = {

    constructor: Bubble

  , init: function (type, element, options) {
      var eventIn
        , eventOut

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true
      this.eventNamespace = 'bubble' + new Date().getTime()

      if (this.options.trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (this.options.trigger != 'manual') {
        eventIn = this.options.trigger == 'hover' ? 'mouseenter' : 'focus'
        eventOut = this.options.trigger == 'hover' ? 'mouseleave' : 'blur'
        this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data())

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , inside
        , elementPos
        , windowCoords
        , actualWidth
        , actualHeight
        , placement
        , placementOverride
        , tp
        , paddingConstant = 0
        , setArrowMargin

        //hide others
        if(this.options.hideOthers){
          $(".bubble").removeClass("in").detach();
        }

      if (this.hasContent() && this.enabled) {
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement
        
        inside = /in/.test(placement)
        placement = inside ? placement.split(' ')[1] : placement
        placementOverride = placement
        
        $tip
          .detach()
          .css({ top: 0, left: 0, display: 'block' })
          .insertAfter(this.$element)

        /* Positioning coordinates */
        elementPos = this.getPosition(inside)
        windowCoords = {
          height:$(window).height()
          , width:$(window).width()
          , scrollTop : $(window).scrollTop()
        }
        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
        
        /* Placement overrides:
         if initial placement goes off screen, a secondary (opposite) placement is substituted  */
          switch (inside ? placement.split(' ')[1] : placement) {
          case 'bottom': //if bottom goes off the screen and a top placement won't go off the screen 
            if(elementPos.top + elementPos.height + actualHeight  > windowCoords.height 
              && elementPos.top - actualHeight >= (0 + paddingConstant)){
              placement = "top"
              }
            break
          case 'top':
            if(elementPos.top - windowCoords.scrollTop - actualHeight  < (0 + paddingConstant)){
              placement = "bottom"
            }
            break
          case 'left':
            if( elementPos.left < actualWidth + paddingConstant ){
             placement = "right" 
            }
            break
          case 'right':
            if( elementPos.left + elementPos.width + actualWidth > windowCoords.width
              && elementPos.left > actualWidth){
             placement = "left" 
            }
            break
        }

        /*
        keep placements on the page if possible*/
        var topCoord = elementPos.top + elementPos.height / 2 - actualHeight / 2 ,
            bottomCoord = elementPos.top + elementPos.height / 2 + actualHeight / 2,
            arrowMargin

            setArrowMargin = function(){
              // shift the arrow
              if(topCoord - windowCoords.scrollTop < 0){
                arrowMargin = topCoord - windowCoords.scrollTop - elementPos.height / 2
                $tip.find(".arrow").css({marginTop : arrowMargin})
              }
              else if(bottomCoord > windowCoords.height + windowCoords.scrollTop){
                arrowMargin = topCoord - (windowCoords.height + windowCoords.scrollTop - actualHeight +  elementPos.height/2)
                $tip.find(".arrow").css({marginTop : arrowMargin})
              }
              else{
                $tip.find(".arrow").css({marginTop : -11})
              }
            }

      /*  Set placement Coordinates with intelligence
          ------------------------------------------------------------------ */
        
        switch (inside ? placement.split(' ')[1] : placement) {
          case 'bottom':
            tp = {top: elementPos.top + elementPos.height, left: elementPos.left + elementPos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: elementPos.top - actualHeight, left: elementPos.left + elementPos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: (topCoord - windowCoords.scrollTop < 0)? 0 + windowCoords.scrollTop : 
              (bottomCoord > windowCoords.height + windowCoords.scrollTop)? windowCoords.height + windowCoords.scrollTop - actualHeight: topCoord
              , left: elementPos.left - actualWidth}
              setArrowMargin()
            break
          case 'right':
           tp = {top: (topCoord - windowCoords.scrollTop < 0)? 0 + windowCoords.scrollTop : 
              (bottomCoord > windowCoords.height + windowCoords.scrollTop)? windowCoords.height + windowCoords.scrollTop - actualHeight: topCoord
              , left: elementPos.left + elementPos.width
              }
              setArrowMargin()
            break
        }

        $tip
          .offset(tp)
          .addClass(placement)
          .addClass('in')
          this.escape()
          this.clickClose()
      }
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()

      $tip.removeClass('in')
      this.escape()
      this.clickClose()
      
      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).detach()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.detach()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.detach()

      return this
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').removeAttr('title')
      }
    }

  , getPosition: function (inside) {
      return $.extend({}, (inside ? {top: 0, left: 0} : this.$element.offset()), {
        width: this.$element[0].offsetWidth
      , height: this.$element[0].offsetHeight
      })
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , validate: function () {
        if (!this.$element[0].parentNode) {
          this.hide()
          this.$element = null
          this.options = null
        }
      }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)
      self[self.tip().hasClass('in') ? 'hide' : 'show']()
    }

  // popover style functions
  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent()

      $tip.find('.bubble-title')[this.options.html ? 'html' : 'text'](title)
      $tip.find('.bubble-content')[this.options.html ? 'html' : 'text'](content)

      $tip.removeClass('fade top bottom left right in')
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent()
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      content = $e.attr('data-content')
        || (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)

      return content
    }

  , tip: function () {
     var that = this
      if (!this.$tip) {
        this.$tip = $(this.options.template)
        .delegate('[data-dismiss="bubble"]', 'click.' + that.eventNamespace, $.proxy(this.hide, this))
      }
      return this.$tip
    }
  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }
  
  // Modal style functions
  , escape: function () {
      var that = this
      if (that.tip().hasClass("in")) {
        $(document).on('keyup.' + that.eventNamespace, function ( e ) {
          if(e.which == 27){
            that.hide()
          }  
        })
      } else if (!that.tip().hasClass("in")) {
        $(document).off('keyup.' + that.eventNamespace)
      }
    }
  , clickClose: function () {
    // this hides the bubble if somewhere other than the spawning element or inside the bubble is clicked.
      var that = this
      if (that.tip().hasClass("in")) {
        $(document).on('click.' + that.eventNamespace, function ( e ) {
          if ( !($(".bubble").has(e.target).length || $(e.target).hasClass("bubblemaker") || $(e.target).attr("data-dismiss") == "bubble") ) {
            that.hide()
          }  
        })
      } else if (!that.tip().hasClass("in")) {
        $(document).off('click.' + that.eventNamespace)
      }
    }
  }


 /* BUBBLE PLUGIN DEFINITION
  * ========================= */
  
  var old = $.fn.bubble

  $.fn.bubble = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('bubble')
        , options = typeof option == 'object' && option
      if (!data) $this.data('bubble', (data = new Bubble(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.bubble.Constructor = Bubble

  $.fn.bubble.defaults = {
    animation: true
  , selector: false
  , delay: 0
  , html: true
  , title: ''
  , content: ''
  , placement: 'right'
  , trigger: 'click'
  , hideOthers: true
  , template: '<div class="bubble popover"><div class="arrow"></div><div class="bubble-inner">'
    + '<div class="modal-header"><button type="button" class="close" data-dismiss="bubble" aria-hidden="true">' 
    + '<i class="icon-remove"></i></button><h3 class="bubble-title"></h3></div><div class="bubble-content modal-body">' 
    + '</div></div></div>'
  }

  /* BUBBLE NO CONFLICT
  * =================== */

  $.fn.bubble.noConflict = function () {
    $.fn.bubble = old
    return this
  }

}(window.jQuery);
