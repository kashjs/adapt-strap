/**
 *
 * https://github.com/fatlinesofcode/ngDraggable
 */
angular.module("adaptv.adaptStrap.draggable", [])
        .directive('adDrag', ['$rootScope', '$parse', function ($rootScope, $parse) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    scope.value = attrs.adDrag;

                    var offset, _mx, _my, _tx, _ty;
                    var _hasTouch = ('ontouchstart' in document.documentElement);
                    var _pressEvents = 'touchstart mousedown';
                    var _moveEvents = 'touchmove mousemove';
                    var _releaseEvents = 'touchend mouseup';

                    var $document = $(document);
                    var $window = $(window);
                    var _data = null;

                    var _dragEnabled = false;

                    var _pressTimer = null;

                   
                    var onDragStartCallback = $parse(attrs.adDragBegin) || null;
                    var onDragEndCallback = $parse(attrs.adDragEnd) || null;
 
                    var initialize = function () {
                        element.attr('draggable', 'false'); // prevent native drag
                        toggleListeners(true);
                    };


                    var toggleListeners = function (enable) {
                        // remove listeners

                        if (!enable) {
                          return;
                        }
                        // add listeners.

                        scope.$on('$destroy', onDestroy);
                        attrs.$observe("adDrag", onEnableChange);
                        scope.$watch(attrs.adDragData, onDragDataChange);
                        
                        scope.$on('draggable:start', onDragStart);
                        scope.$on('draggable:end', onDragEnd);;

                        element.on(_pressEvents, onpress);
                        if(! _hasTouch){
                            element.on('mousedown', function() { 
                                return false;
                            }); // prevent native drag
                        }
                    };

                    function onDragStart(evt, o) {
                      if (o.element == element && o.callback) {
                        o.callback(evt);
                      }
                    };
                    function onDragEnd(evt, o) {
                      if (o.element == element && o.callback) {
                        o.callback(evt);
                      }
                    };
                    var onDestroy = function (enable) {
                        toggleListeners(false);
                    };
                    var onDragDataChange = function (newVal, oldVal) {
                        _data = newVal;
                    };
                    var onEnableChange = function (newVal, oldVal) {
                        _dragEnabled = scope.$eval(newVal);

                    };
                    /*
                     * When the element is clicked start the drag behaviour
                     * On touch devices as a small delay so as not to prevent native window scrolling
                     */
                    var onpress = function(evt) {
                        if (!_dragEnabled) {
                          return;
                        }

                        if (_hasTouch) {
                          cancelPress();
                          _pressTimer = setTimeout(function() {
                            cancelPress();
                            onLongPress(evt);
                          }, 100);

                          $document.on(_moveEvents, cancelPress);
                          $document.on(_releaseEvents, cancelPress);
                        } else {
                          onLongPress(evt);
                        }

                    }
                    /*
                     * Preserve the width of the element during drag
                     */
                    var persistElementWidth = function() {
                      element.children()
                        .each(function() {
                          $(this).width($(this).width());
                        });
                    };


                    var cancelPress = function() {
                        clearTimeout(_pressTimer);
                        $document.off(_moveEvents, cancelPress);
                        $document.off(_releaseEvents, cancelPress);
                    };

                    var onLongPress = function(evt) {
                        if (! _dragEnabled) {
                          return;
                        }
                        evt.preventDefault();
                        offset = element.offset();
                        
                        element.addClass('dragging');

                        _mx = (evt.pageX || evt.originalEvent.touches[0].pageX);
                        _my = (evt.pageY || evt.originalEvent.touches[0].pageY);
                        
                        _tx = _mx - offset.left - $window.scrollLeft()
                        _ty = _my - offset.top - $window.scrollTop();

                        persistElementWidth();
                        moveElement(_tx, _ty);
                        
                        $document.on(_moveEvents, onmove);
                        $document.on(_releaseEvents, onrelease);

                        $rootScope.$broadcast('draggable:start', { 
                          x: _mx,
                          y: _my, 
                          tx: _tx, 
                          ty: _ty, 
                          element: element, 
                          data: _data,
                          callback: onDragBegin
                        });
                    };

                    var onmove = function(evt) {
                        if (! _dragEnabled) {
                          return;
                        }
                        evt.preventDefault();

                        var _cx = (evt.pageX || evt.originalEvent.touches[0].pageX);
                        var _cy = (evt.pageY || evt.originalEvent.touches[0].pageY);
                        
                        _tx = (_cx - _mx) + offset.left - $window.scrollLeft()
                        _ty = (_cy - _my) + offset.top - $window.scrollTop();
 
                        moveElement(_tx, _ty);

                        $rootScope.$broadcast('draggable:move', {
                          x: _mx, 
                          y: _my, 
                          tx: _tx, 
                          ty:_ty, 
                          element: element, 
                          data: _data
                        });

                    };

                    var onrelease = function(evt) {
                        if (! _dragEnabled) {
                          return;
                        }
                        evt.preventDefault();
                        $rootScope.$broadcast('draggable:end', {
                          x: _mx, 
                          y: _my,
                          tx: _tx, 
                          ty: _ty, 
                          element: element, 
                          data: _data, 
                          callback: onDragComplete
                        });

                        element.removeClass('dragging');
                        reset();
                        $document.off(_moveEvents, onmove);
                        $document.off(_releaseEvents, onrelease);

                    };
                    
                    // Callbacks
                    var onDragBegin = function(evt) {
                      if (!onDragStartCallback) {
                        return;
                      }
                      scope.$apply(function() {
                        onDragStartCallback(scope, {
                          $data: _data,
                          $dragElement: element,
                          $event: evt
                        }); 
                      });
                    };

                    var onDragComplete = function(evt) {
                      if (!onDragEndCallback) {
                        return;
                      }
                      scope.$apply(function () {
                        onDragEndCallback(scope, {
                          $data: _data,
                          $dragElement: element,
                          $event: evt
                        });
                      });
                    };

                    var reset = function() {
                        element.css({ 
                          left: '',
                          top: '', 
                          position:'', 
                          'z-index': ''
                        });
                    };

                    var moveElement = function(x, y) {
                        element.css({
                          left: x,
                          top: y, 
                          position: 'fixed', 
                          'z-index': 99999
                        });
                    };

                    initialize();
                }
            }
        }])
        .directive('adDrop', ['$rootScope', '$parse', '$timeout', function ($rootScope, $parse, $timeout) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    scope.value = attrs.adDrop;

                    var _dropEnabled = false;
                    var elem = null;

                    var $window = $(window);

                    var onDropCallback = $parse(attrs.adDropEnd);
                    var onDropOverCallback = $parse(attrs.adDropOver);

                    var initialize = function () {
                        toggleListeners(true);
                    };


                    var toggleListeners = function (enable) {
                        // remove listeners

                        if (!enable) {
                          return;
                        }
                        // add listeners.
                        attrs.$observe("adDrop", onEnableChange);
                        scope.$on('$destroy', onDestroy);
                        //scope.$watch(attrs.uiDraggable, onDraggableChange);
                        scope.$on('draggable:move', onDragMove);
                        scope.$on('draggable:end', onDragEnd);
                        scope.$on('draggable:change', onDropChange);
                    };
                    var onDestroy = function (enable) {
                        toggleListeners(false);
                    };

                    var onEnableChange = function (newVal, oldVal) {
                        _dropEnabled = scope.$eval(newVal);
                    };

                    var onDropChange = function(evt , obj) {
                      if (elem !== obj.el) {
                        elem = null;
                      }
                    };

                    var onDragMove = function(evt, obj) {
                        if (!_dropEnabled) {
                          return;
                        }
                        // If the dropElement and the tag element are the same
                        if (element == obj.element) {
                          return;
                        }

                        var el = getCurrentDropElement(obj.tx, obj.ty, obj.element);

                        if (el !== null) {
                          elem = el;
                          scope.$apply(function() {
                            onDropOverCallback(scope, { 
                              $data: obj.data, 
                              $dragElement: obj.element,
                              $dropElement: elem,
                              $event: evt 
                            });
                          });

                          $rootScope.$broadcast('draggable:change', {
                            el: elem 
                          });
                        }
                    };
 
                    var onDragEnd = function(evt, obj) {
                        if (!_dropEnabled) { 
                          return;
                        }

                        if (elem) {
                          // call the adDrop element callback
                          scope.$apply(function () {
                            onDropCallback(scope, { 
                              $data: obj.data,
                              $dragElement: obj.element,
                              $dropElement: elem,
                              $event: evt
                            });
                          });
                        }
                    };

                    var getCurrentDropElement = function (x, y, dragEl) { 
                      var bounds = element.offset();
                      var vthold = Math.floor(element.outerHeight() / 3);
                      var hthold = Math.floor(element.outerWidth() / 4);
                      var xw, yh;

                      x = x + $window.scrollLeft();
                      y = y + $window.scrollTop();
                      xw = x + dragEl.outerWidth(); //xw => x + drag element width
                      yh = y + dragEl.outerHeight();

                      return ((y >= (bounds.top + vthold) && y <= (bounds.top + element.outerHeight() - vthold)) 
                          && (x >= (bounds.left) && x <= (bounds.left + element.outerWidth()))) || ((yh >= (bounds.top + vthold) && yh <= (bounds.top + element.outerHeight() - vthold)) 
                            && (x >= (bounds.left) && x <= (bounds.left + element.outerWidth()))) ? element : null;
                    };
                    initialize();
                }
            }
        }]);

