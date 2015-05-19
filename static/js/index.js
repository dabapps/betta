'use strict';

window.define(['react', 'less', 'jquery', 'iframe', 'sidebar', 'variable-store', 'modal'], function (React, less, $, Iframe, Sidebar, VariableStore, Modal) {

  var App = React.createClass({
    applyCSS: function (css) {
      var iframeDoc = this.state.iframeDoc;

      iframeDoc.find('style').remove();
      iframeDoc[0].styleSheets[0].disabled = true;

      var styles = $('<style>')
        .html(css);

      iframeDoc.find('head').append(styles);
    },

    errorLoadingBootstrap: function (error) {
      window.alert(error.responseText);

      this.setState({
        loading: false
      });
    },

    renderLess: function (result, callback) {
      var self = this;

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
    },

    getBootstrapAndRenderLess: function (callback) {
      var self = this;

      $.ajax('static/lib/bootstrap/less/bootstrap.less', {
        success: function (result) {
          var variables = VariableStore.getPackedVariables();
          variables = variables.replace(/(@icon-font-path:).+?;/i, '$1 "../static/lib/bootstrap/fonts/";');

          result = result.replace(/"(.+?)"/gi, '"static/lib/bootstrap/less/$1"');
          result = result.replace(/@.+?variables.+?;/i, variables);

          self.renderLess(result, callback);
        },
        error: self.errorLoadingBootstrap
      });
    },

    preview: function () {
      var self = this;

      this.setState({
        loading: true
      });

      this.getBootstrapAndRenderLess(function () {
        self.setState({
          loading: false
        });
      });
    },

    reset: function () {
      VariableStore.action('reset');
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
      VariableStore.action('updateVariable', groupIndex, variablesIndex, event.target.value);
    },

    iframeLoaded: function (iframe) {
      this.setState({
        iframeLoaded: true,
        loading: false,
        iframe: iframe,
        iframeDoc: $(iframe).contents()
      });
    },

    getVariables: function () {
      this.setState({
        variables: VariableStore.getVariables()
      });
    },

    getVariablesAndPreview: function () {
      this.getVariables();
      this.preview();
    },

    componentWillMount: function() {
      VariableStore.bind('loaded', this.getVariables);
      VariableStore.bind('updateVariable', this.getVariables);
      VariableStore.bind('reset', this.getVariablesAndPreview);
    },

    componentWillUnmount: function() {
      VariableStore.unbind('loaded', this.getVariables);
      VariableStore.unbind('updateVariable', this.getVariables);
      VariableStore.unbind('reset', this.getVariablesAndPreview);
    },

    getInitialState: function () {
      return {
        projects: [],
        variables: VariableStore.getVariables(),
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
            variables: self.state.variables,
            updateVariable: self.updateVariable,
            setFrameSize: self.setFrameSize,
            frameSizes: self.state.frameSizes,
            currentFrameSize: self.state.currentFrameSize,
            preview: self.preview,
            reset: self.reset
          }
        ),
        React.createElement(
          Modal
        )
      );
    }
  });

  React.render(React.createElement(App), document.body);

});
