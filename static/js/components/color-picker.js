'use strict';

var React = require('react');
var color = require('../utils/color');
var ColorPickerValues = require('./color-picker-values');
var ColorPalette = require('./color-palette');
var Slider = require('./slider');

var ColorPicker = React.createClass({
  getHSL: function (h, s, l) {
    var hsl = this.state.hsl;
    if (typeof h !== 'undefined') {
      hsl.h = h;
    }
    if (typeof s !== 'undefined') {
      hsl.s = Math.round(s * 100) / 100;
    }
    if (typeof l !== 'undefined') {
      hsl.l = Math.round((1 - l) * 100) / 100;
    }

    return hsl;
  },

  setPoint: function (point) {
    var hsl = this.getHSL(undefined, point.x, point.y);
    var rgb = color.HSLToRGB(hsl.h, hsl.s, hsl.l);
    var hex = color.RGBToHex(rgb.r, rgb.g, rgb.b);

    this.setState({
      point: point,
      hsl: hsl,
      rgb: rgb,
      hex: hex
    });
  },

  setHue: function (h) {
    var hsl = this.getHSL(h);
    var rgb = color.HSLToRGB(hsl.h, hsl.s, hsl.l);
    var hex = color.RGBToHex(rgb.r, rgb.g, rgb.b);

    this.setState({
      hsl: hsl,
      rgb: rgb,
      hex: hex
    });
  },

  togglePicker: function () {
    this.setState({
      active: !this.state.active
    });
  },

  HSLInput: function (value) {
    var content = /hsla?\((.+?)\)/i.exec(value)[1];
    var hslValues = content.split(',');
    if (hslValues.length < 3) {
      return false;
    }
    if (hslValues[1].indexOf('%') < 0 || hslValues[2].indexOf('%') < 0) {
      return false;
    }
    var hsl = {
      h: parseInt(hslValues[0]) / 360,
      s: parseInt(hslValues[1]) / 100,
      l: parseInt(hslValues[2]) / 100
    };

    if (isNaN(hsl.h) || isNaN(hsl.s) || isNaN(hsl.l) ||
      hsl.h < 0 || hsl.h > 1 ||
      hsl.s < 0 || hsl.s > 1 ||
      hsl.l < 0 || hsl.l > 1) {
      return false;
    }

    var rgb = color.HSLToRGB(hsl.h, hsl.s, hsl.l);

    return {
      hsl: hsl,
      rgb: rgb,
      hex: color.RGBToHex(rgb.r, rgb.g, rgb.b)
    };
  },

  RGBInput: function (value) {
    var content = /rgba?\((.+?)\)/i.exec(value)[1];
    var rgbValues = content.split(',');
    if (rgbValues.length < 3) {
      return false;
    }
    var rgb = {
      r: parseInt(rgbValues[0]),
      g: parseInt(rgbValues[1]),
      b: parseInt(rgbValues[2])
    };

    if (isNaN(rgb.r) || isNaN(rgb.g) || isNaN(rgb.b) ||
      rgb.r < 0 || rgb.r > 255 ||
      rgb.g < 0 || rgb.g > 255 ||
      rgb.b < 0 || rgb.b > 255) {
      return false;
    }

    var hsl = color.RGBToHSL(rgb.r, rgb.g, rgb.b);

    return {
      hsl: {
        h: hsl.h / 360,
        s: hsl.s / 100,
        l: hsl.l / 100
      },
      rgb: rgb,
      hex: color.RGBToHex(rgb.r, rgb.g, rgb.b)
    };
  },

  HexInput: function (value) {
    var content = value.replace(/^#/i, '').replace(/\s+?$/i, '');
    if (content.length !== 3 && content.length !== 6) {
      return false;
    }
    var rgb = color.HexToRGB(content);
    var hsl = color.RGBToHSL(rgb.r, rgb.g, rgb.b);

    if (content.length === 6 &&
      content[0] === content[1] &&
      content[2] === content[3] &&
      content[4] === content[5]) {
      content = [content[0], content[2], content[4]].join('');
    }

    return {
      hsl: {
        h: hsl.h / 360,
        s: hsl.s / 100,
        l: hsl.l / 100
      },
      rgb: rgb,
      hex: '#'.concat(content)
    };
  },

  getColors: function (value) {
    if (!value) {
      return false;
    }

    if (typeof value !== 'string') {
      value = value.toString();
    }

    // Remove leading white space
    value = value.replace(/^\s+/i, '');

    // HSL matches hsl(anything) or hsla(anything)
    if (value.match(/^hsla?\(.+?\)/i)) {
      return this.HSLInput(value);
    }

    // RGB matches rgb(anything) or rgba(anything)
    if (value.match(/^rgba?\(.+?\)/i)) {
      return this.RGBInput(value);
    }

    // Hex matches #af1 or #acb123
    if (value.match(/^#([a-f0-9][a-f0-9][a-f0-9])([a-f0-9][a-f0-9][a-f0-9])?\s*$/i)) {
      return this.HexInput(value);
    }

    return false;
  },

  componentWillReceiveProps: function (nextProps) {
    if (this.props.value !== nextProps.value) {
      var value = nextProps.value || nextProps.defaultValue;
      var colors = this.getColors(value);

      if (colors) {
        this.setState({
          point: {
            x: colors.hsl.s,
            y: 1 - colors.hsl.l
          },
          hsl: colors.hsl,
          rgb: colors.rgb,
          hex: colors.hex
        });
      }
    }
  },

  getInitialState: function () {
    var value = this.props.value || this.props.defaultValue;
    var colors = this.getColors(value);

    return {
      active: false,
      point: {
        x: colors ? colors.hsl.s : 0,
        y: colors ? 1 - colors.hsl.l : 0
      },
      hsl: {
        h: colors ? colors.hsl.h : 0,
        s: colors ? colors.hsl.s : 0,
        l: colors ? colors.hsl.l : 1
      },
      rgb: {
        r: colors ? colors.rgb.r : 255,
        g: colors ? colors.rgb.g : 255,
        b: colors ? colors.rgb.b : 255
      },
      hex: colors ? colors.hex : '#ffffff'
    };
  },

  render: function () {
    var picker;

    if (this.state.active) {
      picker = (
        <div className="picker">
          <div className="palette">
            <ColorPalette
              point={this.state.point}
              onChange={this.setPoint}
              hsl={this.state.hsl}
              rgb={this.state.rgb}
              hex={this.state.hex}
            />
            <Slider
              className="hue-slider"
              value={this.state.hsl.h}
              orientation="vertical"
              onChange={this.setHue}
            />
          </div>
          <ColorPickerValues
            hsl={this.state.hsl}
            rgb={this.state.rgb}
            hex={this.state.hex}
            setValue={this.props.setValue}
            togglePicker={this.togglePicker}
          />
        </div>
      );
    }

    return (
      <div className="color-picker">
        <div
          className="swatch"
          style={{backgroundColor: this.props.value || this.props.defaultValue}}
          onClick={this.togglePicker}
        />
        {picker}
      </div>
    );
  }
});

module.exports = ColorPicker;
