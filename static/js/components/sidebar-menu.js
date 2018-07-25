'use strict';

var React = require('react');
var SearchStore = require('../stores/search-store');

var SidebarMenu = React.createClass({
  onChangeSearchTerm: function (event) {
    SearchStore.action('setSearchTerm', event.target.value);
  },

  onClearSearchTerm: function () {
    SearchStore.action('setSearchTerm', undefined);
  },

  render: function () {
    return (
      <div className="sidebar-menu">
        <div className="form-group">
          <div className="input-wrapper search-wrapper">
            <input
              type="text"
              className="form-control"
              placeholder="Search variables"
              onChange={this.onChangeSearchTerm}
              value={this.props.searchTerm}
            />
            <span className="glyphicon glyphicon-remove" onClick={this.onClearSearchTerm} />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SidebarMenu;
