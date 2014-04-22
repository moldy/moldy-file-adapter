var Moldy = require('moldy'),
	should = require('should');

describe('destroy', function () {
	var guys,
		schema;

	it('define a JSON schema', function () {
		schema = {
			properties: {
				name: 'string'
			}
		};
	});

	it('should `destroy` all the models', function (_done) {
		var personMoldy = Moldy.create('person', schema);

		personMoldy.$collection(function (_error, _guys) {

			_guys.length.should.be.greaterThan(0);

			var deleteGuy = function (_guy) {

				personMoldy.$collection(function (_error, _guys) {

					if (_guys.length === 0) {
						return _done();
					}

					var guy = Moldy.create('person', schema);

					guy.$get({
						id: _guys[0].id
					}, function (_error) {
						if (_error) {
							return _done(_error);
						}
						guy.$destroy(function (_error) {
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
