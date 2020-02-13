import { Meteor } from 'meteor/meteor';
import { Match, check } from 'meteor/check';

import { CustomUserStatus } from '../../../models';
import { API } from '../api';
import { findCustomUserStatus } from '../lib/custom-user-status';

@@ -16,3 +20,69 @@ API.v1.addRoute('custom-user-status.list', { authRequired: true }, {
		})));
	},
});

API.v1.addRoute('custom-user-status.create', { authRequired: true }, {
	post() {
		check(this.bodyParams, {
			name: String,
			statusType: Match.Maybe(String),
		});

		const userStatusData = {
			name: this.bodyParams.name,
			statusType: this.bodyParams.statusType,
		};

		Meteor.runAsUser(this.userId, () => {
			Meteor.call('insertOrUpdateUserStatus', userStatusData);
		});

		return API.v1.success({
			customUserStatus: CustomUserStatus.findOneByName(userStatusData.name),
		});
	},
});

API.v1.addRoute('custom-user-status.delete', { authRequired: true }, {
	post() {
		const { customUserStatusId } = this.bodyParams;
		if (!customUserStatusId) {
			return API.v1.failure('The "customUserStatusId" params is required!');
		}

		Meteor.runAsUser(this.userId, () => Meteor.call('deleteCustomUserStatus', customUserStatusId));

		return API.v1.success();
	},
});

