'use strict';

var React = require('react');
var FormCollection = require('./form-collection');
var SidebarMenu = require('./sidebar-menu');
var SearchStore = require('../stores/search-store');

var Sidebar = React.createClass({
  getInitialState: function () {
    return {
      activeIndex: undefined,
      searchTerm: SearchStore.getSearchTerm()
    };
  },

  componentWillMount: function () {
    SearchStore.bind('setSearchTerm', this.getSearchTerm);
  },

  componentWillUnmount: function () {
    SearchStore.unbind('setSearchTerm', this.getSearchTerm);
  },

  setActiveCollection: function (index) {
    index = this.state.activeIndex === index ? undefined : index;

    this.setState({
      activeIndex: index
    });
  },

  getSearchTerm: function () {
    this.setState({
      searchTerm: SearchStore.getSearchTerm()
    });
  },

  render: function () {
    var self = this;

    var formControls = this.props.variables.map(function (item, index) {
      if (item.element === 'collection') {
        return (
          <FormCollection
            key={item.value}
            group={item}
            index={index}
            activeIndex={self.state.activeIndex}
            setActiveCollection={self.setActiveCollection}
            updateVariable={self.props.updateVariable}
            searchTerm={self.state.searchTerm}
          />
        );
      }
    });

    return (
      <div className="sidebar-container">
        <SidebarMenu
          searchTerm={self.state.searchTerm}
        />
        <div className="sidebar">
          <div>{formControls}</div>
        </div>
      </div>
    );
  }
});

module.exports = Sidebar;
