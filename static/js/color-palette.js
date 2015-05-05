'use strict';

window.define(['react', 'color'], function (React, color) {

  var ColorPalette = React.createClass({
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

      this.props.onChange(point);

      this.addListeners();
    },

    mouseMove: function (event) {
      var point = this.getPoint(event);

      this.props.onChange(point);
    },

    mouseUp: function () {
      this.removeListeners();
    },

    componentWillUnmount: function () {
      this.removeListeners();
    },

    render: function () {
      var self = this;

      var backgroundColor = color.HSLToRGB(self.props.hsl.h, 1, 0.5);
      backgroundColor = color.RGBToHex(backgroundColor.r, backgroundColor.g, backgroundColor.b);

      return React.createElement(
        'div',
        {
          className: 'background',
          onMouseDown: self.mouseDown,
          style: {
            backgroundColor: backgroundColor
          }
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
              border: '1px solid ' + (self.props.point.y >= 0.5 ? '#ccc' : '#333'),
              backgroundColor: self.props.hex
            }
          }
        )
      );
    }
  });

  return ColorPalette;

});
