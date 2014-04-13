# TOC
   - [moldy-file-adapter](#moldy-file-adapter)
     - [create](#moldy-file-adapter-create)
     - [get](#moldy-file-adapter-get)
     - [collection](#moldy-file-adapter-collection)
     - [save](#moldy-file-adapter-save)
     - [destroy](#moldy-file-adapter-destroy)
<a name=""></a>
 
<a name="moldy-file-adapter"></a>
# moldy-file-adapter
Tell `Moldy` to use the `file` adapter.

```js
// Moldy.use( require('moldy-file-adapter') );
```

<a name="moldy-file-adapter-create"></a>
## create
should `create` by a property.

```js
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
```

<a name="moldy-file-adapter-get"></a>
## get
define a JSON schema.

```js
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
```

should create a new person so we can `get` it next.

```js
var personMoldy = new Moldy('person', schema);
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
```

should `get` by a `id` from the previous example.

```js
var personMoldy = new Moldy('person', schema);

personMoldy.$get({
	id: newPersonId
}, function (_error, david) {
	if (_error) {
		return _done(_error);
	}
	david.name.should.eql('Mr David');
	david.friends.should.be.an.Array.and.have.a.lengthOf(2);
	david.friends[0].name.should.equal('leonie');
	david.friends[0].age.should.equal(33);
	david.friends[1].name.should.equal('max');
	david.friends[1].age.should.equal(0);
	david.$destroy(_done);
});
```

<a name="moldy-file-adapter-collection"></a>
## collection
should `get` a `collection`.

```js
var personMoldy = new Moldy('person', {
	properties: {
		name: 'string',
		age: 'number'
	}
});
personMoldy.$collection(function (_error, _people) {
	if (_error) {
		return _done(_error);
	}
	_people.should.be.an.Array;
	_people.length.should.greaterThan(0);
	_people.forEach(function (_person) {
		_person.should.be.a.Moldy;
		_person.should.have.a.property('id');
		_person.should.have.a.property('name');
		_person.should.have.a.property('age');
		Object.keys(_person.$json()).should.have.a.lengthOf(3);
	});
	_done();
});
```

<a name="moldy-file-adapter-save"></a>
## save
create a schema.

```js
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
```

should `save` a model.

```js
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
```

<a name="moldy-file-adapter-destroy"></a>
## destroy
define a JSON schema.

```js
schema = {
	properties: {
		name: 'string'
	}
};
```

should `destroy` all the models.

```js
var personMoldy = new Moldy('person', schema);
personMoldy.$collection(function (_error, _guys) {
	_guys.length.should.be.greaterThan(0);
	var deleteGuy = function (_guy) {
		personMoldy.$collection(function (_error, _guys) {
			if (_guys.length === 0) {
				return _done();
			}
			var guy = new Moldy('person', schema);
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
```

