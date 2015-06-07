'use strict';

window.define(['react'], function (React) {

  var Checkbox = React.createClass({
    doNothing: function () {

    },

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
              onChange: this.doNothing
            }
          ),
          this.props.label
        )
      );
    }
  });

  return Checkbox;

});
