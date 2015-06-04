'use strict';

window.define(['store'], function (Store) {

  var modalOpen = false;
  var modalView;

  var ModalStore = new Store();

  ModalStore.isOpen = function () {
    return modalOpen;
  };

  ModalStore.getView = function () {
    return modalView;
  };

  ModalStore.createAction('open', function (view) {
    modalView = view;
    modalOpen = true;
    ModalStore.emitEvent('open');
  });

  ModalStore.createAction('close', function () {
    modalOpen = false;
    ModalStore.emitEvent('close');
  });

  return ModalStore;

});
