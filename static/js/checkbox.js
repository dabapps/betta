'use strict';

window.define(['react'], function (React) {

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
              checked: this.props.checked
            }
          ),
          this.props.label
        )
      );
    }
  });

  return Checkbox;

});
