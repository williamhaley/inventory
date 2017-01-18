var socket = new WebSocket('ws://' + window.location.hostname  + ':' + window.location.port, "protocolOne");

var templateVariables = {
	timezoneOffset: 300
};

var templates = {
	user: swig.compile($('#user').html()),
	equipment: swig.compile($('#equipment').html()),
	allUsers: swig.compile($('#allUsers').html()),
	allEquipment: swig.compile($('#allEquipment').html()),
	addEquipment: swig.compile($('#addEquipment').html()),
	addUser: swig.compile($('#addUser').html()),
	checkout: swig.compile($('#checkout').html()),
};

// idAttribute does NOT work like I'd expect.	I think it's weird to force the id implementation to change to _id
// I'd rather just override parse and set _id to id that way
//
// var App = new (
// 	Backbone.View.extend({
// 		Models: {},
// 		Collections: {},
// 		Views: {},
// 		start: function () {
// 			Backbone.history.start();
// 		},
// 		showNotice: function (text) {
// 			$('.notices').text(text).animate({
// 				top: '0px',
// 				bottom: 'auto'
// 			}, 400, function () {
// 				setTimeout(App.hideNotice, 1000)
// 			});
// 		},
// 		hideNotice: function () {
// 			$('.notices').animate({
// 				top: '-200px'
// 			}, 1000);
// 		}
// 	})
// )({
// 	el: document.body
// });
//
// var EquipmentCategories = {
// 	OTHER: {
// 		id: 0,
// 		text: 'Other'
// 	},
// 	CAMERA: {
// 		id: 1,
// 		text: 'Camera'
// 	},
// 	AUDIO: {
// 		id: 2,
// 		text: 'Audio'
// 	},
// 	LIGHTING: {
// 		id: 3,
// 		text: 'Lighting'
// 	},
// 	GRIP: {
// 		id: 4,
// 		text: 'Grip'
// 	},
// 	ACCESSORIES: {
// 		id: 5,
// 		text: 'Accessories'
// 	},
// 	getCategories: function () {
// 		return _.filter(EquipmentCategories, function (category) {
// 			return typeof category === 'object';
// 		});
// 	},
// 	getTextByID: function (id) {
// 		var result =	_.findWhere(this.getCategories(), {id: parseInt(id)});
// 		var text = 'Category Unknown';
// 		if (typeof(result) === 'object' && result.text) {
// 			text = result.text
// 		}
// 		return text;
// 	}
// }
//
// App.Models.Equipment = Backbone.Model.extend({
// 	url: 'equipment',
// 	defaults: function () {
// 		return {
// 			name: 'No name',
// 			note: ''
// 		};
// 	},
// 	addTag: function (tag) {
// 		var tags = this.get('tags');
// 		if (tags && _.indexOf(tags, tag) > -1) {
// 			return;
// 		}
// 		tags = tags || [];
// 		tags.push(tag);
// 		this.set({tags: tags});
// 		this.save();
// 	},
// 	deleteTag: function (tag) {
// 		if (confirm('Delete tag?')) {
// 			var tags = this.get('tags');
// 			var index = _.indexOf(tags, tag);
// 			if (tags && index > -1) {
// 				tags.splice(index, 1);
// 			}
// 			this.set({tags: tags});
// 			this.save();
// 		}
// 	},
// 	parse: function (response) {
// 		response.id = response._id;
// 		delete response._id;
// 		return response;
// 	},
// 	toJSON: function () {
// 		var attributes = _.clone(this.attributes);
// 		attributes._id = attributes.id;
// 		delete attributes.id;
// 		return attributes;
// 	}
// });
//
// App.Models.User = Backbone.Model.extend({
// 	url: 'user',
// 	defaults: function () {
// 		return {
// 			name: 'No name'
// 		};
// 	},
// 	parse: function (response) {
// 		response.id = response._id;
// 		delete response._id;
// 		return response;
// 	},
// 	toJSON: function () {
// 		var attributes = _.clone(this.attributes);
// 		attributes._id = attributes.id;
// 		delete attributes.id;
// 		return attributes;
// 	}
// });
//
// App.Collections.Equipment = Backbone.Collection.extend({
// 	initialize: function (options) {
// 		this.tag = options ? options.tag : null,
// 		this.category = options ? options.category : null
// 	},
// 	model: App.Models.Equipment,
// 	url: 'allEquipment'
// });
//
// App.Collections.Users = Backbone.Collection.extend({
// 	model: App.Models.User,
// 	url: 'users'
// });
//
// App.Views.AllEquipment = Backbone.View.extend({
//
// 	className: 'all equipment',
//
// 	initialize: function () {
// 		this.collection.on('reset', this.render, this);
// 	},
//
// 	events: {
// 		'click button[name="add"]': 'addEquipment',
// 		'click button[name="checkout"]': 'checkoutEquipment',
// 		'change input[type="checkbox"]': 'checkboxChanged'
// 	},
//
// 	checkboxChanged: function () {
// 		var $checkout = this.$el.find('button[name="checkout"]');
// 		if (this.$el.find('input[type="checkbox"]:checked').length > 0) {
// 			$checkout.removeAttr('disabled');
// 		} else {
// 			$checkout.attr('disabled', 'disabled');
// 		}
// 	},
//
// 	checkoutEquipment: function () {
// 		var ids = [];
// 		this.$el.find('input[type="checkbox"]:checked').each(function (index, element) {
// 			ids.push($(element).val());
// 		});
// 		var url = ['equipment', 'checkout', ids.join(',')].join('/');
// 		Backbone.history.navigate(url, {
// 			trigger: true
// 		});	},
//
// 	addEquipment: function () {
// 		Backbone.history.navigate('equipment/add', {
// 			trigger: true
// 		});
// 	},
// 	render: function () {
// 		var allEquipment = [];
// 		this.collection.forEach(function (equipment) {
// 			allEquipment.push(equipment.attributes);
// 		}, this);
//
// 		// TODO is this right for the tag?	Should I access directly in the tpl?
// 		this.$el.html(templates.allEquipment({
// 			equipmentByCategory: _.groupBy(allEquipment, 'category'),
// 			tag: this.collection.tag,
// 			category: this.collection.category
// 		}));
// 	}
// });
//
// App.Views.AddEquipment = Backbone.View.extend({
// 	className: 'equipment',
// 	initialize: function (options) {
// 		this.template = templates.addEquipment;
// 		this.model.on('change', this.render, this);
// 	},
// 	events: {
// 		'submit form': 'save'
// 	},
//
// 	save: function (event) {
// 		var name = this.$('input[name="name"]').val();
// 		var note = this.$('textarea[name="note"]').val();
// 		var category = this.$('select[name="category"]').val();
//
// 		this.model.save({
// 			name: name,
// 			note: note,
// 			category: category
// 		}, {
// 			success: function(model, response, options) {
// 				App.showNotice('Equipment Added');
// 			}, error: function(model, xhr, options) {
// 				var errors = JSON.parse(xhr.responseText).errors;
// 				App.showNotice('Error: ' + errors);
// 			}
// 		});
// 	},
// 	render: function () {
// 		this.$el.html(this.template({
// 			equipment: this.model.attributes
// 		}));
// 	}
// })
//
// App.Views.Equipment = Backbone.View.extend({
// 	className: 'equipment',
// 	initialize: function (options) {
// 		this.users = options.users;
// 		this.template = options.template;
// 		this.model.on('change', this.render, this);
// 	},
//
// 	events: {
// 		'submit form': 'save',
// 		'click button[name="save"]': 'save',
// 		'click button[name="delete"]': 'delete',
// 		'click button[name="return"]': 'return',
// 		'click button[name="checkout"]': 'showCheckout',
// 		'click .tag .delete': 'deleteTag',
// 		'click .tagAutocomplete li': 'suggestionClicked',
// 		'keyup input[name="tags"]': 'lookupTags',
// 	},
//
// 	lookupTags: function (event) {
// 		var code = event.keyCode || event.which;
// 		var $input = $(event.target);
// 		var query = $input.val();
//
// 		// 13 = enter/return
// 		if (code === 13) {
// 			this.saveTag($input);
// 		} else if (query.length >= 1) {
// 			var self = this;
// 			socket.emit('getTag', query, function (err, result) {
// 				self.onSuggestionQueryDone(err, result);
// 			});
// 		} else {
// 			this.hideTagSuggestions();
// 		}
// 		return true;
// 	},
//
// 	// TODO blur fires, suggestions hide, click never fires.	Need to figure this out
// 	focusLost: function (event) {
// 		this.saveTag($(event.target));
// 	},
//
// 	saveTag: function ($input) {
// 		var tag = $input.val();
// 		if (tag.length < 1) {
// 			return;
// 		}
// 		$input.val('');
// 		this.model.addTag(tag);
// 		this.render();
// 	},
//
// 	onSuggestionQueryDone: function (err, result) {
// 		if (err) {
// 			//
// 		}
// 		if (result.length > 0) {
// 			var suggestions = _.pluck(result, 'tag');
// 			this.showTagSuggestions(suggestions);
// 		} else {
// 			this.hideTagSuggestions();
// 		}
// 	},
//
// 	hideTagSuggestions: function () {
// 		var $tagSuggestions = $('.tagAutocomplete');
// 		$tagSuggestions.empty();
// 	},
//
// 	showTagSuggestions: function (suggestions) {
// 		var $tagSuggestions = $('.tagAutocomplete');
//
// 		var $list = $('<ul>');
// 		suggestions.forEach(function (element, index) {
// 			$item = $('<li>').text(element);
// 			$list.append($item);
// 		})
// 		$tagSuggestions.html($list);
// 	},
//
// 	showCheckout: function () {
// 		var url = ['equipment', 'checkout', this.model.id].join('/');
// 		Backbone.history.navigate(url, {
// 			trigger: true
// 		});
// 	},
//
// 	suggestionClicked: function (event) {
// 		var tag = $(event.target).text();
// 		this.model.addTag(tag);
// 		socket.emit('addTag', tag);
// 		this.render();
// 	},
//
// 	deleteTag: function (event) {
// 		var $tag = $(event.target).closest('.tag');
// 		this.model.deleteTag($tag.find('.content').text());
// 		this.render();
// 	},
//
// 	save: function (event) {
// 		event.preventDefault();
// 		var name = this.$('input[name="name"]').val();
// 		var note = this.$('textarea[name="note"]').val();
// 		var category = this.$('select[name="category"]').val();
// 		this.model.save({
// 			name: name,
// 			note: note,
// 			category: category
// 		}, {
// 			success: function(model, response, options) {
// 				App.showNotice('Equipment Saved');
// 			}, error: function(model, xhr, options) {
// 				var errors = JSON.parse(xhr.responseText).errors;
// 				App.showNotice('Error: ' + errors);
// 			}
// 		});
// 	},
//
// 	delete: function (event) {
// 		if (confirm('Delete Equipment?')) {
// 			this.model.destroy({
// 				success: function(model, response, options) {
// 					App.showNotice('Equipment Deleted');
// 					Backbone.history.navigate('', { trigger: true });
// 				}, error: function(model, xhr, options) {
// 					var errors = JSON.parse(xhr.responseText).errors;
// 					App.showNotice('Error: ' + errors);
// 				}
// 			});
// 		}
// 	},
//
// 	return: function (event) {
// 		if (confirm('Return Equipment?')) {
// 			socket.emit('equipment:return', this.model.attributes.id, function (err) {
// 				if (err) {
// 					App.showNotice('Error returning equipment');
// 					return;
// 				}
// 				App.showNotice('Equipment Returned');
// 				Backbone.history.navigate('', { trigger: true });
// 			});
// 		}
// 	},
// 	render: function () {
// 		var user = this.users ? this.users.get(this.model.get('userId')) : null;
// 		var allHistory = _.map(this.model.get('history'), function (modelHistory) {
// 			var history = _.clone(modelHistory);
// 			var user = this.users.get(history.userId);
// 			history.userName = user ? user.get('name') : 'User no long exists';
// 			return history;
// 		}, this)
// 		allHistory.reverse();
// 		this.$el.html(this.template({
// 			equipment: this.model.attributes,
// 			user: user ? user.attributes : null,
// 			categories: EquipmentCategories.getCategories(),
// 			allHistory: allHistory
// 		}));
// 	}
// });
//
// App.Views.CheckoutEquipment = Backbone.View.extend({
// 	className: 'equipment checkout',
// 	events: {
// 		submit: 'checkout'
// 	},
// 	initialize: function (options) {
// 		this.users = options.users;
// 		this.collection.on('reset', this.render, this);
// 		thing = this.collection;
// 	},
// 	checkout: function (event) {
// 		event.preventDefault();
// 		var date = this.$('input[name="expectedReturnDate"]').val();
// 		var time = this.$('input[name="expectedReturnTime"]').val();
// 		var expectedReturnDate = new Date(date + ' ' + time);
// 		var userId = this.$('select[name="user"] :selected').val();
//
// 		var ids = this.collection.pluck('id');
//
// 		socket.emit('equipment:checkout', {
// 			expectedReturnDate: expectedReturnDate,
// 			userId: userId,
// 			equipmentIds: ids
// 		}, function (err) {
// 			if (err) {
// 				App.showNotice('Error: checkout failed');
// 			} else {
// 				App.showNotice('Equipment Checked Out');
// 				Backbone.history.navigate('', { trigger: true });
// 			}
// 		});
// 	},
// 	zeroFill: function (n) {
// 		return n < 10 ? '0' + n : '' + n;
// 	},
// 	getDate: function () {
// 		var date = new Date();
// 		var month = this.zeroFill(date.getMonth() + 1);
// 		var year = date.getFullYear();
// 		// duplicate var name.	Dumb, or maybe English is dumb
// 		var date = this.zeroFill(date.getDate());
// 		return [year, month, date].join('-');
// 	},
// 	render: function () {
// 		var allUsers = [];
// 		this.users.forEach(function (user) {
// 			allUsers.push(user.attributes);
// 		}, this);
// 		// filter out any equipment that's checked out in case user copied/pasted a URL TODO
// 		var allEquipment = this.collection.map(function (equipment) {
// 			return equipment.attributes;
// 		});
// 		this.$el.html(templates.checkout({
// 			minDate: this.getDate(),
// 			allEquipment: allEquipment,
// 			users: allUsers
// 		}));
// 	}
// });
//
// App.Views.Users = Backbone.View.extend({
//
// 	className: 'all',
//
// 	initialize: function () {
// 		this.collection.on('reset', this.render, this);
// 	},
//
// 	events: {
// 		'click button[name="add"]': 'addUser'
// 	},
//
// 	addUser: function () {
// 		Backbone.history.navigate('users/add', {
// 			trigger: true
// 		});
// 	},
//
// 	render: function () {
// 		var users = [];
// 		this.collection.forEach(function (user) {
// 			users.push(user.attributes);
// 		}, this);
// 		this.$el.html(templates.allUsers({
// 			users: users
// 		}));
// 	}
// });
//
// App.Views.AddUser = Backbone.View.extend({
// 	className: 'user',
// 	events: {
// 		'submit form': 'save',
// 	},
// 	initialize: function (options) {
// 		this.template = templates.addUser;
// 		this.model.on('change', this.render, this);
// 	},
// 	save: function (event) {
// 		event.preventDefault();
//
// 		var name = this.$('input[name="name"]').val();
// 		if (name === this.model.get('name')) {
// 			return;
// 		}
//
// 		this.model.save({
// 			name: name
// 		}, {
// 			success: function(model, response, options) {
// 				App.showNotice('User Added');
// 				Backbone.history.navigate('users', { trigger: true });
// 			}, error: function(model, xhr, options) {
// 				var errors = JSON.parse(xhr.responseText).errors;
// 				App.showNotice('Error: ' + errors);
// 			}
// 		});
// 	},
// 	render: function () {
// 		this.$el.html(this.template({
// 			user: this.model.attributes
// 		}));
// 	}
// })
//
// App.Views.User = Backbone.View.extend({
// 	className: 'user',
// 	events: {
// 		'submit form': 'save',
// 		'click button[name="delete"]': 'delete'
// 	},
// 	initialize: function (options) {
// 		this.template = templates.user;
// 		this.model.on('change', this.render, this);
// 		this.equipment = options.equipment;
// 	},
// 	save: function (event) {
// 		event.preventDefault();
//
// 		var name = this.$('input[name="name"]').val();
// 		if (name === this.model.get('name')) {
// 			return;
// 		}
//
// 		this.model.save({
// 			name: name
// 		}, {
// 			success: function(model, response, options) {
// 				var url = 'users/' + model.get('id');
// 				App.showNotice('User Saved');
// 				Backbone.history.navigate(url, { trigger: true });
// 			}, error: function(model, xhr, options) {
// 				var errors = JSON.parse(xhr.responseText).errors;
// 				App.showNotice('Error: ' + errors);
// 			}
// 		});
// 	},
// 	delete: function (event) {
// 		if (confirm('Delete user?')) {
// 			this.model.destroy({
// 				success: function(model, response, options) {
// 					App.showNotice('User Deleted');
// 					Backbone.history.navigate('users', { trigger: true });
// 				}, error: function(model, xhr, options) {
// 					var errors = JSON.parse(xhr.responseText).errors;
// 					App.showNotice('Error: ' + errors);
// 				}
// 			});
// 		}
// 	},
// 	render: function () {
// 		// interesting.	I want to show equipment for a user.	Do we need to fetch equipment using some custom API?
// 		// or do we...I don't know...pass a reference to the collection into this view?
// 		// As long as we have one global collection for equipment, wouldn't it be fine?
// 		// Speaking of...do we know if it's always staying up to date?
// 		// TODO
//
// 		var equipmentForUser = this.equipment.where({userId: this.model.get('id')}).map(function (equipment) {
// 			return equipment.attributes;
// 		});
//
// 		this.$el.html(this.template({
// 			user: this.model.attributes,
// 			equipment: equipmentForUser
// 		}));
// 	}
// });
//
// function isMongoID(id) {
// 	if (! id) {
// 		return false;
// 	}
// 	var matches = id.match(/^[0-9a-fA-F]{24}$/);
// 	return matches && matches.length > 0;
// }
//
// App.Router = new (Backbone.Router.extend({
//
// 	routes: {
// 		'': 'indexEquipment',
// 		'equipment': 'indexEquipment',
// 		'equipment/add': 'addEquipment',
// 		'equipment/tag/:tag': 'showEquipmentByTag',
// 		'equipment/category/:category': 'showEquipmentByCategory',
// 		'equipment/checkout/:id': 'checkoutEquipment',
// 		'equipment/:id': 'showEquipment',
// 		'users': 'indexUsers',
// 		'users/add': 'addUser',
// 		'users/:id': 'showUser',
// 	},
//
// 	initialize: function (options) {
// 		// TODO I want to attach some listeners to these collections
// 		// I want to see that they're actually keeping up to speed with the adds and deletes
// 		// As long as they are, I feel safe referencing them locally and not constantly worrying
// 		// about fetching and keeping in sync with server
// 		this.users = new App.Collections.Users();
// 		this.users.fetch();
// 		this.equipment = new App.Collections.Equipment();
// 		this.equipment.fetch();
// 	},
//
// 	indexUsers: function () {
// 		var usersView = new App.Views.Users({collection: this.users});
// 		document.title = 'All Users';
// 		// is this a good idea?
// 		// http://stackoverflow.com/questions/13578900/debugging-backbone-js-rendering-after-collection-fetch
// 		this.users.fetch({
// 			reset: true
// 		});
// 		$('#content').html(usersView.$el)
// 	},
//
// 	indexEquipment: function () {
// 		document.title = 'All Equipment';
// 		var equipmentView = new App.Views.AllEquipment({collection: this.equipment});
// 		this.equipment.fetch({
// 			reset: true
// 		});
// 		$('#content').html(equipmentView.$el)
// 	},
//
// 	addUser: function () {
// 		document.title = 'Add User';
// 		var user = new App.Models.User();
// 		var userView = new App.Views.AddUser({
// 			model: user
// 		});
// 		userView.render();
// 		$('#content').html(userView.$el)
// 	},
//
// 	showUser: function (id) {
// 		document.title = 'User';
// 		var user = new App.Models.User({'id': id});
// 		var userView = new App.Views.User({
// 			model: user,
// 			equipment: this.equipment
// 		});
// 		user.fetch();
// 		// need to call user.render() explicitly.	If the id is invalid 'change' would never fire and so it would never render otherwise...interesting
// 		// or is it better...this way?	render never fires because the data is never synched?
// 		userView.render();
// 		$('#content').html(userView.$el)
// 	},
//
// 	addEquipment: function () {
// 		document.title = 'Add Equipment';
// 		var equipment = new App.Models.Equipment({name: '', note: ''});
// 		var equipmentView = new App.Views.AddEquipment({
// 			model: equipment
// 		});
// 		equipmentView.render();
// 		// pretty important to do this so events bound per instance.	Otherwise zombie views hold events.	Huge pain
// 		// Another issue, zombie views exist.	Need way to clean them up.
// 		// https://coderwall.com/p/jrnuiw
// 		// http://stackoverflow.com/questions/11202707/backbone-bind-event-fired-multiple-times
// 		$('#content').html(equipmentView.$el)
// 	},
//
// 	showEquipment: function (id) {
// 		document.title = 'Equipment';
// 		var equipment = new App.Models.Equipment({'id': id});
// 		var equipmentView = new App.Views.Equipment({
// 			model: equipment,
// 			template: templates.equipment,
// 			users: this.users
// 		});
// 		equipment.fetch();
// 		equipmentView.render()
// 		$('#content').html(equipmentView.$el)
// 	},
//
// 	// TODO I feel like I don't yet understand wthe appropriate lifecycle for views, collections
// 	// should this be created in the ctor and updated?	Set/unset tag?	Meh, this seems to work fine for now
// 	// This project runs local and it's fast enough that I don't think it matters at this stage
// 	showEquipmentByTag: function (tag) {
// 		document.title = 'Equipment - ' + tag;
// 		var equipment = new App.Collections.Equipment({
// 			tag: tag
// 		});
// 		var equipmentView = new App.Views.AllEquipment({collection: equipment});
// 		equipment.fetch({
// 			data: {
// 				tag: tag
// 			},
// 			reset: true
// 		});
// 		$('#content').html(equipmentView.$el)
// 	},
//
// 	showEquipmentByCategory: function (category) {
// 		document.title = 'Equipment - ' + EquipmentCategories.getTextByID(category);
// 		var equipment = new App.Collections.Equipment({
// 			category: category
// 		});
// 		var equipmentView = new App.Views.AllEquipment({collection: equipment});
// 		equipment.fetch({
// 			data: {
// 				category: category
// 			},
// 			reset: true
// 		});
// 		$('#content').html(equipmentView.$el)
// 	},
//
// 	checkoutEquipment: function (ids) {
// 		document.title = 'Checkout';
// 		var equipment = new App.Collections.Equipment();
// 		var checkoutEquipmentView = new App.Views.CheckoutEquipment({
// 			collection: equipment,
// 			users: this.users
// 		});
// 		equipment.fetch({
// 			data: {
// 				ids: ids.split(',')
// 			},
// 			reset: true,
// 			success: function () {
// 				console.log('success');
// 				console.log(equipment.length);
// 			}
// 		});
// 		$('#content').html(checkoutEquipmentView.$el)
// 	}
//
// }))
//
// $(function(){ App.start(); })
