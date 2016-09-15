/*!
 *   Angular Smooth Scroll (ngSmoothScroll)
 *   Animates scrolling to elements, by David Oliveros.
 *
 *   Callback hooks contributed by Ben Armston https://github.com/benarmston
 *   Easing support contributed by Willem Liu. https://github.com/willemliu
 *   Easing functions forked from Gaëtan Renaudeau. https://gist.github.com/gre/1650294
 *   Infinite loop bugs in iOS and Chrome (when zoomed) by Alex Guzman. https://github.com/alexguzman
 *   Support for scrolling in custom containers by Joseph Matthias Goh. https://github.com/zephinzer
 *   Influenced by Chris Ferdinandi
 *   https://github.com/cferdinandi
 *
 *   Version: 2.0.0
 *   License: MIT
 */

(function () {
  'use strict';

  var module = angular.module('smoothScroll', []);


  /**
   * Smooth scrolls the window/div to the provided element.
   *
   * 20150713 EDIT - zephinzer
   *  Added new option - containerId to account for scrolling within a DIV
   */
  var smoothScroll = function (element, options) {
    options = options || {};

    // Options
    var duration = options.duration || 800,
      offset = options.offset || 0,
      easing = options.easing || 'easeInOutQuart',
      callbackBefore = options.callbackBefore || function() {},
      callbackAfter = options.callbackAfter || function() {},
      container = document.getElementById(options.containerId) || null,
      containerPresent = (container != undefined && container != null);

    /**
     * Retrieve current location
     */
    var getScrollLocation = function() {
      if(containerPresent) {
        return container.scrollTop;
      } else {
        if(window.pageYOffset) {
          return window.pageYOffset;
        } else {
          return document.documentElement.scrollTop;
        }
      }
    };

    /**
     * Calculate easing pattern.
     *
     * 20150713 edit - zephinzer
     * - changed if-else to switch
     * @see http://archive.oreilly.com/pub/a/server-administration/excerpts/even-faster-websites/writing-efficient-javascript.html
     */
    var getEasingPattern = function(type, time) {
      switch(type) {
        case 'easeInQuad':    return time * time; // accelerating from zero velocity
        case 'easeOutQuad':   return time * (2 - time); // decelerating to zero velocity
        case 'easeInOutQuad':   return time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time; // acceleration until halfway, then deceleration
        case 'easeInCubic':   return time * time * time; // accelerating from zero velocity
        case 'easeOutCubic':  return (--time) * time * time + 1; // decelerating to zero velocity
        case 'easeInOutCubic':  return time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1; // acceleration until halfway, then deceleration
        case 'easeInQuart':   return time * time * time * time; // accelerating from zero velocity
        case 'easeOutQuart':  return 1 - (--time) * time * time * time; // decelerating to zero velocity
        case 'easeInOutQuart':  return time < 0.5 ? 8 * time * time * time * time : 1 - 8 * (--time) * time * time * time; // acceleration until halfway, then deceleration
        case 'easeInQuint':   return time * time * time * time * time; // accelerating from zero velocity
        case 'easeOutQuint':  return 1 + (--time) * time * time * time * time; // decelerating to zero velocity
        case 'easeInOutQuint':  return time < 0.5 ? 16 * time * time * time * time * time : 1 + 16 * (--time) * time * time * time * time; // acceleration until halfway, then deceleration
        default:        return time;
      }
    };

    /**
     * Calculate how far to scroll
     */
    var getEndLocation = function(element) {
      var location = 0;
      if (element.offsetParent) {
        do {
          location += element.offsetTop;
          element = element.offsetParent;
        } while (element);
      }
      location = Math.max(location - offset, 0);
      return location;
    };

    // Initialize the whole thing
    setTimeout( function() {
      var currentLocation = null,
        startLocation   = getScrollLocation(),
        endLocation   = getEndLocation(element),
        timeLapsed    = 0,
        distance    = endLocation - startLocation,
        percentage,
        position,
        scrollHeight,
        internalHeight;

      /**
       * Stop the scrolling animation when the anchor is reached (or at the top/bottom of the page)
       */
      var stopAnimation = function () {
        currentLocation = getScrollLocation();
        if(containerPresent) {
          scrollHeight = container.scrollHeight;
          internalHeight = container.clientHeight + currentLocation;
        } else {
          scrollHeight = document.body.scrollheight;
          internalHeight = window.innerHeight + currentLocation;
        }

        if (
          ( // condition 1
            position == endLocation
          ) ||
          ( // condition 2
            currentLocation == endLocation
          ) ||
          ( // condition 3
            internalHeight >= scrollHeight
          )
        ) { // stop
          clearInterval(runAnimation);
          callbackAfter(element);
        }
      };

      /**
       * Scroll the page by an increment, and check if it's time to stop
       */
      var animateScroll = function () {
        timeLapsed += 16;
        percentage = ( timeLapsed / duration );
        percentage = ( percentage > 1 ) ? 1 : percentage;
        position = startLocation + ( distance * getEasingPattern(easing, percentage) );
        if(containerPresent) {
          container.scrollTop = position;
        } else {
          window.scrollTo( 0, position );
        }
        stopAnimation();
      };

      callbackBefore(element);
      var runAnimation = setInterval(animateScroll, 16);
    }, 0);
  };


  // Expose the library in a factory
  //
  module.factory('smoothScroll', function() {
    return smoothScroll;
  });


  /**
   * Scrolls the window to this element, optionally validating an expression
   *
   * 20150713 EDIT - zephinzer
   *  Added containerId to attributes for smooth scrolling within a DIV
   */
  module.directive('smoothScroll', ['smoothScroll', function(smoothScroll) {
    return {
      restrict: 'A',
      scope: {
        callbackBefore: '&',
        callbackAfter: '&',
      },
      link: function($scope, $elem, $attrs) {
        if ( typeof $attrs.scrollIf === 'undefined' || $attrs.scrollIf === 'true' ) {
          setTimeout( function() {

            var callbackBefore = function(element) {
              if ( $attrs.callbackBefore ) {
                var exprHandler = $scope.callbackBefore({ element: element });
                if (typeof exprHandler === 'function') {
                  exprHandler(element);
                }
              }
            };

            var callbackAfter = function(element) {
              if ( $attrs.callbackAfter ) {
                var exprHandler = $scope.callbackAfter({ element: element });
                if (typeof exprHandler === 'function') {
                  exprHandler(element);
                }
              }
            };

            smoothScroll($elem[0], {
              duration: $attrs.duration,
              offset: $attrs.offset,
              easing: $attrs.easing,
              callbackBefore: callbackBefore,
              callbackAfter: callbackAfter,
              containerId: $attrs.containerId
            });
          }, 0);
        }
      }
    };
  }]);


  /**
   * Scrolls to a specified element ID when this element is clicked
   *
   * 20150713 EDIT - zephinzer
   *  Added containerId to attributes for smooth scrolling within a DIV
   */
  module.directive('scrollTo', ['smoothScroll', function(smoothScroll) {
    return {
      restrict: 'A',
      scope: {
        callbackBefore: '&',
        callbackAfter: '&',
      },
      link: function($scope, $elem, $attrs) {
        var targetElement;

        $elem.on('click', function(e) {
          e.preventDefault();

          targetElement = document.getElementById($attrs.scrollTo);
          if ( !targetElement ) return;

          var callbackBefore = function(element) {
            if ( $attrs.callbackBefore ) {
              var exprHandler = $scope.callbackBefore({element: element});
              if (typeof exprHandler === 'function') {
                exprHandler(element);
              }
            }
          };

          var callbackAfter = function(element) {
            if ( $attrs.callbackAfter ) {
              var exprHandler = $scope.callbackAfter({element: element});
              if (typeof exprHandler === 'function') {
                exprHandler(element);
              }
            }
          };

          smoothScroll(targetElement, {
            duration: $attrs.duration,
            offset: $attrs.offset,
            easing: $attrs.easing,
            callbackBefore: callbackBefore,
            callbackAfter: callbackAfter,
            containerId: $attrs.containerId
          });

          return false;
        });
      }
    };
  }]);

}());

