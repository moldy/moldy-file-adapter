var Moldy = require('moldy'),
	should = require('should');

describe('destroy', function () {
	var guys,
		schema;

	before(function () {
		Moldy.use(require('../../src'));
	});

	after(function () {
		Moldy.useify.clear();
	});

	it('define a JSON schema', function () {
		schema = {
			properties: {
				name: 'string'
			}
		};
	});

	it('should `destroy` all the models', function (_done) {
		var personMoldy = Moldy.extend('person', schema);

		personMoldy.$collection(function (_error, _guys) {

			_guys.length.should.be.greaterThan(0);

			var deleteGuy = function (_guy) {

				personMoldy.$collection(function (_error, _guys) {

					if (_guys.length === 0) {
						return _done();
					}

					var guy = Moldy.extend('person', schema);

					guy.$get({
						id: _guys[0].id
					}, function (_error, _guy) {
						if (_error) {
							return _done(_error);
						}
						_guy[0].$destroy(function (_error) {
							if (_error) {
								return _done(_error);
							}
							deleteGuy();
						});

					});

				});

			};

			deleteGuy();

		});

	});

});
