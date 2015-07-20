'use strict';

var React = require('react');

var Navigation = React.createClass({
  render: function () {
    return (
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">Betta</a>
          </div>
          <div id="navbar" className="navbar-collapse collapse">
            <ul className="nav navbar-nav">
              <li className="active"><a href="/">Back</a></li>
              <li><a href="/">Import</a></li>
              <li><a href="/">Save</a></li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li><a target="_blank" href="https://github.com/dabapps/betta">Fork us on GitHub</a></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
});

module.exports = Navigation;
