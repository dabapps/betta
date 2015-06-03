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

    getInitialState: function () {
      return {
        active: false,
        point: {
          x: 0,
          y: 0
        },
        hsl: {
          h: 0,
          s: 0,
          l: 1
        },
        rgb: {
          r: 255,
          g: 255,
          b: 255
        },
        hex: '#ffffff'
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