;(function () {
  'use strict';

  /**
   * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
   *
   * @codingstandard ftlabs-jsv2
   * @copyright The Financial Times Limited [All Rights Reserved]
   * @license MIT License (see LICENSE.txt)
   */

  /*jslint browser:true, node:true*/
  /*global define, Event, Node*/


  /**
   * Instantiate fast-clicking listeners on the specified layer.
   *
   * @constructor
   * @param {Element} layer The layer to listen on
   * @param {Object} [options={}] The options to override the defaults
   */
  function FastClick(layer, options) {
    var oldOnClick;

    options = options || {};

    /**
     * Whether a click is currently being tracked.
     *
     * @type boolean
     */
    this.trackingClick = false;


    /**
     * Timestamp for when click tracking started.
     *
     * @type number
     */
    this.trackingClickStart = 0;


    /**
     * The element being tracked for a click.
     *
     * @type EventTarget
     */
    this.targetElement = null;


    /**
     * X-coordinate of touch start event.
     *
     * @type number
     */
    this.touchStartX = 0;


    /**
     * Y-coordinate of touch start event.
     *
     * @type number
     */
    this.touchStartY = 0;


    /**
     * ID of the last touch, retrieved from Touch.identifier.
     *
     * @type number
     */
    this.lastTouchIdentifier = 0;


    /**
     * Touchmove boundary, beyond which a click will be cancelled.
     *
     * @type number
     */
    this.touchBoundary = options.touchBoundary || 10;


    /**
     * The FastClick layer.
     *
     * @type Element
     */
    this.layer = layer;

    /**
     * The minimum time between tap(touchstart and touchend) events
     *
     * @type number
     */
    this.tapDelay = options.tapDelay || 200;

    /**
     * The maximum time for a tap
     *
     * @type number
     */
    this.tapTimeout = options.tapTimeout || 700;

    if (FastClick.notNeeded(layer)) {
      return;
    }

    // Some old versions of Android don't have Function.prototype.bind
    function bind(method, context) {
      return function() { return method.apply(context, arguments); };
    }


    var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
    var context = this;
    for (var i = 0, l = methods.length; i < l; i++) {
      context[methods[i]] = bind(context[methods[i]], context);
    }

    // Set up event handlers as required
    if (deviceIsAndroid) {
      layer.addEventListener('mouseover', this.onMouse, true);
      layer.addEventListener('mousedown', this.onMouse, true);
      layer.addEventListener('mouseup', this.onMouse, true);
    }

    layer.addEventListener('click', this.onClick, true);
    layer.addEventListener('touchstart', this.onTouchStart, false);
    layer.addEventListener('touchmove', this.onTouchMove, false);
    layer.addEventListener('touchend', this.onTouchEnd, false);
    layer.addEventListener('touchcancel', this.onTouchCancel, false);

    // Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
    // which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
    // layer when they are cancelled.
    if (!Event.prototype.stopImmediatePropagation) {
      layer.removeEventListener = function(type, callback, capture) {
        var rmv = Node.prototype.removeEventListener;
        if (type === 'click') {
          rmv.call(layer, type, callback.hijacked || callback, capture);
        } else {
          rmv.call(layer, type, callback, capture);
        }
      };

      layer.addEventListener = function(type, callback, capture) {
        var adv = Node.prototype.addEventListener;
        if (type === 'click') {
          adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
            if (!event.propagationStopped) {
              callback(event);
            }
          }), capture);
        } else {
          adv.call(layer, type, callback, capture);
        }
      };
    }

    // If a handler is already declared in the element's onclick attribute, it will be fired before
    // FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
    // adding it as listener.
    if (typeof layer.onclick === 'function') {

      // Android browser on at least 3.2 requires a new reference to the function in layer.onclick
      // - the old one won't work if passed to addEventListener directly.
      oldOnClick = layer.onclick;
      layer.addEventListener('click', function(event) {
        oldOnClick(event);
      }, false);
      layer.onclick = null;
    }
  }

  /**
  * Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
  *
  * @type boolean
  */
  var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

  /**
   * Android requires exceptions.
   *
   * @type boolean
   */
  var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


  /**
   * iOS requires exceptions.
   *
   * @type boolean
   */
  var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


  /**
   * iOS 4 requires an exception for select elements.
   *
   * @type boolean
   */
  var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


  /**
   * iOS 6.0-7.* requires the target element to be manually derived
   *
   * @type boolean
   */
  var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

  /**
   * BlackBerry requires exceptions.
   *
   * @type boolean
   */
  var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

  /**
   * Determine whether a given element requires a native click.
   *
   * @param {EventTarget|Element} target Target DOM element
   * @returns {boolean} Returns true if the element needs a native click
   */
  FastClick.prototype.needsClick = function(target) {
    switch (target.nodeName.toLowerCase()) {

    // Don't send a synthetic click to disabled inputs (issue #62)
    case 'button':
    case 'select':
    case 'textarea':
      if (target.disabled) {
        return true;
      }

      break;
    case 'input':

      // File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
      if ((deviceIsIOS && target.type === 'file') || target.disabled) {
        return true;
      }

      break;
    case 'label':
    case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
    case 'video':
      return true;
    }

    return (/\bneedsclick\b/).test(target.className);
  };


  /**
   * Determine whether a given element requires a call to focus to simulate click into element.
   *
   * @param {EventTarget|Element} target Target DOM element
   * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
   */
  FastClick.prototype.needsFocus = function(target) {
    switch (target.nodeName.toLowerCase()) {
    case 'textarea':
      return true;
    case 'select':
      return !deviceIsAndroid;
    case 'input':
      switch (target.type) {
      case 'button':
      case 'checkbox':
      case 'file':
      case 'image':
      case 'radio':
      case 'submit':
        return false;
      }

      // No point in attempting to focus disabled inputs
      return !target.disabled && !target.readOnly;
    default:
      return (/\bneedsfocus\b/).test(target.className);
    }
  };


  /**
   * Send a click event to the specified element.
   *
   * @param {EventTarget|Element} targetElement
   * @param {Event} event
   */
  FastClick.prototype.sendClick = function(targetElement, event) {
    var clickEvent, touch;

    // On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
    if (document.activeElement && document.activeElement !== targetElement) {
      document.activeElement.blur();
    }

    touch = event.changedTouches[0];

    // Synthesise a click event, with an extra attribute so it can be tracked
    clickEvent = document.createEvent('MouseEvents');
    clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
    clickEvent.forwardedTouchEvent = true;
    targetElement.dispatchEvent(clickEvent);
  };

  FastClick.prototype.determineEventType = function(targetElement) {

    //Issue #159: Android Chrome Select Box does not open with a synthetic click event
    if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
      return 'mousedown';
    }

    return 'click';
  };


  /**
   * @param {EventTarget|Element} targetElement
   */
  FastClick.prototype.focus = function(targetElement) {
    var length;

    // Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
    if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
      length = targetElement.value.length;
      targetElement.setSelectionRange(length, length);
    } else {
      targetElement.focus();
    }
  };


  /**
   * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
   *
   * @param {EventTarget|Element} targetElement
   */
  FastClick.prototype.updateScrollParent = function(targetElement) {
    var scrollParent, parentElement;

    scrollParent = targetElement.fastClickScrollParent;

    // Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
    // target element was moved to another parent.
    if (!scrollParent || !scrollParent.contains(targetElement)) {
      parentElement = targetElement;
      do {
        if (parentElement.scrollHeight > parentElement.offsetHeight) {
          scrollParent = parentElement;
          targetElement.fastClickScrollParent = parentElement;
          break;
        }

        parentElement = parentElement.parentElement;
      } while (parentElement);
    }

    // Always update the scroll top tracker if possible.
    if (scrollParent) {
      scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
    }
  };


  /**
   * @param {EventTarget} targetElement
   * @returns {Element|EventTarget}
   */
  FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {

    // On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
    if (eventTarget.nodeType === Node.TEXT_NODE) {
      return eventTarget.parentNode;
    }

    return eventTarget;
  };


  /**
   * On touch start, record the position and scroll offset.
   *
   * @param {Event} event
   * @returns {boolean}
   */
  FastClick.prototype.onTouchStart = function(event) {
    var targetElement, touch, selection;

    // Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
    if (event.targetTouches.length > 1) {
      return true;
    }

    targetElement = this.getTargetElementFromEventTarget(event.target);
    touch = event.targetTouches[0];

    if (deviceIsIOS) {

      // Only trusted events will deselect text on iOS (issue #49)
      selection = window.getSelection();
      if (selection.rangeCount && !selection.isCollapsed) {
        return true;
      }

      if (!deviceIsIOS4) {

        // Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
        // when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
        // with the same identifier as the touch event that previously triggered the click that triggered the alert.
        // Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
        // immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
        // Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
        // which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
        // random integers, it's safe to to continue if the identifier is 0 here.
        if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
          event.preventDefault();
          return false;
        }

        this.lastTouchIdentifier = touch.identifier;

        // If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
        // 1) the user does a fling scroll on the scrollable layer
        // 2) the user stops the fling scroll with another tap
        // then the event.target of the last 'touchend' event will be the element that was under the user's finger
        // when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
        // is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
        this.updateScrollParent(targetElement);
      }
    }

    this.trackingClick = true;
    this.trackingClickStart = event.timeStamp;
    this.targetElement = targetElement;

    this.touchStartX = touch.pageX;
    this.touchStartY = touch.pageY;

    // Prevent phantom clicks on fast double-tap (issue #36)
    if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
      event.preventDefault();
    }

    return true;
  };


  /**
   * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
   *
   * @param {Event} event
   * @returns {boolean}
   */
  FastClick.prototype.touchHasMoved = function(event) {
    var touch = event.changedTouches[0], boundary = this.touchBoundary;

    if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
      return true;
    }

    return false;
  };


  /**
   * Update the last position.
   *
   * @param {Event} event
   * @returns {boolean}
   */
  FastClick.prototype.onTouchMove = function(event) {
    if (!this.trackingClick) {
      return true;
    }

    // If the touch has moved, cancel the click tracking
    if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
      this.trackingClick = false;
      this.targetElement = null;
    }

    return true;
  };


  /**
   * Attempt to find the labelled control for the given label element.
   *
   * @param {EventTarget|HTMLLabelElement} labelElement
   * @returns {Element|null}
   */
  FastClick.prototype.findControl = function(labelElement) {

    // Fast path for newer browsers supporting the HTML5 control attribute
    if (labelElement.control !== undefined) {
      return labelElement.control;
    }

    // All browsers under test that support touch events also support the HTML5 htmlFor attribute
    if (labelElement.htmlFor) {
      return document.getElementById(labelElement.htmlFor);
    }

    // If no for attribute exists, attempt to retrieve the first labellable descendant element
    // the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
    return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
  };


  /**
   * On touch end, determine whether to send a click event at once.
   *
   * @param {Event} event
   * @returns {boolean}
   */
  FastClick.prototype.onTouchEnd = function(event) {
    var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

    if (!this.trackingClick) {
      return true;
    }

    // Prevent phantom clicks on fast double-tap (issue #36)
    if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
      this.cancelNextClick = true;
      return true;
    }

    if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
      return true;
    }

    // Reset to prevent wrong click cancel on input (issue #156).
    this.cancelNextClick = false;

    this.lastClickTime = event.timeStamp;

    trackingClickStart = this.trackingClickStart;
    this.trackingClick = false;
    this.trackingClickStart = 0;

    // On some iOS devices, the targetElement supplied with the event is invalid if the layer
    // is performing a transition or scroll, and has to be re-detected manually. Note that
    // for this to function correctly, it must be called *after* the event target is checked!
    // See issue #57; also filed as rdar://13048589 .
    if (deviceIsIOSWithBadTarget) {
      touch = event.changedTouches[0];

      // In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
      targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
      targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
    }

    targetTagName = targetElement.tagName.toLowerCase();
    if (targetTagName === 'label') {
      forElement = this.findControl(targetElement);
      if (forElement) {
        this.focus(targetElement);
        if (deviceIsAndroid) {
          return false;
        }

        targetElement = forElement;
      }
    } else if (this.needsFocus(targetElement)) {

      // Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
      // Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
      if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
        this.targetElement = null;
        return false;
      }

      this.focus(targetElement);
      this.sendClick(targetElement, event);

      // Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
      // Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
      if (!deviceIsIOS || targetTagName !== 'select') {
        this.targetElement = null;
        event.preventDefault();
      }

      return false;
    }

    if (deviceIsIOS && !deviceIsIOS4) {

      // Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
      // and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
      scrollParent = targetElement.fastClickScrollParent;
      if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
        return true;
      }
    }

    // Prevent the actual click from going though - unless the target node is marked as requiring
    // real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
    if (!this.needsClick(targetElement)) {
      event.preventDefault();
      this.sendClick(targetElement, event);
    }

    return false;
  };


  /**
   * On touch cancel, stop tracking the click.
   *
   * @returns {void}
   */
  FastClick.prototype.onTouchCancel = function() {
    this.trackingClick = false;
    this.targetElement = null;
  };


  /**
   * Determine mouse events which should be permitted.
   *
   * @param {Event} event
   * @returns {boolean}
   */
  FastClick.prototype.onMouse = function(event) {

    // If a target element was never set (because a touch event was never fired) allow the event
    if (!this.targetElement) {
      return true;
    }

    if (event.forwardedTouchEvent) {
      return true;
    }

    // Programmatically generated events targeting a specific element should be permitted
    if (!event.cancelable) {
      return true;
    }

    // Derive and check the target element to see whether the mouse event needs to be permitted;
    // unless explicitly enabled, prevent non-touch click events from triggering actions,
    // to prevent ghost/doubleclicks.
    if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

      // Prevent any user-added listeners declared on FastClick element from being fired.
      if (event.stopImmediatePropagation) {
        event.stopImmediatePropagation();
      } else {

        // Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
        event.propagationStopped = true;
      }

      // Cancel the event
      event.stopPropagation();
      event.preventDefault();

      return false;
    }

    // If the mouse event is permitted, return true for the action to go through.
    return true;
  };


  /**
   * On actual clicks, determine whether this is a touch-generated click, a click action occurring
   * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
   * an actual click which should be permitted.
   *
   * @param {Event} event
   * @returns {boolean}
   */
  FastClick.prototype.onClick = function(event) {
    var permitted;

    // It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
    if (this.trackingClick) {
      this.targetElement = null;
      this.trackingClick = false;
      return true;
    }

    // Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
    if (event.target.type === 'submit' && event.detail === 0) {
      return true;
    }

    permitted = this.onMouse(event);

    // Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
    if (!permitted) {
      this.targetElement = null;
    }

    // If clicks are permitted, return true for the action to go through.
    return permitted;
  };


  /**
   * Remove all FastClick's event listeners.
   *
   * @returns {void}
   */
  FastClick.prototype.destroy = function() {
    var layer = this.layer;

    if (deviceIsAndroid) {
      layer.removeEventListener('mouseover', this.onMouse, true);
      layer.removeEventListener('mousedown', this.onMouse, true);
      layer.removeEventListener('mouseup', this.onMouse, true);
    }

    layer.removeEventListener('click', this.onClick, true);
    layer.removeEventListener('touchstart', this.onTouchStart, false);
    layer.removeEventListener('touchmove', this.onTouchMove, false);
    layer.removeEventListener('touchend', this.onTouchEnd, false);
    layer.removeEventListener('touchcancel', this.onTouchCancel, false);
  };


  /**
   * Check whether FastClick is needed.
   *
   * @param {Element} layer The layer to listen on
   */
  FastClick.notNeeded = function(layer) {
    var metaViewport;
    var chromeVersion;
    var blackberryVersion;
    var firefoxVersion;

    // Devices that don't support touch don't need FastClick
    if (typeof window.ontouchstart === 'undefined') {
      return true;
    }

    // Chrome version - zero for other browsers
    chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

    if (chromeVersion) {

      if (deviceIsAndroid) {
        metaViewport = document.querySelector('meta[name=viewport]');

        if (metaViewport) {
          // Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
          if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
            return true;
          }
          // Chrome 32 and above with width=device-width or less don't need FastClick
          if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
            return true;
          }
        }

      // Chrome desktop doesn't need FastClick (issue #15)
      } else {
        return true;
      }
    }

    if (deviceIsBlackBerry10) {
      blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

      // BlackBerry 10.3+ does not require Fastclick library.
      // https://github.com/ftlabs/fastclick/issues/251
      if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
        metaViewport = document.querySelector('meta[name=viewport]');

        if (metaViewport) {
          // user-scalable=no eliminates click delay.
          if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
            return true;
          }
          // width=device-width (or less than device-width) eliminates click delay.
          if (document.documentElement.scrollWidth <= window.outerWidth) {
            return true;
          }
        }
      }
    }

    // IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
    if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
      return true;
    }

    // Firefox version - zero for other browsers
    firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

    if (firefoxVersion >= 27) {
      // Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

      metaViewport = document.querySelector('meta[name=viewport]');
      if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
        return true;
      }
    }

    // IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
    // http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
    if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
      return true;
    }

    return false;
  };


  /**
   * Factory method for creating a FastClick object
   *
   * @param {Element} layer The layer to listen on
   * @param {Object} [options={}] The options to override the defaults
   */
  FastClick.attach = function(layer, options) {
    return new FastClick(layer, options);
  };


  if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

    // AMD. Register as an anonymous module.
    define(function() {
      return FastClick;
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = FastClick.attach;
    module.exports.FastClick = FastClick;
  } else {
    window.FastClick = FastClick;
  }
}());

