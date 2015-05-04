'use strict';

window.define(['react', 'color-picker'], function (React, ColorPicker) {

  var FormCollection = React.createClass({
    create: {
      subHeader: function (child) {
        return React.createElement(
          'h5',
          null,
          child.value
        );
      },
      subText: function (child) {
        return React.createElement(
          'p',
          null,
          child.value
        );
      },
      label: function (child) {
        return React.createElement(
          'sub',
          null,
          child.value
        );
      },
      variable: function (child, index) {
        var self = this;
        var colorPicker;

        if (child.type === 'color') {
          colorPicker = React.createElement(
            ColorPicker,
            {
              onChange: self.props.updateVariable.bind(null, self.props.index, index),
              value: child.value,
              defaultValue: child.defaultValue
            }
          );
        }

        return React.createElement(
          'div',
          {
            className: 'form-group'
          },
          React.createElement(
            'label',
            null,
            child.name
          ),
          React.createElement(
            'div',
            {
              className: 'input-wrapper'
            },
            React.createElement(
              'input',
              {
                className: 'form-control',
                placeholder: child.defaultValue,
                value: child.value,
                onChange: self.props.updateVariable.bind(null, self.props.index, index)
              },
              child.value
            ),
            colorPicker
          )
        );
      }
    },

    render: function () {
      var self = this;

      var children = this.props.group.children.map(function (child, index) {
        return self.create[child.element].call(self, child, index);
      });

      return React.createElement(
        'div',
        {
          className: 'form-collection' + (this.props.index === this.props.activeIndex ? ' active' : '')
        },
        React.createElement(
          'a',
          {
            onClick: self.props.setActiveCollection.bind(null, this.props.index)
          },
          React.createElement(
            'h4',
            null,
            this.props.group.value
          )
        ),
        children
      );
    }
  });

  return FormCollection;

});
