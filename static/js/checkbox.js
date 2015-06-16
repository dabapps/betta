'use strict';

var React = require('react');
var _ = require('underscore');

var CheckBox = React.createClass({
  render: function () {
    return React.createElement(
      'div',
      {
        className: 'checkbox'
      },
      React.createElement(
        'label',
        {
          onClick: this.props.onClick
        },
        React.createElement(
          'input',
          {
            type: 'checkbox',
            checked: this.props.checked,
            onChange: _.noop
          }
        ),
        this.props.label
      )
    );
  }
});

module.exports = CheckBox;
