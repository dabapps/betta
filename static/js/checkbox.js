'use strict';

window.define(['react', 'underscore'], function (React, _) {

  var Checkbox = React.createClass({
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

  return Checkbox;

});
