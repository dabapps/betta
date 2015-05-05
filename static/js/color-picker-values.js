'use strict';

window.define(['react'], function (React) {

  var ColorPickerValues = React.createClass({
    render: function () {
      var self = this;

      return React.createElement(
        'div',
        {
          className: 'row'
        },
        React.createElement(
          'div',
          {
            className: 'col-xs-12'
          },
          React.createElement(
            'code',
            null,
            'hsl(' + [Math.round(self.props.hsl.h * 255), Math.round(self.props.hsl.s * 100) + '%', Math.round(self.props.hsl.l * 100) + '%'].join(', ') + ')'
          )
        ),
        React.createElement(
          'div',
          {
            className: 'col-xs-12'
          },
          React.createElement(
            'code',
            null,
            'rgb(' + [self.props.rgb.r, self.props.rgb.g, self.props.rgb.b].join(', ') + ')'
          )
        ),
        React.createElement(
          'div',
          {
            className: 'col-xs-12'
          },
          React.createElement(
            'code',
            null,
            self.props.hex
          )
        )
      );
    }
  });

  return ColorPickerValues;

});
