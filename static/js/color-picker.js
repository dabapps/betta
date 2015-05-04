'use strict';

window.define(['react'], function (React) {

  var ColorPicker = React.createClass({
    render: function () {
      var self = this;

      return React.createElement(
        'div',
        {
          className: 'color-picker',
          style: {
            backgroundColor: self.props.value || self.props.defaultValue
          }
        }
      );
    }
  });

  return ColorPicker;

});
