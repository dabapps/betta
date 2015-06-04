'use strict';

window.define(['react', 'color', 'color-picker-values', 'color-palette', 'slider'], function (React, color, ColorPickerValues, ColorPalette, Slider) {

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
      }

      // Hex matches #af1 or #acb123
      if (value.match(/^#([a-f0-9][a-f0-9][a-f0-9])([a-f0-9][a-f0-9][a-f0-9])?\s*$/i)) {
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
      var self = this;
      var picker;

      if (this.state.active) {
        picker = React.createElement(
          'div',
          {
            className: 'picker'
          },
          React.createElement(
            'div',
            {
              className: 'palette'
            },
            React.createElement(
              ColorPalette,
              {
                point: self.state.point,
                onChange: self.setPoint,
                hsl: self.state.hsl,
                rgb: self.state.rgb,
                hex: self.state.hex
              }
            ),
            React.createElement(
              Slider,
              {
                className: 'hue-slider',
                value: this.state.hsl.h,
                orientation: 'vertical',
                onChange: this.setHue
              }
            )
          ),
          React.createElement(
            ColorPickerValues,
            {
              hsl: self.state.hsl,
              rgb: self.state.rgb,
              hex: self.state.hex
            }
          )
        );
      }

      return React.createElement(
        'div',
        {
          className: 'color-picker'
        },
        React.createElement(
          'div',
          {
            className: 'swatch',
            style: {
              backgroundColor: self.props.value || self.props.defaultValue
            },
            onClick: self.togglePicker
          }
        ),
        picker
      );
    }
  });

  return ColorPicker;

});
