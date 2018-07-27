(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.Watermark = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var config = {
    text: 'Hello world',
    font: '16px serif',
    opacity: 0.6,
    density: 1,
    rotate: -1 / 6 * Math.PI,
    z_index: 2018,
    color: 'rgba(151,168,190)',
    yOffset: 3
  };

  var Watermark = function () {
    function Watermark() {
      var _this = this;

      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : config,
          _ref$text = _ref.text,
          text = _ref$text === undefined ? config.text : _ref$text,
          _ref$opacity = _ref.opacity,
          opacity = _ref$opacity === undefined ? config.opacity : _ref$opacity,
          _ref$density = _ref.density,
          density = _ref$density === undefined ? config.density : _ref$density,
          _ref$rotate = _ref.rotate,
          rotate = _ref$rotate === undefined ? config.rotate : _ref$rotate,
          _ref$z_index = _ref.z_index,
          z_index = _ref$z_index === undefined ? config.z_index : _ref$z_index,
          _ref$font = _ref.font,
          font = _ref$font === undefined ? config.font : _ref$font,
          _ref$color = _ref.color,
          color = _ref$color === undefined ? config.color : _ref$color;

      _classCallCheck(this, Watermark);

      this.text = text;
      this.density = density;
      this.opacity = opacity;
      this.rotate = rotate;
      this.z_index = z_index;
      this.font = font;
      this.color = color;

      this._setStamp = function () {
        var canvasEl = document.createElement('canvas');
        var ctx = canvasEl.getContext('2d');

        ctx.fillStyle = _this.color;
        ctx.font = _this.font;
        var fontSize = _this.font.replace(/(\d+)(?=px).*/, '$1');
        var text = ctx.measureText(_this.text);
        var txtLen = text.width + fontSize * _this.yOffset;

        canvasEl.width = txtLen * 2;
        canvasEl.height = txtLen * 2;

        ctx.translate(txtLen, txtLen);
        ctx.rotate(_this.rotate);
        ctx.fillStyle = _this.color;
        ctx.font = _this.font;
        ctx.fillText(_this.text, fontSize * _this.yOffset, 0);

        return canvasEl;
      };

      this._compositeStamp = function () {
        var stamp = _this._setStamp();
        var stampLen = stamp.getAttribute('width') / 2;

        var canvasEl = document.createElement('canvas');
        //保证水印可以完全展示
        var len = 200 * _this.density > stampLen ? 200 * _this.density : stampLen;
        canvasEl.width = len * 2;
        canvasEl.height = len * 2;
        var ctx = canvasEl.getContext('2d');
        ctx.translate(len, len);

        var sinValueByRotate = Math.sin(_this.rotate);
        var cosValueByRotate = Math.cos(_this.rotate);

        //  上左
        if (sinValueByRotate <= 0 && sinValueByRotate > -1 && cosValueByRotate > 0 && cosValueByRotate <= 1) {
          ctx.drawImage(stamp, stampLen, 0, stampLen, stampLen, 0, 0, stampLen, stampLen);
          ctx.drawImage(stamp, stampLen, 0, stampLen, stampLen, -len, -len, stampLen, stampLen);
        }
        // 上右
        if (sinValueByRotate < 0 && sinValueByRotate >= -1 && cosValueByRotate <= 0 && cosValueByRotate < 1) {
          ctx.drawImage(stamp, 0, 0, stampLen, stampLen, 0, 0, stampLen, stampLen);
          ctx.drawImage(stamp, 0, 0, stampLen, stampLen, -len, -len, stampLen, stampLen);
        }
        // 下右
        if (sinValueByRotate >= 0 && sinValueByRotate < 1 && cosValueByRotate < 0 && cosValueByRotate >= -1) {
          ctx.drawImage(stamp, 0, stampLen, stampLen, stampLen, 0, 0, stampLen, stampLen);
          ctx.drawImage(stamp, 0, stampLen, stampLen, stampLen, -len, -len, stampLen, stampLen);
        }
        // 下左
        if (sinValueByRotate > 0 && sinValueByRotate <= 1 && cosValueByRotate >= 0 && cosValueByRotate < 1) {
          ctx.drawImage(stamp, stampLen, stampLen, stampLen, stampLen, 0, 0, stampLen, stampLen);
          ctx.drawImage(stamp, stampLen, stampLen, stampLen, stampLen, -len, -len, stampLen, stampLen);
        }
        return canvasEl.toDataURL();
      };
    }

    Watermark.prototype.embed = function embed(el) {
      if (!document.querySelector(el)) {
        console.error('el is ' + document.querySelector(el));
        return;
      }
      var contain_el = document.querySelector(el);

      var watermark_img = this._compositeStamp();

      var watermark_div = document.createElement('div');
      watermark_div.setAttribute('style', '\n      position:absolute;\n      width: 100%;\n      height: 100%;\n      background-image:url(\'' + watermark_img + '\');\n      opacity:0.6;\n      z-index:' + this.z_index + ';\n      pointer-events: none;\n    ');
      contain_el.style.position = 'relative';
      contain_el.insertBefore(watermark_div, contain_el.firstChild);
    };

    return Watermark;
  }();

  exports.default = Watermark;
  module.exports = exports['default'];
});