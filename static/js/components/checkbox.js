'use strict';

var React = require('react');
var _ = require('underscore');

var CheckBox = React.createClass({
  render: function () {
    return (
      <div className="checkbox">
        <label onClick={this.props.onClick}>
          {/* eslint-disable react/jsx-handler-names */}
          <input type="checkbox" checked={this.props.checked} onChange={_.noop} />
          {/* eslint-enable react/jsx-handler-names */}
          {this.props.label}
        </label>
      </div>
    );
  }
});

module.exports = CheckBox;
