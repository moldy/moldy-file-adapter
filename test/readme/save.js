var Moldy = require('moldy'),
	should = require('should');

describe('save', function () {
	var schema,
		key;

	it('create a schema', function () {
		schema = {
			properties: {
				name: 'string',
				age: 'number',
				friends: [{
					keyless: true,
					properties: {
						name: {
							type: 'string',
							default: ''
						},
						age: {
							type: 'number',
							default: ''
						}
					}
				}]
			}
		};
	});

	it('should `save` a model', function (_done) {
		var personMoldy = new Moldy('person', schema);

		personMoldy.$get(function (_error) {

			if (_error) {
				return _done(_error);
			}

			key = personMoldy.id;
			personMoldy.name = 'Mr David';
			personMoldy.friends.push({
				name: 'leonie'
			});
			personMoldy.friends.push({
				name: 'max'
			});
			personMoldy.friends.push({
				name: 'david'
			});

			personMoldy.$save(function (_error) {

				if (_error) {
					return _done(_error);
				}

				var newPersonMoldy = new Moldy('person', schema);

				newPersonMoldy.$get({
					id: key
				}, function (_error) {

					newPersonMoldy.id.should.equal(key);
					newPersonMoldy.friends.splice(1, 1);

					newPersonMoldy.$save(function (_error) {
						if (_error) {
							return _done(_error);
						}

						var newNewPersonMoldy = new Moldy('person', schema);

						newNewPersonMoldy.$get({
							id: key
						}, function (_error) {
							newNewPersonMoldy.friends.should.have.a.lengthOf(2);
							newNewPersonMoldy.friends[1].name.should.equal('david');
							_done();
						});
					});

				});

			});

		});
	});

});