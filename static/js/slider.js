'use strict';

window.define(['react'], function (React) {

  var Slider = React.createClass({
    addListeners: function () {
      window.addEventListener('mousemove', this.mouseMove);
      window.addEventListener('mouseup', this.mouseUp);
    },

    removeListeners: function () {
      window.removeEventListener('mousemove', this.mouseMove);
      window.removeEventListener('mouseup', this.mouseUp);
    },

    getValue: function (event) {
      var box = this.getDOMNode().getBoundingClientRect();

      var xInPalette = Math.min(Math.max(event.clientX - box.left, 0), box.width);
      var yInPalette = Math.min(Math.max(event.clientY - box.top, 0), box.height);

      if (this.props.orientation === 'vertical') {
        return Math.min(Math.max((yInPalette / (box.height / 100)) / 100, 0), 100);
      }

      return Math.min(Math.max((xInPalette / (box.width / 100)) / 100, 0), 100);
    },

    mouseDown: function (event) {
      event.preventDefault();
      var point = this.getValue(event);

      this.props.onChange(point);

      this.addListeners();
    },

    mouseMove: function (event) {
      var point = this.getValue(event);

      this.props.onChange(point);
    },

    mouseUp: function () {
      this.removeListeners();
    },

    componentWillUnmount: function () {
      this.removeListeners();
    },

    render: function () {
      return React.createElement(
        'div',
        {
          className: this.props.className,
          onMouseDown: this.mouseDown
        },
        React.createElement(
          'div',
          {
            className: 'handle',
            style: {
              top: (this.props.value * 100) + '%'
            }
          }
        )
      );
    }
  });

  return Slider;

});
