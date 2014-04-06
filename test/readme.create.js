var Moldy = require('moldy'),
	should = require('should');

describe('create', function () {

	it('should `create` by a property', function (_done) {
		var personMoldy = new Moldy('person', {
			properties: {
				name: '',
				age: ''
			}
		});

		personMoldy.name = 'David';

		personMoldy.$save(function (_error, _david) {

			if (_error) {
				return _done(_error);
			}

			_david.name.should.eql('David');
			_done();

		});
	});

});