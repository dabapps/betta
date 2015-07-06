'use strict';

var _ = require('underscore');
var React = require('react');
var VariableStore = require('./variable-store');
var ModalRenderer = require('./modal-renderer');
var Iframe = require('./iframe');
var Sidebar = require('./sidebar');
var $ = require('jquery');
var less = require('less/browser');

less = less(window, {
  env: 'development',
  logLevel: 2,
  async: true,
  fileAsync: true,
  dumpLineNumbers: 'comments',
  useFileCache: true
});

var App = React.createClass({
  concatMediaQueries: function (variables) {
    var prefix = '@screen';
    var suffix = 'min';
    var availableSizes = ['xs', 'sm', 'md', 'lg'];

    return variables.concat(_.map(availableSizes, function (size) {
      var className = [prefix.replace('@', '.'), size, suffix].join('-');
      var variableName = [prefix, size, suffix].join('-');

      return [className, '{width:', variableName, ';}'].join('');
    }).join('\n'));
  },
  applyFrameSizes: function (css) {
    var sizes = this.state.frameSizes;

    var regy = /\.screen-(..)-min\s*?{[\n\r]*?\s*?width:\s*(.+?);[\n\r]*?}/gi;
    var index = 0;
    var match;

    while ((match = regy.exec(css))) {
      sizes[index] = {
        name: match[1].toUpperCase(),
        value: match[2]
      };
      index += 1;
    }

    this.setState({
      frameSizes: sizes
    });
  },
  updateFrameSizes: function () {
    var self = this;
    var variables = VariableStore.getPackedVariables();

    variables = this.concatMediaQueries(variables);

    less.render(variables, function (error, tree) {
      if (error) {
        window.alert(error);
        return;
      }

      self.applyFrameSizes(tree.css);
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
      self.updateFrameSizes();

      if (typeof callback === 'function') {
        callback();
      }
    });
  },

  getBootstrapAndRenderLess: function (callback) {
    var self = this;

    $.ajax('static/build/lib/bootstrap/less/bootstrap.less', {
      success: function (result) {
        var variables = VariableStore.getPackedVariables();
        variables = variables.replace(
          /(@icon-font-path:).+?;/i,
          '$1 "../static/build/lib/bootstrap/fonts/";'
        );

        result = result.replace(/"(.+?)"/gi, '"static/build/lib/bootstrap/less/$1"');
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

  componentWillMount: function () {
    VariableStore.bind('loaded', this.getVariables);
    VariableStore.bind('updateVariable', this.getVariables);
    VariableStore.bind('reset', this.getVariablesAndPreview);
    VariableStore.bind('requestPreview', this.preview);
  },

  componentWillUnmount: function () {
    VariableStore.unbind('loaded', this.getVariables);
    VariableStore.unbind('updateVariable', this.getVariables);
    VariableStore.unbind('reset', this.getVariablesAndPreview);
    VariableStore.unbind('requestPreview', this.preview);
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

    return (
      <div className='app'>
        <Iframe
          iframeLoaded={self.iframeLoaded}
          loading={self.state.loading}
          currentFrameSize={self.state.currentFrameSize}
          frameSizes={self.state.frameSizes} />
        <Sidebar
          variables={self.state.variables}
          updateVariable={self.updateVariable}
          setFrameSize={self.setFrameSize}
          frameSizes={self.state.frameSizes}
          currentFrameSize={self.state.currentFrameSize}
          reset={self.reset} />
        <ModalRenderer />
      </div>
    );
  }
});

React.render(<App />, document.body);
