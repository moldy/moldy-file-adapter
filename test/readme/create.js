var Moldy = require('moldy'),
	should = require('should');

describe('create', function () {

	before(function () {
		Moldy.use(require('../../src'));
	});

	after(function () {
		Moldy.useify.clear();
	});

	it('should `create` by a property', function (_done) {
		var personMoldy = new Moldy('person', {
			properties: {
				name: '',
				age: ''
			}
		});

		personMoldy.name = 'David';

		personMoldy.$save(function (_error) {

			personMoldy.name.should.eql('David');
			_done(_error);

		});
	});

});