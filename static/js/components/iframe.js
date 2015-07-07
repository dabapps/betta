'use strict';

var React = require('react');

var Iframe = React.createClass({
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
      loadingIcon = (
        <div className='loading-container'>
          <div className='loading-icon' />
        </div>
      );
    }

    return (
      <div className='iframe-container'>
        <iframe
          className='iframe'
          src='templates/template-1.html'
          style={{
            maxWidth: self.props.currentFrameSize.value
          }} />
        {loadingIcon}
      </div>
    );
  }
});

module.exports = Iframe;
