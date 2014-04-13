var async = require('async'),
	cast = require('sc-cast'),
	fdb = require('file-db'),
	fs = require('fs-extra'),
	hasKey = require('sc-haskey'),
	is = require('sc-is'),
	_ = require('underscore'),
	path = require('path'),
	dbPath = '.tmp/moldy-db',
	fdbKey = '_id';

var swapKeys = function (_object, _oldKey, _newKey) {
	if (hasKey(_object, _oldKey, 'string')) {
		_object[_newKey] = _object[_oldKey];
		if (_oldKey !== _newKey) {
			delete _object[_oldKey];
		}
	}
};

module.exports = function (_model, _data, _method, _url, _callback) {
	var method = _method,
		model = _model,
		data = cast(_data, 'object', {});

	fdb.open(dbPath, function (_error, _db) {
		var query = _db.use(model.__name);

		switch (true) {
		case (/get/i.test(method)):
			query
				.find()
				.exec(function (_error, _res) {
					var items,
						res = [];

					if (!_error) {
						swapKeys(data, model.__key, fdbKey);
						items = _.where(_res, data || {});
						items.forEach(function (_item) {
							var item = is.an.object(_item) ? _item : {};
							if (is.empty(item)) return;
							swapKeys(item, fdbKey, model.__key);
							Object.keys(item).forEach(function (_key) {
								if (is.an.array(model[_key])) {
									var arrayItem = [];
									Object.keys(item[_key]).forEach(function (_i) {
										var index = cast(_i, 'number', -1);
										if (index >= 0) {
											arrayItem.push(item[_key][index]);
										}
									});
									item[_key] = arrayItem;
								}
							});
							res.push(item);
						});
					}

					_callback(_error, res);
				});
			break;
		case (/post/i.test(method)):
			delete data[model.__key];
			query
				.save(data)
				.exec(function (_error, _res) {
					if (!_error) {
						swapKeys(_res, fdbKey, model.__key);
					}
					_callback(_error, _res);
				});
			break;
		case (/put/i.test(method)):
			swapKeys(data, model.__key, fdbKey);

			var q = async.queue(function (_folderToRemove, _callback) {
				fs.remove(_folderToRemove, function () {
					_callback();
				});
			}, 5);

			q.drain = function () {
				query
					.save(data)
					.exec(function (_error, _res) {
						if (!_error) {
							swapKeys(_res, fdbKey, model.__key);
						}
						_callback(_error, _res);
					});
			}

			var destroyObjectsOrArrays = function (_path, _data) {
				var foundFolderToDestroy = false;
				Object.keys(_data).forEach(function (_key) {
					if (is.object(_data[_key]) || is.array(_data[_key])) {
						q.push(_path + '/' + _key);
						foundFolderToDestroy = true;
					}
				});
				if (foundFolderToDestroy === false) {
					q.drain();
				}
			};

			destroyObjectsOrArrays(path.resolve(process.cwd(), dbPath, model.__name, model[model.__key]), data);

			break;
		case (/delete/i.test(method)):
			var error,
				dbPathResolved = path.resolve(process.cwd(), dbPath, model.__name, model[model.__key]);

			fs.remove(dbPathResolved, function (_error) {
				_callback(error);
			});

			break;
		}

	});

}
