'use strict';

var React = require('react');

module.exports = React.createClass({
  iframeLoaded: function (event) {
    this.props.iframeLoaded(event.target);
  },

  componentDidMount: function () {
    var iframe = this.getDOMNode().getElementsByTagName('iframe')[0];

    iframe.addEventListener('load', this.iframeLoaded);
  },

  render: function () {
    var self = this;
    var loadingIcon;

    if (this.props.loading) {
      loadingIcon = React.createElement(
        'div',
        {
          className: 'loading-container'
        },
        React.createElement(
          'div',
          {
            className: 'loading-icon'
          }
        )
      );
    }

    return React.createElement(
      'div',
      {
        className: 'iframe-container'
      },
      React.createElement(
        'iframe',
        {
          className: 'iframe',
          src: 'templates/template-1.html',
          style: {
            maxWidth: self.props.currentFrameSize.value
          }
        }
      ),
      loadingIcon
    );
  }
});
