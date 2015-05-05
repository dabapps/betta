'use strict';

window.define(['react', 'color', 'color-picker-values', 'color-palette'], function (React, color, ColorPickerValues, ColorPalette) {

  var ColorPicker = React.createClass({
    setPoint: function (point) {
      var hsl = this.state.hsl;
      hsl.s = Math.round(point.x * 100) / 100;
      hsl.l = Math.round((1 - point.y) * 100) / 100;

      var rgb = color.HSLToRGB(hsl.h, hsl.s, hsl.l);
      var hex = color.RGBToHex(rgb.r, rgb.g, rgb.b);

      this.setState({
        point: point,
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
