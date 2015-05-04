'use strict';

window.define(['react', 'form-collection', 'sidebar-menu'], function (React, FormCollection, SidebarMenu) {

  var Sidebar = React.createClass({
    setActiveCollection: function (index) {
      index = this.state.activeIndex === index ? undefined : index;

      this.setState({
        activeIndex: index
      });
    },

    getInitialState: function () {
      return {
        activeIndex: 0
      };
    },

    render: function () {
      var self = this;

      var formControls = this.props.unpackedVariables.map(function (item, index) {
        if (item.element === 'collection') {
          return React.createElement(
            FormCollection,
            {
              group: item,
              index: index,
              activeIndex: self.state.activeIndex,
              setActiveCollection: self.setActiveCollection,
              updateVariable: self.props.updateVariable
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
            reset: self.props.reset
          }
        ),
        React.createElement(
          'div',
          {
            className: 'sidebar'
          },
          React.createElement(
            'form',
            null,
            formControls
          )
        )
      );
    }
  });

  return Sidebar;

});
