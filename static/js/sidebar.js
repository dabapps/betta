'use strict';

window.define(['react', 'form-collection', 'sidebar-menu', 'search-store'], function (React, FormCollection, SidebarMenu, SearchStore) {

  var Sidebar = React.createClass({
    componentWillUnmount: function () {
      SearchStore.unbind('setSearchTerm', this.getSearchTerm);
    },

    componentWillMount: function () {
      SearchStore.bind('setSearchTerm', this.getSearchTerm);
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

    getInitialState: function () {
      return {
        activeIndex: undefined,
        searchTerm: SearchStore.getSearchTerm()
      };
    },

    render: function () {
      var self = this;

      var formControls = this.props.variables.map(function (item, index) {
        if (item.element === 'collection') {
          return React.createElement(
            FormCollection,
            {
              group: item,
              index: index,
              activeIndex: self.state.activeIndex,
              setActiveCollection: self.setActiveCollection,
              updateVariable: self.props.updateVariable,
              searchTerm: self.state.searchTerm
            }
          );
        }
      });

      return React.createElement(
        'div',
        {
          className: 'sidebar-container'
        },
        React.createElement(
          SidebarMenu,
          {
            setFrameSize: self.props.setFrameSize,
            frameSizes: self.props.frameSizes,
            currentFrameSize: self.props.currentFrameSize,
            preview: self.props.preview,
            reset: self.props.reset,
            searchTerm: self.state.searchTerm
          }
        ),
        React.createElement(
          'div',
          {
            className: 'sidebar'
          },
          React.createElement(
            'div',
            null,
            formControls
          )
        )
      );
    }
  });

  return Sidebar;

});
