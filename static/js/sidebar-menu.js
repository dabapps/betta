'use strict';

/*

<div class="dropdown">
  <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-expanded="true">
    Dropdown
    <span class="caret"></span>
  </button>
  <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
    <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Action</a></li>
    <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Another action</a></li>
    <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Something else here</a></li>
    <li role="presentation"><a role="menuitem" tabindex="-1" href="#">Separated link</a></li>
  </ul>
</div>

*/

window.define(['react', 'modal-store', 'export-modal'], function (React, ModalStore, ExportModal) {

  var SidebarMenu = React.createClass({
    export: function () {
      ModalStore.action('open', React.createElement(ExportModal));
    },

    toggleDropdown: function () {
      this.setState({
        dropdownActive: !this.state.dropdownActive
      });
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
                onClick: self.open
              },
              'Open'
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
                onClick: self.save
              },
              'Save'
            )
          ),
          React.createElement(
            'li',
            null,
            React.createElement(
              'a',
              {
                onClick: self.saveAs
              },
              'Save as'
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
              onClick: self.props.preview
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
        )
      );
    }
  });

  return SidebarMenu;

});
