'use strict';

var Store = require('../stores/store');

var modalOpen = false;
var modalView, modalProps;

var ModalStore = new Store();

ModalStore.isOpen = function () {
  return modalOpen;
};

ModalStore.getView = function () {
  return modalView;
};

ModalStore.getProps = function () {
  return modalProps;
};

ModalStore.createAction('open', function (view, props) {
  modalView = view;
  modalProps = props;
  modalOpen = true;
  ModalStore.emitEvent('open');
});

ModalStore.createAction('close', function () {
  modalOpen = false;
  ModalStore.emitEvent('close');
});

module.exports = ModalStore;
