'use strict';

var React = require('react');

var Slider = React.createClass({
  componentWillUnmount: function () {
    this.removeListeners();
  },

  addListeners: function () {
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  },

  removeListeners: function () {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
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

  onMouseDown: function (event) {
    event.preventDefault();
    var point = this.getValue(event);

    this.props.onChange(point);

    this.addListeners();
  },

  onMouseMove: function (event) {
    var point = this.getValue(event);

    this.props.onChange(point);
  },

  onMouseUp: function () {
    this.removeListeners();
  },

  render: function () {
    return (
      <div
        className={this.props.className}
        onMouseDown={this.onMouseDown}
      >
        <div
          className="handle"
          style={{
            top: (this.props.value * 100) + '%'
          }}
        />
      </div>
    );
  }
});

module.exports = Slider;
