var cast = require('sc-cast'),
	fdb = require('file-db'),
	fs = require('fs-extra'),
	hasKey = require('sc-haskey'),
	is = require('sc-is'),
	_ = require('underscore'),
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

	fdb.open('.tmp/moldy-db', function (_error, _db) {
		var query = _db.use(model.__name);

		switch (true) {
		case (/get/i.test(method)):
			query
				.find()
				.exec(function (_error, _res) {

					if (!_error) {
						swapKeys(data, model.__key, fdbKey);
						_res = _.where(_res, data || {});
						_res.forEach(function (_item) {
							swapKeys(_item, fdbKey, model.__key);
						});
					}

					_callback(_error, _res);
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
			query
				.save(data)
				.exec(function (_error, _res) {
					if (!_error) {
						swapKeys(_res, fdbKey, model.__key);
					}
					_callback(_error, _res);
				});
			break;
		case (/delete/i.test(method)):
			var error;

			fs.remove(__dirname + '/../.tmp/moldy-db/' + model.__name + '/' + model[model.__key], function (_error) {
				_callback(error);
			});

			break;
		}

	});

}