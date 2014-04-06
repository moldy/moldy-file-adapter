var Moldy = require('moldy'),
	should = require('should'),
	moldyAdapterAjax = require('../src');

Moldy.use(require('../src'));

describe('moldy-adapter-file', function () {

	it('Tell `Moldy` to use the `file` adapter', function () {
		// Moldy.use( 'adapter', moldyAdapterAjax );
	});

	require('./readme.create');
	require('./readme.get');
	require('./readme.collection');
	require('./readme.save');
	require('./readme.destroy');

});