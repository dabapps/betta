'use strict';

var React = require('react');
var VariableStore = require('./stores/variable-store');

var ColorPickerValues = React.createClass({
  readableHSL: function () {
    var self = this;

    return 'hsl('.concat(
      [
        Math.round(self.props.hsl.h * 360),
        Math.round(self.props.hsl.s * 100).toString().concat('%'),
        Math.round(self.props.hsl.l * 100).toString().concat('%')
      ]
      .join(', ')
    ).concat(')');
  },

  readableRGB: function () {
    var self = this;

    return 'rgb('.concat(
      [
        self.props.rgb.r,
        self.props.rgb.g,
        self.props.rgb.b
      ].join(', ')
    ).concat(')');
  },

  readableHex: function () {
    return this.props.hex;
  },

  setValue: function (type) {
    var value = this['readable'.concat(type)]();
    this.props.setValue({
      target: {
        value: value
      }
    });
    this.props.togglePicker();
    VariableStore.action('requestPreview');
  },

  render: function () {
    return (
      <div className='row values'>
        <div className='col-xs-12'>
          <code>{this.readableHSL()}</code>
          <button
            className='btn btn-primary btn-xs pull-right'
            onClick={this.setValue.bind(this, 'HSL')}>Use</button>
        </div>

        <div className='col-xs-12'>
          <code>{this.readableRGB()}</code>
          <button
            className='btn btn-primary btn-xs pull-right'
            onClick={this.setValue.bind(this, 'RGB')}>Use</button>
        </div>

        <div className='col-xs-12'>
          <code>{this.readableHex()}</code>
          <button
            className='btn btn-primary btn-xs pull-right'
            onClick={this.setValue.bind(this, 'Hex')}>Use</button>
        </div>
      </div>
    );
  }
});

module.exports = ColorPickerValues;
