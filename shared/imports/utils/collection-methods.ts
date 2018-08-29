import method from './method';
import {Campaigns} from '../collections';
import generateSlug from './generate-slug';
import {Meteor} from 'meteor/meteor';

const validateAccess = (collection, data, userId, verb) => {
	if(!userId) {
		throw new Meteor.Error('not-logged-in', `Can't ${verb} something if you're not logged in`);
	}

	if(verb !== 'create') {
		if(!data) {
			throw new Meteor.Error('doc-doesnt-exist', `Can't ${verb} a document that doesn't exist`);
		}

		if(data.owner !== userId) {
			throw new Meteor.Error('doc-access-denied', `Can't ${verb} that document`);
		}
	}

	if(collection !== Campaigns) { // hmmm
		if(!data.campaignId) throw new Meteor.Error('campaign-missing', 'No campaign ID in data');

		const campaign = Campaigns.findOne(data.campaignId);
		if(!campaign || (campaign.owner !== userId && !campaign.member.includes(userId))) {
			throw new Meteor.Error('campaign-access-denied', `Can't ${verb} a document in that campaign`);
		}
	}
};

export default collection => {
	const baseCreate = method(`${collection._name}.create`, function(data) {
		// TODO validate data against card schema
		validateAccess(collection, data, this.userId, 'create');

		data.owner = this.userId;
		collection.insert(data);

		return data;
	});

	return {
		// HACK: generate slug before passing to method so it's consistent on client and server
		create: data => baseCreate(
			generateSlug(data)
		),

		update: method(`${collection._name}.update`, function({_id}, $set) {
			// TODO validate update against card schema
			const data = collection.findOne(_id);
			validateAccess(collection, data, this.userId, 'update');

			collection.update(_id, { $set });
		}),

		delete: method(`${collection._name}.delete`, function({_id}) {
			const data = collection.findOne(_id);
			validateAccess(collection, data, this.userId, 'delete');
			collection.remove(_id);
		}),
	};
};