//
// Copyright Kamil Pękala http://github.com/kamilkp
// angular-sortable-view v0.0.15 2015/01/18
//

;(function(window, angular){
  'use strict';
  /* jshint eqnull:true */
  /* jshint -W041 */
  /* jshint -W030 */

  var module = angular.module('angular-sortable-view', []);
  module.directive('svRoot', [function(){
    function shouldBeAfter(elem, pointer, isGrid){
      return isGrid ? elem.x - pointer.x < 0 : elem.y - pointer.y < 0;
    }
    function getSortableElements(key){
      return ROOTS_MAP[key];
    }
    function removeSortableElements(key){
      delete ROOTS_MAP[key];
    }

    var sortingInProgress;
    var ROOTS_MAP = Object.create(null);
    // window.ROOTS_MAP = ROOTS_MAP; // for debug purposes

    return {
      restrict: 'A',
      controller: ['$scope', '$attrs', '$interpolate', '$parse', function($scope, $attrs, $interpolate, $parse){
        var mapKey = $interpolate($attrs.svRoot)($scope) || $scope.$id;
        if(!ROOTS_MAP[mapKey]) ROOTS_MAP[mapKey] = [];

        var that         = this;
        var candidates;  // set of possible destinations
        var $placeholder;// placeholder element
        var options;     // sortable options
        var $helper;     // helper element - the one thats being dragged around with the mouse pointer
        var $original;   // original element
        var $target;     // last best candidate
        var isGrid       = false;
        var onSort       = $parse($attrs.svOnSort);

        // ----- hack due to https://github.com/angular/angular.js/issues/8044
        $attrs.svOnStart = $attrs.$$element[0].attributes['sv-on-start'];
        $attrs.svOnStart = $attrs.svOnStart && $attrs.svOnStart.value;

        $attrs.svOnStop = $attrs.$$element[0].attributes['sv-on-stop'];
        $attrs.svOnStop = $attrs.svOnStop && $attrs.svOnStop.value;
        // -------------------------------------------------------------------

        var onStart = $parse($attrs.svOnStart);
        var onStop = $parse($attrs.svOnStop);

        this.sortingInProgress = function(){
          return sortingInProgress;
        };

        if($attrs.svGrid){ // sv-grid determined explicite
          isGrid = $attrs.svGrid === "true" ? true : $attrs.svGrid === "false" ? false : null;
          if(isGrid === null)
            throw 'Invalid value of sv-grid attribute';
        }
        else{
          // check if at least one of the lists have a grid like layout
          $scope.$watchCollection(function(){
            return getSortableElements(mapKey);
          }, function(collection){
            isGrid = false;
            var array = collection.filter(function(item){
              return !item.container;
            }).map(function(item){
              return {
                part: item.getPart().id,
                y: item.element[0].getBoundingClientRect().top
              };
            });
            var dict = Object.create(null);
            array.forEach(function(item){
              if(dict[item.part])
                dict[item.part].push(item.y);
              else
                dict[item.part] = [item.y];
            });
            Object.keys(dict).forEach(function(key){
              dict[key].sort();
              dict[key].forEach(function(item, index){
                if(index < dict[key].length - 1){
                  if(item > 0 && item === dict[key][index + 1]){
                    isGrid = true;
                  }
                }
              });
            });
          });
        }

        this.$moveUpdate = function(opts, mouse, svElement, svOriginal, svPlaceholder, originatingPart, originatingIndex){
          var svRect = svElement[0].getBoundingClientRect();
          if(opts.tolerance === 'element')
            mouse = {
              x: ~~(svRect.left + svRect.width/2),
              y: ~~(svRect.top + svRect.height/2)
            };

          sortingInProgress = true;
          candidates = [];
          if(!$placeholder){
            if(svPlaceholder){ // custom placeholder
              $placeholder = svPlaceholder.clone();
              $placeholder.removeClass('ng-hide');
            }
            else{ // default placeholder
              $placeholder = svOriginal.clone();
              $placeholder.addClass('sv-visibility-hidden');
              $placeholder.addClass('sv-placeholder');
              $placeholder.css({
                'height': svRect.height + 'px',
                'width': svRect.width + 'px'
              });
            }

            svOriginal.after($placeholder);
            svOriginal.addClass('ng-hide');

            // cache options, helper and original element reference
            $original = svOriginal;
            options = opts;
            $helper = svElement;

            onStart($scope, {
              $helper: {element: $helper},
              $part: originatingPart.model(originatingPart.scope),
              $index: originatingIndex,
              $item: originatingPart.model(originatingPart.scope)[originatingIndex]
            });
            $scope.$root && $scope.$root.$$phase || $scope.$apply();
          }

          // ----- move the element
          $helper[0].reposition({
            x: mouse.x + document.body.scrollLeft - mouse.offset.x*svRect.width,
            y: mouse.y + document.body.scrollTop - mouse.offset.y*svRect.height
          });

          // ----- manage candidates
          getSortableElements(mapKey).forEach(function(se, index){
            if(opts.containment != null){
              // TODO: optimize this since it could be calculated only once when the moving begins
              if(
                !elementMatchesSelector(se.element, opts.containment) &&
                !elementMatchesSelector(se.element, opts.containment + ' *')
              ) return; // element is not within allowed containment
            }
            var rect = se.element[0].getBoundingClientRect();
            var center = {
              x: ~~(rect.left + rect.width/2),
              y: ~~(rect.top + rect.height/2)
            };
            if(!se.container && // not the container element
              (se.element[0].scrollHeight || se.element[0].scrollWidth)){ // element is visible
              candidates.push({
                element: se.element,
                q: (center.x - mouse.x)*(center.x - mouse.x) + (center.y - mouse.y)*(center.y - mouse.y),
                view: se.getPart(),
                targetIndex: se.getIndex(),
                after: shouldBeAfter(center, mouse, isGrid)
              });
            }
            if(se.container && !se.element[0].querySelector('[sv-element]:not(.sv-placeholder):not(.sv-source)')){ // empty container
              candidates.push({
                element: se.element,
                q: (center.x - mouse.x)*(center.x - mouse.x) + (center.y - mouse.y)*(center.y - mouse.y),
                view: se.getPart(),
                targetIndex: 0,
                container: true
              });
            }
          });
          var pRect = $placeholder[0].getBoundingClientRect();
          var pCenter = {
            x: ~~(pRect.left + pRect.width/2),
            y: ~~(pRect.top + pRect.height/2)
          };
          candidates.push({
            q: (pCenter.x - mouse.x)*(pCenter.x - mouse.x) + (pCenter.y - mouse.y)*(pCenter.y - mouse.y),
            element: $placeholder,
            placeholder: true
          });
          candidates.sort(function(a, b){
            return a.q - b.q;
          });

          candidates.forEach(function(cand, index){
            if(index === 0 && !cand.placeholder && !cand.container){
              $target = cand;
              cand.element.addClass('sv-candidate');
              if(cand.after)
                cand.element.after($placeholder);
              else
                insertElementBefore(cand.element, $placeholder);
            }
            else if(index === 0 && cand.container){
              $target = cand;
              cand.element.append($placeholder);
            }
            else
              cand.element.removeClass('sv-candidate');
          });
        };

        this.$drop = function(originatingPart, index, options){
          if(!$placeholder) return;

          if(options.revert){
            var placeholderRect = $placeholder[0].getBoundingClientRect();
            var helperRect = $helper[0].getBoundingClientRect();
            var distance = Math.sqrt(
              Math.pow(helperRect.top - placeholderRect.top, 2) +
              Math.pow(helperRect.left - placeholderRect.left, 2)
            );

            var duration = +options.revert*distance/200; // constant speed: duration depends on distance
            duration = Math.min(duration, +options.revert); // however it's not longer that options.revert

            ['-webkit-', '-moz-', '-ms-', '-o-', ''].forEach(function(prefix){
              if(typeof $helper[0].style[prefix + 'transition'] !== "undefined")
                $helper[0].style[prefix + 'transition'] = 'all ' + duration + 'ms ease';
            });
            setTimeout(afterRevert, duration);
            $helper.css({
              'top': placeholderRect.top + document.body.scrollTop + 'px',
              'left': placeholderRect.left + document.body.scrollLeft + 'px'
            });
          }
          else
            afterRevert();

          function afterRevert(){
            sortingInProgress = false;
            $placeholder.remove();
            $helper.remove();
            $original.removeClass('ng-hide');

            candidates = void 0;
            $placeholder = void 0;
            options = void 0;
            $helper = void 0;
            $original = void 0;

            // sv-on-stop callback
            onStop($scope, {
              $part: originatingPart.model(originatingPart.scope),
              $index: index,
              $item: originatingPart.model(originatingPart.scope)[index]
            });

            if($target){
              $target.element.removeClass('sv-candidate');
              var spliced = originatingPart.model(originatingPart.scope).splice(index, 1);
              var targetIndex = $target.targetIndex;
              if($target.view === originatingPart && $target.targetIndex > index)
                targetIndex--;
              if($target.after)
                targetIndex++;
              $target.view.model($target.view.scope).splice(targetIndex, 0, spliced[0]);

              // sv-on-sort callback
              if($target.view !== originatingPart || index !== targetIndex)
                onSort($scope, {
                  $partTo: $target.view.model($target.view.scope),
                  $partFrom: originatingPart.model(originatingPart.scope),
                  $item: spliced[0],
                  $indexTo: targetIndex,
                  $indexFrom: index
                });

            }
            $target = void 0;

            $scope.$root && $scope.$root.$$phase || $scope.$apply();
          }
        };

        this.addToSortableElements = function(se){
          getSortableElements(mapKey).push(se);
        };
        this.removeFromSortableElements = function(se){
          var elems = getSortableElements(mapKey);
          var index = elems.indexOf(se);
          if(index > -1){
            elems.splice(index, 1);
            if(elems.length === 0)
              removeSortableElements(mapKey);
          }
        };
      }]
    };
  }]);

  module.directive('svPart', ['$parse', function($parse){
    return {
      restrict: 'A',
      require: '^svRoot',
      controller: ['$scope', function($scope){
        $scope.$ctrl = this;
        this.getPart = function(){
          return $scope.part;
        };
        this.$drop = function(index, options){
          $scope.$sortableRoot.$drop($scope.part, index, options);
        };
      }],
      scope: true,
      link: function($scope, $element, $attrs, $sortable){
        if(!$attrs.svPart) throw new Error('no model provided');
        var model = $parse($attrs.svPart);
        if(!model.assign) throw new Error('model not assignable');

        $scope.part = {
          id: $scope.$id,
          element: $element,
          model: model,
          scope: $scope
        };
        $scope.$sortableRoot = $sortable;

        var sortablePart = {
          element: $element,
          getPart: $scope.$ctrl.getPart,
          container: true
        };
        $sortable.addToSortableElements(sortablePart);
        $scope.$on('$destroy', function(){
          $sortable.removeFromSortableElements(sortablePart);
        });
      }
    };
  }]);

  module.directive('svElement', ['$parse', function($parse){
    return {
      restrict: 'A',
      require: ['^svPart', '^svRoot'],
      controller: ['$scope', function($scope){
        $scope.$ctrl = this;
      }],
      link: function($scope, $element, $attrs, $controllers){
        var sortableElement = {
          element: $element,
          getPart: $controllers[0].getPart,
          getIndex: function(){
            return $scope.$index;
          }
        };
        $controllers[1].addToSortableElements(sortableElement);
        $scope.$on('$destroy', function(){
          $controllers[1].removeFromSortableElements(sortableElement);
        });

        var handle = $element;
        handle.on('mousedown touchstart', onMousedown);
        $scope.$watch('$ctrl.handle', function(customHandle){
          if(customHandle){
            handle.off('mousedown touchstart', onMousedown);
            handle = customHandle;
            handle.on('mousedown touchstart', onMousedown);
          }
        });

        var helper;
        $scope.$watch('$ctrl.helper', function(customHelper){
          if(customHelper){
            helper = customHelper;
          }
        });

        var placeholder;
        $scope.$watch('$ctrl.placeholder', function(customPlaceholder){
          if(customPlaceholder){
            placeholder = customPlaceholder;
          }
        });

        var body = angular.element(document.body);
        var html = angular.element(document.documentElement);

        var moveExecuted;

        function onMousedown(e){
          touchFix(e);

          if($controllers[1].sortingInProgress()) return;
          if(e.button != 0 && e.type === 'mousedown') return;

          moveExecuted = false;
          var opts = $parse($attrs.svElement)($scope);
          opts = angular.extend({}, {
            tolerance: 'pointer',
            revert: 200,
            containment: 'html'
          }, opts);
          if(opts.containment){
            var containmentRect = closestElement.call($element, opts.containment)[0].getBoundingClientRect();
          }

          var target = $element;
          var clientRect = $element[0].getBoundingClientRect();
          var clone;

          if(!helper) helper = $controllers[0].helper;
          if(!placeholder) placeholder = $controllers[0].placeholder;
          if(helper){
            clone = helper.clone();
            clone.removeClass('ng-hide');
            clone.css({
              'left': clientRect.left + document.body.scrollLeft + 'px',
              'top': clientRect.top + document.body.scrollTop + 'px'
            });
            target.addClass('sv-visibility-hidden');
          }
          else{
            clone = target.clone();
            clone.addClass('sv-helper').css({
              'left': clientRect.left + document.body.scrollLeft + 'px',
              'top': clientRect.top + document.body.scrollTop + 'px',
              'width': clientRect.width + 'px'
            });
          }

          clone[0].reposition = function(coords){
            var targetLeft = coords.x;
            var targetTop = coords.y;
            var helperRect = clone[0].getBoundingClientRect();

            var body = document.body;

            if(containmentRect){
              if(targetTop < containmentRect.top + body.scrollTop) // top boundary
                targetTop = containmentRect.top + body.scrollTop;
              if(targetTop + helperRect.height > containmentRect.top + body.scrollTop + containmentRect.height) // bottom boundary
                targetTop = containmentRect.top + body.scrollTop + containmentRect.height - helperRect.height;
              if(targetLeft < containmentRect.left + body.scrollLeft) // left boundary
                targetLeft = containmentRect.left + body.scrollLeft;
              if(targetLeft + helperRect.width > containmentRect.left + body.scrollLeft + containmentRect.width) // right boundary
                targetLeft = containmentRect.left + body.scrollLeft + containmentRect.width - helperRect.width;
            }
            this.style.left = targetLeft - body.scrollLeft + 'px';
            this.style.top = targetTop - body.scrollTop + 'px';
          };

          var pointerOffset = {
            x: (e.clientX - clientRect.left)/clientRect.width,
            y: (e.clientY - clientRect.top)/clientRect.height
          };
          html.addClass('sv-sorting-in-progress');
          html.on('mousemove touchmove', onMousemove).on('mouseup touchend touchcancel', function mouseup(e){
            html.off('mousemove touchmove', onMousemove);
            html.off('mouseup touchend', mouseup);
            html.removeClass('sv-sorting-in-progress');
            if(moveExecuted){
              $controllers[0].$drop($scope.$index, opts);
            }
            $element.removeClass('sv-visibility-hidden');
          });

          // onMousemove(e);
          function onMousemove(e){
            touchFix(e);
            if(!moveExecuted){
              $element.parent().prepend(clone);
              moveExecuted = true;
            }
            $controllers[1].$moveUpdate(opts, {
              x: e.clientX,
              y: e.clientY,
              offset: pointerOffset
            }, clone, $element, placeholder, $controllers[0].getPart(), $scope.$index);
          }
        }
      }
    };
  }]);

  module.directive('svHandle', function(){
    return {
      require: '?^svElement',
      link: function($scope, $element, $attrs, $ctrl){
        if($ctrl)
          $ctrl.handle = $element.add($ctrl.handle); // support multiple handles
      }
    };
  });

  module.directive('svHelper', function(){
    return {
      require: ['?^svPart', '?^svElement'],
      link: function($scope, $element, $attrs, $ctrl){
        $element.addClass('sv-helper').addClass('ng-hide');
        if($ctrl[1])
          $ctrl[1].helper = $element;
        else if($ctrl[0])
          $ctrl[0].helper = $element;
      }
    };
  });

  module.directive('svPlaceholder', function(){
    return {
      require: ['?^svPart', '?^svElement'],
      link: function($scope, $element, $attrs, $ctrl){
        $element.addClass('sv-placeholder').addClass('ng-hide');
        if($ctrl[1])
          $ctrl[1].placeholder = $element;
        else if($ctrl[0])
          $ctrl[0].placeholder = $element;
      }
    };
  });

  angular.element(document.head).append([
    '<style>' +
    '.sv-helper{' +
      'position: fixed !important;' +
      'z-index: 99999;' +
      'margin: 0 !important;' +
    '}' +
    '.sv-candidate{' +
    '}' +
    '.sv-placeholder{' +
      // 'opacity: 0;' +
    '}' +
    '.sv-sorting-in-progress{' +
      '-webkit-user-select: none;' +
      '-moz-user-select: none;' +
      '-ms-user-select: none;' +
      'user-select: none;' +
    '}' +
    '.sv-visibility-hidden{' +
      'visibility: hidden !important;' +
      'opacity: 0 !important;' +
    '}' +
    '</style>'
  ].join(''));

  function touchFix(e){
    if(!('clientX' in e) && !('clientY' in e)) {
      var touches = e.touches || e.originalEvent.touches;
      if(touches && touches.length) {
        e.clientX = touches[0].clientX;
        e.clientY = touches[0].clientY;
      }
      e.preventDefault();
    }
  }

  function getPreviousSibling(element){
    element = element[0];
    if(element.previousElementSibling)
      return angular.element(element.previousElementSibling);
    else{
      var sib = element.previousSibling;
      while(sib != null && sib.nodeType != 1)
        sib = sib.previousSibling;
      return angular.element(sib);
    }
  }

  function insertElementBefore(element, newElement){
    var prevSibl = getPreviousSibling(element);
    if(prevSibl.length > 0){
      prevSibl.after(newElement);
    }
    else{
      element.parent().prepend(newElement);
    }
  }

  var dde = document.documentElement,
  matchingFunction = dde.matches ? 'matches' :
            dde.matchesSelector ? 'matchesSelector' :
            dde.webkitMatches ? 'webkitMatches' :
            dde.webkitMatchesSelector ? 'webkitMatchesSelector' :
            dde.msMatches ? 'msMatches' :
            dde.msMatchesSelector ? 'msMatchesSelector' :
            dde.mozMatches ? 'mozMatches' :
            dde.mozMatchesSelector ? 'mozMatchesSelector' : null;
  if(matchingFunction == null)
    throw 'This browser doesn\'t support the HTMLElement.matches method';

  function elementMatchesSelector(element, selector){
    if(element instanceof angular.element) element = element[0];
    if(matchingFunction !== null)
      return element[matchingFunction](selector);
  }

  var closestElement = angular.element.prototype.closest || function (selector){
    var el = this[0].parentNode;
    while(el !== document.documentElement && !el[matchingFunction](selector))
      el = el.parentNode;

    if(el[matchingFunction](selector))
      return angular.element(el);
    else
      return angular.element();
  };

  /*
    Simple implementation of jQuery's .add method
   */
  if(typeof angular.element.prototype.add !== 'function'){
    angular.element.prototype.add = function(elem){
      var i, res = angular.element();
      elem = angular.element(elem);
      for(i=0;i<this.length;i++){
        res.push(this[i]);
      }
      for(i=0;i<elem.length;i++){
        res.push(elem[i]);
      }
      return res;
    };
  }

})(window, window.angular);

