'use strict';

window.define(['react', 'less', 'jquery', 'iframe', 'sidebar'], function (React, less, $, Iframe, Sidebar) {

  var App = React.createClass({
    createVariables: function () {
      var self = this;
      var variables = '';

      $.each(self.state.unpackedVariables, function (collectionIndex, collection) {
        $.each(collection.children, function (childIndex, child) {
          if (child.element === 'variable') {
            if (typeof child.value !== 'undefined' && child.value !== null && child.value !== '') {
              variables = variables.concat(
                [child.name, child.value].join(': ').concat(';\n')
              );
            } else {
              variables = variables.concat(
                [child.name, child.defaultValue].join(': ').concat(';\n')
              );
            }
          }
        });
      });

      return variables;
    },

    resetVariables: function () {
      var unpackedVariables = this.state.unpackedVariables;

      $.each(unpackedVariables, function (collectionIndex, collection) {
        $.each(collection.children, function (childIndex, child) {
          if (child.element === 'variable') {
            child.value = '';
          }
        });
      });

      this.setState({
        unpackedVariables: unpackedVariables
      });
    },

    applyCSS: function (css) {
      var iframeDoc = this.state.iframeDoc;

      iframeDoc.find('style').remove();
      iframeDoc[0].styleSheets[0].disabled = true;

      var styles = $('<style>')
        .html(css);

      iframeDoc.find('head').append(styles);
    },

    renderLess: function (callback, reset, result) {
      var self = this;

      if (result) {
        result = result.replace(/"(.+?)"/gi, '"static/lib/bootstrap/less/$1"');

        if (!reset) {
          result = result.replace(/@.+?variables.+?;/i, self.createVariables());
        } else {
          self.resetVariables();
        }

        less.render(result, function (error, tree) {
          if (error) {
            window.alert(error);
            return;
          }

          self.applyCSS(tree.css);

          if (typeof callback === 'function') {
            callback();
          }
        });
      }
    },

    preview: function () {
      var self = this;

      this.setState({
        loading: true
      });

      $.ajax('static/lib/bootstrap/less/bootstrap.less', {
        success: self.renderLess.bind(self, function () {
          self.setState({
            loading: false
          });
        }, false),
        error: self.errorLoadingLess
      });
    },

    reset: function () {
      var self = this;

      this.setState({
        loading: true
      });

      $.ajax('static/lib/bootstrap/less/bootstrap.less', {
        success: self.renderLess.bind(self, function () {
          self.setState({
            loading: false
          });
        }, true),
        error: self.errorLoadingLess
      });
    },

    setFrameSize: function (event) {
      var value = event.target.value;

      var index = this.state.frameSizes.map(function (size) {
        return size.name;
      }).indexOf(value);

      this.setState({
        currentFrameSize: this.state.frameSizes[index]
      });
    },

    updateVariable: function (groupIndex, variablesIndex, event) {
      var unpackedVariables = this.state.unpackedVariables;
      unpackedVariables[groupIndex].children[variablesIndex].value = event.target.value;

      this.setState({
        unpackedVariables: unpackedVariables
      });
    },

    addCollection: function (unpackedVariables, line) {
      unpackedVariables.push({
        element: 'collection',
        value: line.replace(/\/\/==\s*/, ''),
        children: []
      });
    },

    addSubHeader: function (unpackedVariables, line) {
      unpackedVariables[unpackedVariables.length - 1].children.push({
        element: 'subHeader',
        value: line.replace(/\/\/===\s*/, '')
      });
    },

    addSubText: function (unpackedVariables, line) {
      unpackedVariables[unpackedVariables.length - 1].children.push({
        element: 'subText',
        value: line.replace(/\/\/##\s*/, '')
      });
    },

    addLabel: function (unpackedVariables, line) {
      unpackedVariables[unpackedVariables.length - 1].children.push({
        element: 'label',
        value: line.replace(/\/\/\*\*\s*/, '')
      });
    },

    addVariable: function (unpackedVariables, line) {
      var colorVariables = this.state.colorVariables;
      var name = line.replace(/@\s*(.*)\s*:\s*(.*)\s*;.*/, '@$1');
      var defaultValue = line.replace(/@\s*(.*)\s*:\s*(.*)\s*;.*/, '$2');
      var type;

      if (defaultValue.indexOf('#') === 0 || defaultValue.indexOf('lighten') === 0 || defaultValue.indexOf('darken') === 0) {
        type = 'color';
        colorVariables.push(name);
        this.setState({
          colorVariables: colorVariables
        });
      } else if (defaultValue.indexOf('@') === 0) {
        if (colorVariables.indexOf(defaultValue) >= 0) {
          type = 'color';
          colorVariables.push(name);
          this.setState({
            colorVariables: colorVariables
          });
        } else {
          type = 'other';
        }
      } else {
        type = 'other';
      }

      unpackedVariables[unpackedVariables.length - 1].children.push({
        element: 'variable',
        name: name,
        defaultValue: defaultValue,
        value: '',
        type: type
      });
    },

    unpackVariables: function (result) {
      var self = this;
      var lines = result.split('\n');
      var unpackedVariables = [];

      $.each(lines, function (index, line) {
        // Sub-header
        if (line.indexOf('//===') === 0) {
          self.addSubHeader(unpackedVariables, line);
        } else
        // Header (collection)
        if (line.indexOf('//==') === 0) {
          self.addCollection(unpackedVariables, line);
        } else
        // Sub-text
        if (line.indexOf('//##') === 0) {
          self.addSubText(unpackedVariables, line);
        } else
        // Label
        if (line.indexOf('//**') === 0) {
          self.addLabel(unpackedVariables, line);
        } else
        // Variable
        if (line.indexOf('@') === 0) {
          self.addVariable(unpackedVariables, line);
        }
      });

      this.setState({
        unpackedVariables: unpackedVariables
      });
    },

    errorLoadingLess: function (error) {
      window.alert(error.responseText);
    },

    getVariables: function () {
      var self = this;

      $.ajax('static/lib/bootstrap/less/variables.less', {
        success: self.unpackVariables,
        error: self.errorLoadingLess
      });
    },

    iframeLoaded: function (iframe) {
      this.setState({
        iframeLoaded: true,
        loading: false,
        iframe: iframe,
        iframeDoc: $(iframe).contents()
      });
    },

    componentWillMount: function () {
      this.getVariables();
    },

    getInitialState: function () {
      return {
        projects: [],
        unpackedVariables: [],
        colorVariables: [],
        iframeDoc: undefined,
        iframeLoaded: false,
        loading: true,
        currentFrameSize: {
          name: 'XL',
          value: '100%'
        },
        frameSizes: [
          {
            name: 'XS',
            value: 480
          },
          {
            name: 'SM',
            value: 768
          },
          {
            name: 'MD',
            value: 992
          },
          {
            name: 'LG',
            value: 1200
          },
          {
            name: 'XL',
            value: '100%'
          }
        ]
      };
    },

    render: function () {
      var self = this;

      return React.createElement(
        'div',
        {
          className: 'app'
        },
        React.createElement(
          Iframe,
          {
            iframeLoaded: self.iframeLoaded,
            loading: self.state.loading,
            currentFrameSize: self.state.currentFrameSize
          }
        ),
        React.createElement(
          Sidebar,
          {
            unpackedVariables: self.state.unpackedVariables,
            updateVariable: self.updateVariable,
            setFrameSize: self.setFrameSize,
            frameSizes: self.state.frameSizes,
            currentFrameSize: self.state.currentFrameSize,
            preview: self.preview,
            reset: self.reset
          }
        )
      );
    }
  });

  React.render(React.createElement(App), document.body);

});
