'use strict';

window.define(
  [
  'react',
  'modal-store',
  'export-modal',
  'import-modal',
  'search-store',
  'variable-store'
  ],
  function (
  React,
  ModalStore,
  ExportModal,
  ImportModal,
  SearchStore,
  VariableStore
  ) {

  var SidebarMenu = React.createClass({
    preview: function () {
      VariableStore.action('requestPreview');
    },

    export: function () {
      ModalStore.action('open', ExportModal);
    },

    import: function () {
      ModalStore.action('open', ImportModal);
    },

    toggleDropdown: function () {
      this.setState({
        dropdownActive: !this.state.dropdownActive
      });
    },

    setSearchTerm: function (event) {
      SearchStore.action('setSearchTerm', event.target.value);
    },

    clearSearchTerm: function () {
      SearchStore.action('setSearchTerm', undefined);
    },

    getInitialState: function () {
      return {
        dropdownActive: false
      };
    },

    render: function () {
      var self = this;
      var dropdown;

      var frameSizes = this.props.frameSizes.map(function (size) {
        return React.createElement(
          'option',
          {
            key: size.name,
            value: size.name
          },
          size.name
        );
      });

      if (this.state.dropdownActive) {
        dropdown = React.createElement(
          'ul',
          {
            className: 'dropdown-menu'
          },
          React.createElement(
            'li',
            null,
            React.createElement(
              'a',
              {
                onClick: self.import
              },
              'Import'
            )
          ),
          React.createElement(
            'li',
            null,
            React.createElement(
              'a',
              {
                onClick: self.export
              },
              'Export'
            )
          ),
          React.createElement(
            'li',
            {
              className: 'divider'
            }
          ),
          React.createElement(
            'li',
            null,
            React.createElement(
              'a',
              {
                onClick: self.props.reset
              },
              'Reset'
            )
          )
        );
      }

      return React.createElement(
        'div',
        {
          className: 'sidebar-menu'
        },
        React.createElement(
          'div',
          {
            className: 'form-group'
          },
          React.createElement(
            'select',
            {
              className: 'form-control size-control',
              onChange: self.props.setFrameSize,
              value: self.props.currentFrameSize.name
            },
            frameSizes
          ),
          React.createElement(
            'button',
            {
              className: 'btn btn-small btn-default',
              onClick: self.preview
            },
            'Preview'
          ),
          React.createElement(
            'div',
            {
              className: 'dropdown pull-right' + (self.state.dropdownActive ? ' open' : ''),
              onClick: self.toggleDropdown
            },
            React.createElement(
              'button',
              {
                className: 'btn btn-small btn-default'
              },
              'File ',
              React.createElement(
                'span',
                {
                  className: 'caret'
                }
              )
            ),
            dropdown
          )
        ),
        React.createElement(
          'div',
          {
            className: 'form-group'
          },
          React.createElement(
            'div',
            {
              className: 'input-wrapper search-wrapper'
            },
            React.createElement(
              'input',
              {
                type: 'text',
                className: 'form-control',
                placeholder: 'Search variables',
                onChange: this.setSearchTerm,
                value: this.props.searchTerm
              }
            ),
            React.createElement(
              'span',
              {
                className: 'glyphicon glyphicon-remove',
                onClick: this.clearSearchTerm
              }
            )
          )
        )
      );
    }
  });

  return SidebarMenu;

});
