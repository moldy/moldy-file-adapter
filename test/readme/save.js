var Moldy = require('moldy'),
	should = require('should');

describe('save', function () {
	var schema,
		key;

	before(function () {
		Moldy.use(require('../../src'));
	});

	after(function () {
		Moldy.useify.clear();
	});

	it('create a schema', function () {
		schema = {
			properties: {
				name: 'string',
				age: {
					type: 'number',
					default: 0
				},
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
		var personMoldy = Moldy.extend('person', schema);

		personMoldy.$findOne(function (_error, _person) {

			if (_error) {
				return _done(_error);
			}

			var person = _person;

			key = person.id;
			person.name = 'Mr David';
			person.friends.push({
				name: 'leonie'
			});
			person.friends.push({
				name: 'max'
			});
			person.friends.push({
				name: 'david'
			});

			person.$save(function (_error) {

				if (_error) {
					return _done(_error);
				}

				var newPersonMoldy = Moldy.extend('person', schema);

				newPersonMoldy.$findOne({
					id: key
				}, function (_error, newPerson) {

					newPerson.id.should.equal(key);
					newPerson.friends.splice(1, 1);

					newPerson.$save(function (_error) {
						if (_error) {
							return _done(_error);
						}

						var newNewPersonMoldy = Moldy.extend('person', schema);

						newNewPersonMoldy.$findOne({
							id: key
						}, function (_error, _newNewPersonMoldy) {
							_newNewPersonMoldy.friends.should.have.a.lengthOf(2);
							_newNewPersonMoldy.friends[1].name.should.equal('david');
							_done();
						});
					});

				});

			});

		});
	});

});