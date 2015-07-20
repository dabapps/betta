'use strict';

var React = require('react');

var Navigation = React.createClass({
  render: function () {
    return (
      <nav className='navbar navbar-inverse navbar-fixed-top'>
        <div className='container-fluid'>
          <div className='navbar-header'>
            <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#navbar' aria-expanded='false' aria-controls='navbar'>
              <span className='sr-only'>Toggle navigation</span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
            </button>
            <a className='navbar-brand' href='/'>
              <img className='img-responsive app-logo' src='static/img/logo-icon.png' />
            </a>
          </div>
          <div className='navbar-collapse collapse'>
            <ul className='nav navbar-nav'>
              <li><a href='/'>Import</a></li>
              <li><a href='/'>Save</a></li>
            </ul>
            <ul className='nav navbar-nav navbar-right'>
              <li><a href='/'>Right Side</a></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
});

module.exports = Navigation;
