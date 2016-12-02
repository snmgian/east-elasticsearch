'use strict';

var elasticSearch = require('elasticsearch');
var path = require('path');

var DEFAULT_MIGRATIONS_INDEX_NAME = '.migrations';
var MIGRATIONS_TYPE = 'migrations';

var Adapter = function(params) {
	this.url = params.url;
  this.apiVersion = params.elasticSearchApiVersion;
  this.migrationsIndex = params.migrationsIndex || DEFAULT_MIGRATIONS_INDEX_NAME;

	if (!this.url) {
		throw new Error('url param should be set');
	}
};

Adapter.prototype.getTemplatePath = function() {
	return path.join(__dirname, 'migrationTemplate.js');
};

Adapter.prototype.connect = function(callback) {
  var client = this._getClient();

  this._createMigrationsIndexIfNotExists().then(function () {
    callback(null, client);

  }).catch(function (error) {
    callback(error);
  });
};

Adapter.prototype.disconnect = function(callback) {
  callback();
};

Adapter.prototype.getExecutedMigrationNames = function(callback) {
  var client = this._getClient();

  var options = {
    index: this.migrationsIndex
  };

  client.search(options).then(function(response) {
    var executedMigrationNames = response.hits.hits.map(function(hit) { return hit._id; });

    callback(null, executedMigrationNames);

  }).catch(function(error) {
    callback(error);
  });
};

Adapter.prototype.markExecuted = function(name, callback) {
  var client = this._getClient();

  var options = {
    index: this.migrationsIndex,
    type: MIGRATIONS_TYPE,
    id: name,
    body: {}
  };

  client.index(options).then(function() {
    callback();

  }).catch(function(error) {
    callback(error);
  });
};

Adapter.prototype.unmarkExecuted = function(name, callback) {
  var client = this._getClient();

  var options = {
    index: this.migrationsIndex,
    type: MIGRATIONS_TYPE,
    id: name
  };

  client.delete(options).then(function () {
    callback();

  }).catch(function(error) {
    callback(error);
  });
};

Adapter.prototype._createMigrationsIndexIfNotExists = function() {
  var self = this;

  return this._doesIndexExist().then(function(exists) {
    if (!exists) {
      return self._createMigrationsIndex();
    }
  });
};

Adapter.prototype._createMigrationsIndex = function() {
  var client = this._getClient();

  var options = {
    index: this.migrationsIndex
  };

  return client.indices.create(options);
};

Adapter.prototype._doesIndexExist = function() {
  var client = this._getClient();

  var options = {
    index: this.migrationsIndex
  };

  return client.indices.exists(options);
};

Adapter.prototype._getClient = function() {
  if (!this.client) {
    this.client = new elasticSearch.Client({
      host: this.url,
      apiVersion: this.apiVersion
    });
  }

  return this.client;
};

module.exports = Adapter;
