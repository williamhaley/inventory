App.Models.Equipment = Backbone.Model.extend({
	url: 'equipment',
	defaults: function () {
		return {
			name: 'No name',
			note: ''
		};
	},
	addTag: function (tag) {
		var tags = this.get('tags');
		if (tags && _.indexOf(tags, tag) > -1) {
			return;
		}
		tags = tags || [];
		tags.push(tag);
		this.set({tags: tags});
		this.save();
	},
	deleteTag: function (tag) {
		if (confirm('Delete tag?')) {
			var tags = this.get('tags');
			var index = _.indexOf(tags, tag);
			if (tags && index > -1) {
				tags.splice(index, 1);
			}
			this.set({tags: tags});
			this.save();
		}
	},
	parse: function (response) {
		response.id = response._id;
		delete response._id;
		return response;
	},
	toJSON: function () {
		var attributes = _.clone(this.attributes);
		attributes._id = attributes.id;
		delete attributes.id;
		return attributes;
	}
});

App.Models.User = Backbone.Model.extend({
	url: 'user',
	defaults: function () {
		return {
			name: 'No name'
		};
	},
	parse: function (response) {
		response.id = response._id;
		delete response._id;
		return response;
	},
	toJSON: function () {
		var attributes = _.clone(this.attributes);
		attributes._id = attributes.id;
		delete attributes.id;
		return attributes;
	}
});