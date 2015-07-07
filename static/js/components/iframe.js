'use strict';

var _ = require('underscore');
var React = require('react');

var Iframe = React.createClass({
  iframeLoaded: function (event) {
    this.props.iframeLoaded(event.target);
  },

  getFrameSize: function () {
    var self = this;

    var foundSize = _.find(self.props.frameSizes, function (frameSize) {
      return frameSize.name === self.props.currentFrameSize.name;
    });

    return foundSize ? foundSize.value : '100%';
  },

  componentDidMount: function () {
    var iframe = this.getDOMNode().getElementsByTagName('iframe')[0];

    iframe.addEventListener('load', this.iframeLoaded);
  },

  render: function () {
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
            maxWidth: this.getFrameSize()
          }} />
        {loadingIcon}
      </div>
    );
  }
});

module.exports = Iframe;
