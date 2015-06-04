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
      variable: function (child, index) {
        var self = this;
        var colorPicker, label;

        if (child.type === 'color') {
          colorPicker = React.createElement(
            ColorPicker,
            {
              setValue: self.props.updateVariable.bind(null, self.props.index, index),
              value: child.value,
              defaultValue: child.defaultValue
            }
          );
        }

        if (child.label) {
          label = React.createElement(
            'p',
            null,
            React.createElement(
              'sub',
              null,
              child.label
            )
          );
        }

        return React.createElement(
          'div',
          {
            className: 'form-group'
          },
          label,
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
      var description;

      var children = this.props.group.children.map(function (child, index) {
        return self.create[child.element].call(self, child, index);
      });

      if (this.props.group.description) {
        description = React.createElement(
          'p',
          null,
          this.props.group.description
        );
      }

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
        {description},
        children
      );
    }
  });

  return FormCollection;

});