angular.module('contentApp', ['ngSanitize', 'angular-sortable-view', 'smoothScroll', 'ngTouch'])

.config(['$locationProvider', function($locationProvider) {
  'use strict';
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
}])

.run(['$location', function($location) {
  'use strict';
  FastClick.attach(document.body);
  if ($location.path() != '/custom.html') {
    $location.path('');
  }
}])

.factory('dataObject', function(){
  'use strict';
  var content = {
    sections: [
      {
        section: "General",
        subsections: [
          {
            subsection: "Typography",
            content: "some typography content<br><iframe src='https://docs.google.com/presentation/d/1yTyEpqX3--enNQs5xWxl25ebEbmyrQnpsAmOlDahJZo/embed?start=false&loop=false&delayms=3000' frameborder='0' allowfullscreen='true' mozallowfullscreen='true' webkitallowfullscreen='true'></iframe>",
            notes: "Typography Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          },
          {
            subsection: "Colors",
            content: "<p>Lots of text about some things and some other things</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p><p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore</p>",
            notes: "Colors Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          }
        ]
      },
      {
        section: "Advertising",
        subsections: [
          {
            subsection: "Digital",
            content: "some digital ad content<br><iframe data-src='//docs.google.com/gview?url=https://storage.googleapis.com/doubleclick-prod/documents/Programmatic_Direct_Infographic.pdf&amp;embedded=true' allowfullscreen='' src='//docs.google.com/gview?url=https://storage.googleapis.com/doubleclick-prod/documents/Programmatic_Direct_Infographic.pdf&amp;embedded=true'></iframe>",
            notes: "Digital Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          },
          {
            subsection: "Print",
            content: "some print ad content<br><img src='https://storage.googleapis.com/doubleclick-prod/images/offset_comp_237030_1.95b375d5.rectangle-550x462.jpg'>",
            notes: "Print Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          },
          {
            subsection: "Email",
            content: "some email ad content<ul><li>Bullet points</li><li>Bullet points</li><li>Bullet points</li><li>Bullet points</li><li>Bullet points</li><li>Bullet points</li><li>Bullet points</li><li>Bullet points</li></ul><strong>Bold text is cool</strong>",
            notes: "Email Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          }
        ]
      },
      {
        section: "Sports",
        subsections: [
          {
            subsection: "Baseball",
            content: "some baseball content<br><iframe src='https://www.youtube.com/embed/6Joup252fR0' frameborder='0' allowfullscreen></iframe>",
            notes: "Baseball Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          },
          {
            subsection: "Basketball",
            content: "some basketball content<br><iframe src='https://www.youtube.com/embed/O1uxFRIdCWo' frameborder='0' allowfullscreen></iframe>",
            notes: "Baskeball Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          },
          {
            subsection: "Soccer",
            content: "some soccer content<br><iframe src='https://www.youtube.com/embed/mI2dDwWaNUY' frameborder='0' allowfullscreen></iframe>",
            notes: "Soccer Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          },
          {
            subsection: "Tennis",
            content: "some tennis content<br><iframe src='https://www.youtube.com/embed/WyJM9-7OvZo' frameborder='0' allowfullscreen></iframe>",
            notes: "Tennis Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          },
          {
            subsection: "Fishing",
            content: "some fishing content<br><iframe src='https://www.youtube.com/embed/tYwOaVcyacw' frameborder='0' allowfullscreen></iframe>",
            notes: "Fishing Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          },
          {
            subsection: "Football",
            content: "some football content<br><iframe src='https://www.youtube.com/embed/v-1MQ0Cnbhs' frameborder='0' allowfullscreen></iframe>",
            notes: "Football Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          }
        ]
      }
    ]
  };

  return content;
})

.controller('mainController', ['$scope', '$timeout', '$location', '$sce', 'dataObject', 'smoothScroll', function($scope, $timeout, $location, $sce, dataObject, smoothScroll) {
  'use strict';

  $scope.content = dataObject;
  $scope.primaryContent = [];
  $scope.custom = [];
  $scope.link = '';
  $scope.showTitle = true;
  $scope.customTitle = "Custom presentation";
  $scope.showExpanded = '';

  console.log($scope.content);

  // allow iframes and other html to be displayed
  $scope.trustAsHtml = $sce.trustAsHtml;

  // show section in the main content area
  $scope.showSections = function() {
    $scope.primaryContent = this;
    location.hash = "#";
    document.querySelector('.primary-content').scrollTop = 0;
    $scope.showMenu = false;
    $scope.showExpanded = '';
  };

  // show the parent section in the main content area and scroll down to subsection anchor
  $scope.showSubsection = function() {
    var me = this;
    $scope.primaryContent = this;
    $scope.showMenu = false;
    $scope.showExpanded = this.sub.subsection;

    // wait for menu to close and new content to load before smooth scrolling to subsection
    // setTimeout(function(){
    //   var element = document.getElementById(me.sub.subsection.toLowerCase());

    //   var options = {
    //       duration: 700,
    //       easing: 'easeInQuad',
    //       offset: 80,
    //       containerId: 'primary-content'
    //   }
    //   smoothScroll(element, options);
    // }, 300);
  };

  // show expanded view of card
  $scope.showDetails = function() {
    $scope.showExpanded = this.i.subsection;
  };

  // go to prev card
  $scope.goPrev = function() {
    $scope.showExpanded = this.$$prevSibling.i.subsection;
  };

  // go to next card
  $scope.goNext = function() {
    $scope.showExpanded = this.$$nextSibling.i.subsection;
  };

  // add an item to the custom objects array
  $scope.addToCustom = function() {
    $scope.custom.push(this);
  };

  // create a custom link from the items added to the custom array and show modal
  $scope.showLink = function() {
    $scope.link = 'http://' + location.host + '/custom.html?custom=';
    for (var i = 0; i < $scope.custom.length; i++) {
      $scope.link += $scope.custom[i].i.subsection + ',';
    }
    $scope.link = $scope.link.substring(0, $scope.link.length - 1);
    $scope.link += ('&title=' + $scope.customTitle.replace(/ /g,'-'));
    $scope.modalActive = true;
  };

  // remove an item from the custom array
  $scope.removeSection = function(item) {
    for (var n = 0; n < $scope.content.sections.length; n++) {
      for (var x = 0; x < $scope.content.sections[n].subsections.length; x++) {
        if ($scope.content.sections[n].subsections[x].subsection === item.i.subsection) {
          $scope.content.sections[n].subsections[x].disabled = false;
        }
      }
    }
    var index = $scope.custom.indexOf(item);
    $scope.custom.splice(index, 1);
  };

  $scope.saveCollection = function() {
    var newCollection = {};
    newCollection.title = $scope.customTitle;
    newCollection.slides = $scope.custom;
    newCollection.link = 'custom.html?custom=';
    for (var n = 0; n < $scope.custom.length; n++) {
      newCollection.link += ($scope.custom[n].i.subsection + ',');
    }
    newCollection.link += ('&title=' + $scope.customTitle.replace(/ /g,'-'));
    $scope.userCollections.push(newCollection);
    console.log('new', newCollection);
    console.log($scope.userCollections);
  };

  $scope.userCollections = [
    {
      title: 'Presentation 1',
      slides: [
        $scope.content.sections[0].subsections[0],
        $scope.content.sections[0].subsections[1],
        $scope.content.sections[1].subsections[1],
        $scope.content.sections[2].subsections[2]
      ],
      link: 'custom.html?custom=' + $scope.content.sections[0].subsections[0].subsection + ',' + $scope.content.sections[0].subsections[1] + ',' + $scope.content.sections[1].subsections[1] + ',' + $scope.content.sections[2].subsections[2] + '&title=Presentation-1'
    },
    {
      title: 'Custom 2',
      slides: [
        $scope.content.sections[2].subsections[2],
        $scope.content.sections[1].subsections[1],
        $scope.content.sections[2].subsections[3],
        $scope.content.sections[0].subsections[0]
      ],
      link: 'custom.html?custom=' + $scope.content.sections[2].subsections[2].subsection + ',' + $scope.content.sections[1].subsections[1] + ',' + $scope.content.sections[2].subsections[3] + ',' + $scope.content.sections[0].subsections[0] + '&title=Custom-2'
    }
  ];

}])

.controller('customController', ['$scope', '$location', '$sce', 'dataObject', function($scope, $location, $sce, dataObject) {
  'use strict';

  $scope.index = 1;
  $scope.fullscreenCounter = 0;
  $scope.content = dataObject;
  var subsections = [];
  var customContent = [];
  $scope.results = [];

  // set page title
  $scope.customTitle = "Custom presentation";
  $scope.customTitle = $location.search().title.replace(/-/g, ' ');

  // allow iframes and other html to be displayed
  $scope.trustAsHtml = $sce.trustAsHtml;

  function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
      if(array[i][attr] === value) {
          return i;
      }
    }
    return -1;
  }
  Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
  };

  // create new array of subsection objects from original set of content data
  for (var i = 0; i < $scope.content.sections.length; i++) {
    for (var x = 0; x < $scope.content.sections[i].subsections.length; x++) {
      subsections.push($scope.content.sections[i].subsections[x]);
    }
  }

  // create new array of values from query string
  var customSections = $location.search().custom.split(',');
  for (var n = 0; n < customSections.length; n++) {
    customContent.push({'subsection': customSections[n]});
  }

  // filter array of subsections and create new array with objects that match the query string
  subsections.filter(function( obj ) {
    for (var y = 0; y < customSections.length; y++) {
      if (obj.subsection == customSections[y]) {
        $scope.results.push(obj);
      }
    }
    // put results array in correct order
    for (var c = 0; c < $scope.results.length; c++) {
      $scope.results.move(c, findWithAttr(customContent, 'subsection', $scope.results[c].subsection));
    }
  });

  // go to previous slide
  $scope.goPrev = function() {
    $scope.index = $scope.index > 1 ? $scope.index - 1 : 1;
  };

  // go to next slide
  $scope.goNext = function() {
    $scope.index = $scope.index < $scope.results.length ? $scope.index + 1 : $scope.results.length;
  };

  // change slides when pressing left or right keys
  $scope.key = function($event){
    if ($event.keyCode == 39)
        $scope.goNext();
    else if ($event.keyCode == 37)
        $scope.goPrev();
  }

  // make presentation fullscreen
  $scope.requestFullScreen = function() {
    var element = document.body
    // Supports most browsers and their versions.
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

    if (requestMethod) { // Native full screen.
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
  };

  if (document.addEventListener) {
    document.addEventListener('webkitfullscreenchange', exitHandler, false);
    document.addEventListener('mozfullscreenchange', exitHandler, false);
    document.addEventListener('fullscreenchange', exitHandler, false);
    document.addEventListener('MSFullscreenChange', exitHandler, false);
  }

  // show and hide fullscreen icon depending on whether window is fullscreen or not
  function exitHandler() {
    if (document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement !== null) {
      $scope.fullscreenCounter += 1;
      if ($scope.fullscreenCounter % 2 === 0) {
        angular.element(document.querySelector('.fullscreen')).removeClass('ng-hide');
      } else {
        angular.element(document.querySelector('.fullscreen')).addClass('ng-hide');
      }
    }
  }

}]);
