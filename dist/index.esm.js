import { PureComponent } from 'react';

function isRangeVisible(_ref) {
  var lastRenderedStartIndex = _ref.lastRenderedStartIndex,
      lastRenderedStopIndex = _ref.lastRenderedStopIndex,
      startIndex = _ref.startIndex,
      stopIndex = _ref.stopIndex;

  return !(startIndex > lastRenderedStopIndex || stopIndex < lastRenderedStartIndex);
}

function scanForUnloadedRanges(_ref) {
  var isItemLoaded = _ref.isItemLoaded,
      itemCount = _ref.itemCount,
      minimumBatchSize = _ref.minimumBatchSize,
      startIndex = _ref.startIndex,
      stopIndex = _ref.stopIndex;

  var unloadedRanges = [];

  var rangeStartIndex = null;
  var rangeStopIndex = null;

  for (var _index = startIndex; _index <= stopIndex; _index++) {
    var loaded = isItemLoaded(_index);

    if (!loaded) {
      rangeStopIndex = _index;
      if (rangeStartIndex === null) {
        rangeStartIndex = _index;
      }
    } else if (rangeStopIndex !== null) {
      unloadedRanges.push([rangeStartIndex, rangeStopIndex]);

      rangeStartIndex = rangeStopIndex = null;
    }
  }

  // If :rangeStopIndex is not null it means we haven't ran out of unloaded rows.
  // Scan forward to try filling our :minimumBatchSize.
  if (rangeStopIndex !== null) {
    var potentialStopIndex = Math.min(Math.max(rangeStopIndex, rangeStartIndex + minimumBatchSize - 1), itemCount - 1);

    for (var _index2 = rangeStopIndex + 1; _index2 <= potentialStopIndex; _index2++) {
      if (!isItemLoaded(_index2)) {
        rangeStopIndex = _index2;
      } else {
        break;
      }
    }

    unloadedRanges.push([rangeStartIndex, rangeStopIndex]);
  }

  // Check to see if our first range ended prematurely.
  // In this case we should scan backwards to try filling our :minimumBatchSize.
  if (unloadedRanges.length) {
    var firstRange = unloadedRanges[0];

    while (firstRange[1] - firstRange[0] + 1 < minimumBatchSize && firstRange[0] > 0) {
      var _index3 = firstRange[0] - 1;

      if (!isItemLoaded(_index3)) {
        firstRange[0] = _index3;
      } else {
        break;
      }
    }
  }

  return unloadedRanges;
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var InfiniteLoader = function (_PureComponent) {
  inherits(InfiniteLoader, _PureComponent);

  function InfiniteLoader() {
    var _ref;

    var _temp, _this, _ret;

    classCallCheck(this, InfiniteLoader);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = possibleConstructorReturn(this, (_ref = InfiniteLoader.__proto__ || Object.getPrototypeOf(InfiniteLoader)).call.apply(_ref, [this].concat(args))), _this), _this._lastRenderedStartIndex = -1, _this._lastRenderedStopIndex = -1, _this._memoizedUnloadedRanges = [], _this._onItemsRendered = function (_ref2) {
      var visibleStartIndex = _ref2.visibleStartIndex,
          visibleStopIndex = _ref2.visibleStopIndex;

      if (process.env.NODE_ENV !== 'production') {
        if (!Number.isInteger(visibleStartIndex) || !Number.isInteger(visibleStopIndex)) {
          console.warn('Invalid onItemsRendered signature; please refer to InfiniteLoader documentation.');
        }

        if (typeof _this.props.loadMoreRows === 'function') {
          console.warn('InfiniteLoader "loadMoreRows" prop has been renamed to "loadMoreItems".');
        }
      }

      _this._lastRenderedStartIndex = visibleStartIndex;
      _this._lastRenderedStopIndex = visibleStopIndex;
      _this.props.onScrollHandler(visibleStartIndex, visibleStopIndex);

      _this._ensureRowsLoaded(visibleStartIndex, visibleStopIndex);
    }, _this._setRef = function (listRef) {
      _this._listRef = listRef;
    }, _temp), possibleConstructorReturn(_this, _ret);
  }

  createClass(InfiniteLoader, [{
    key: 'resetloadMoreItemsCache',
    value: function resetloadMoreItemsCache() {
      var autoReload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      this._memoizedUnloadedRanges = [];

      if (autoReload) {
        this._ensureRowsLoaded(this._lastRenderedStartIndex, this._lastRenderedStopIndex);
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (process.env.NODE_ENV !== 'production') {
        if (this._listRef == null) {
          console.warn('Invalid list ref; please refer to InfiniteLoader documentation.');
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var children = this.props.children;


      return children({
        onItemsRendered: this._onItemsRendered,
        ref: this._setRef
      });
    }
  }, {
    key: '_ensureRowsLoaded',
    value: function _ensureRowsLoaded(startIndex, stopIndex) {
      var _props = this.props,
          isItemLoaded = _props.isItemLoaded,
          itemCount = _props.itemCount,
          _props$minimumBatchSi = _props.minimumBatchSize,
          minimumBatchSize = _props$minimumBatchSi === undefined ? 10 : _props$minimumBatchSi,
          _props$threshold = _props.threshold,
          threshold = _props$threshold === undefined ? 15 : _props$threshold;


      var unloadedRanges = scanForUnloadedRanges({
        isItemLoaded: isItemLoaded,
        itemCount: itemCount,
        minimumBatchSize: minimumBatchSize,
        startIndex: Math.max(0, startIndex - threshold),
        stopIndex: Math.min(itemCount - 1, stopIndex + threshold)
      });

      // Avoid calling load-rows unless range has changed.
      // This shouldn't be strictly necsesary, but is maybe nice to do.
      if (this._memoizedUnloadedRanges.length !== unloadedRanges.length || this._memoizedUnloadedRanges.find(function (_ref3, index) {
        var _ref4 = slicedToArray(_ref3, 2),
            startIndex = _ref4[0],
            stopIndex = _ref4[1];

        return unloadedRanges[index][0] !== startIndex || unloadedRanges[index][1] !== stopIndex;
      })) {
        this._memoizedUnloadedRanges = unloadedRanges;
        this._loadUnloadedRanges(unloadedRanges);
      }
    }
  }, {
    key: '_loadUnloadedRanges',
    value: function _loadUnloadedRanges(unloadedRanges) {
      var _this2 = this;

      // loadMoreRows was renamed to loadMoreItems in v1.0.3; will be removed in v2.0
      var loadMoreItems = this.props.loadMoreItems || this.props.loadMoreRows;

      unloadedRanges.forEach(function (_ref5) {
        var _ref6 = slicedToArray(_ref5, 2),
            startIndex = _ref6[0],
            stopIndex = _ref6[1];

        var promise = loadMoreItems(startIndex, stopIndex);
        if (promise != null) {
          promise.then(function () {
            // Refresh the visible rows if any of them have just been loaded.
            // Otherwise they will remain in their unloaded visual state.
            if (isRangeVisible({
              lastRenderedStartIndex: _this2._lastRenderedStartIndex,
              lastRenderedStopIndex: _this2._lastRenderedStopIndex,
              startIndex: startIndex,
              stopIndex: stopIndex
            })) {
              // Handle an unmount while promises are still in flight.
              if (_this2._listRef == null) {
                return;
              }

              // Resize cached row sizes for VariableSizeList,
              // otherwise just re-render the list.
              if (typeof _this2._listRef.resetAfterIndex === 'function') {
                _this2._listRef.resetAfterIndex(startIndex, true);
              } else {
                // HACK reset temporarily cached item styles to force PureComponent to re-render.
                // This is pretty gross, but I'm okay with it for now.
                // Don't judge me.
                if (typeof _this2._listRef._getItemStyleCache === 'function') {
                  _this2._listRef._getItemStyleCache(-1);
                }
                _this2._listRef.forceUpdate();
              }
            }
          });
        }
      });
    }
  }]);
  return InfiniteLoader;
}(PureComponent);

export default InfiniteLoader;
