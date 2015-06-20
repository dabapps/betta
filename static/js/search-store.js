'use strict';

var Store = require('./store');

var searchTerm;

var SearchStore = new Store();

SearchStore.getSearchTerm = function () {
  return searchTerm;
};

SearchStore.createAction('setSearchTerm', function (newSearchTerm) {
  searchTerm = newSearchTerm;

  SearchStore.emitEvent('setSearchTerm');
});

module.exports = SearchStore;
