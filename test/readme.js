var Moldy = require('moldy'),
	should = require('should'),
	moldyFileAdapter = require('../src');

describe('moldy-file-adapter', function () {

	it('Tell `Moldy` to use the `file` adapter', function () {
		// Moldy.use( require('moldy-file-adapter') );
	});

	require('./readme/create');
	require('./readme/findOne');
	require('./readme/find');
	require('./readme/save');
	require('./readme/destroy');

});