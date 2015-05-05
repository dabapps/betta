'use strict';

window.define(['react', 'color'], function (React, color) {

  var Values = React.createClass({
    render: function () {
      var self = this;

      return React.createElement(
        'div',
        {
          className: 'row'
        },
        React.createElement(
          'div',
          {
            className: 'col-xs-12'
          },
          React.createElement(
            'code',
            null,
            'hsl(' + [self.props.hsl.h, Math.round(self.props.hsl.s * 100) + '%', Math.round(self.props.hsl.l * 100) + '%'].join(', ') + ')'
          )
        ),
        React.createElement(
          'div',
          {
            className: 'col-xs-12'
          },
          React.createElement(
            'code',
            null,
            'rgb(' + [self.props.rgb.r, self.props.rgb.g, self.props.rgb.b].join(', ') + ')'
          )
        ),
        React.createElement(
          'div',
          {
            className: 'col-xs-12'
          },
          React.createElement(
            'code',
            null,
            self.props.hex
          )
        )
      );
    }
  });

  var Palette = React.createClass({
    addListeners: function () {
      window.addEventListener('mousemove', this.mouseMove);
      window.addEventListener('mouseup', this.mouseUp);
    },

    removeListeners: function () {
      window.removeEventListener('mousemove', this.mouseMove);
      window.removeEventListener('mouseup', this.mouseUp);
    },

    getPoint: function (event) {
      var box = this.getDOMNode().getBoundingClientRect();

      var xInPalette = Math.min(Math.max(event.clientX - box.left, 0), box.width);
      var yInPalette = Math.min(Math.max(event.clientY - box.top, 0), box.height);

      var point = {
        x: Math.min(Math.max((xInPalette / (box.width / 100)) / 100, 0), 100),
        y: Math.min(Math.max((yInPalette / (box.height / 100)) / 100, 0), 100)
      };

      return point;
    },

    mouseDown: function (event) {
      event.preventDefault();
      var point = this.getPoint(event);

      this.props.setPoint(point);

      this.addListeners();
    },

    mouseMove: function (event) {
      var point = this.getPoint(event);

      this.props.setPoint(point);
    },

    mouseUp: function () {
      this.removeListeners();
    },

    componentWillUnmount: function () {
      this.removeListeners();
    },

    render: function () {
      var self = this;

      return React.createElement(
        'div',
        {
          className: 'background',
          onMouseDown: self.mouseDown
        },
        React.createElement(
          'div',
          {
            className: 'gradient grey'
          }
        ),
        React.createElement(
          'div',
          {
            className: 'gradient white'
          }
        ),
        React.createElement(
          'div',
          {
            className: 'gradient black'
          }
        ),
        React.createElement(
          'div',
          {
            className: 'point',
            style: {
              top: self.props.point.y * 100 + '%',
              left: self.props.point.x * 100 + '%',
              border: '1px solid ' + (self.props.point.y >= 50 ? '#ccc' : '#333')
            }
          }
        )
      );
    }
  });

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
              Palette,
              {
                point: self.state.point,
                setPoint: self.setPoint
              }
            )
          ),
          React.createElement(
            Values,
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
