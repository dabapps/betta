'use strict';

var React = require('react');
var color = require('../utils/color');

var MAX_SIZE = 50;
var MIN_SIZE = 10;

var ColorPalette = React.createClass({
  getInitialState: function () {
    return {
      dragging: false
    };
  },

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

  onMouseDown: function (event) {
    event.preventDefault();
    this.setState({
      dragging: true
    });
    var point = this.getPoint(event);

    this.props.onChange(point);

    this.addListeners();
  },

  onMouseMove: function (event) {
    var point = this.getPoint(event);

    this.props.onChange(point);
  },

  onMouseUp: function () {
    this.setState({
      dragging: false
    });
    this.removeListeners();
  },

  render: function () {
    var backgroundColor = color.HSLToRGB(this.props.hsl.h, 1, 0.5);
    backgroundColor = color.RGBToHex(backgroundColor.r, backgroundColor.g, backgroundColor.b);

    var dropShadow = this.state.dragging ?
      '0 3px 6px 0 rgba(0, 0, 0, 0.5)' :
      '0 0 0 0 rgba(0, 0, 0, 0)';

    return (
      <div
        className="background"
        onMouseDown={this.onMouseDown}
        style={{backgroundColor: backgroundColor}}
      >
          <div className="gradient grey" />
          <div className="gradient white" />
          <div className="gradient black" />
          <div
            className="point"
            style={{
              top: this.props.point.y * 100 + '%',
              left: this.props.point.x * 100 + '%',
              backgroundColor: this.props.hex,
              width: this.state.dragging ? MAX_SIZE : MIN_SIZE,
              height: this.state.dragging ? MAX_SIZE : MIN_SIZE,
              marginTop: this.state.dragging ? -MAX_SIZE / 2 : -MIN_SIZE / 2,
              marginLeft: this.state.dragging ? -MAX_SIZE / 2 : -MIN_SIZE / 2,
              boxShadow: dropShadow}}
          />
      </div>
    );
  }
});

module.exports = ColorPalette;
