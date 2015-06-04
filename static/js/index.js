'use strict';

window.define(['react', 'less', 'jquery', 'iframe', 'sidebar', 'variables'], function (React, less, $, Iframe, Sidebar, variables) {

  var App = React.createClass({
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
          result = result.replace(/@.+?variables.+?;/i, variables.pack(self.state.unpackedVariables));
        } else {
          self.resetVariables();
        }

        less.render(result, function (error, tree) {
          if (error) {
            window.alert(error);
            self.setState({
              loading: false
            });
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

    unpackVariables: function (result) {
      this.setState({
        unpackedVariables: variables.unpack(result)
      });
    },

    errorLoadingLess: function (error) {
      window.alert(error.responseText);

      this.setState({
        loading: false
      });
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
