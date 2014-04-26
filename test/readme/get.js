var Moldy = require('moldy'),
	should = require('should');

describe('get', function () {
	var newPersonId,
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
				name: 'string',
				friends: [{
					keyless: true,
					properties: {
						name: {
							type: 'string',
							default: ''
						},
						age: {
							type: 'number',
							default: 0
						}
					}
				}]
			}
		};
	});

	it('should create a new person so we can `get` it next', function (_done) {
		var personMoldy = Moldy.extend('person', schema).create();

		personMoldy.name = 'Mr David';

		personMoldy.friends.push({
			name: 'leonie'
		});

		personMoldy.friends[0].age = ' 33';

		personMoldy.friends.push({
			name: 'max'
		});

		personMoldy.$save(function (_error) {
			newPersonId = personMoldy.id;
			_done(_error);
		});
	});

	it('should `get` by a `id` from the previous example', function (_done) {
		var personMoldy = Moldy.extend('person', schema);

		personMoldy.$get({
			id: newPersonId
		}, function (_error, _david) {

			if (_error) {
				return _done(_error);
			}

			var david = _david[0];

			david.name.should.eql('Mr David');
			david.friends.should.be.an.Array.and.have.a.lengthOf(2);
			david.friends[0].name.should.equal('leonie');
			david.friends[0].age.should.equal(33);
			david.friends[1].name.should.equal('max');
			david.friends[1].age.should.equal(0);
			david.$destroy(_done);

		});
	});

});