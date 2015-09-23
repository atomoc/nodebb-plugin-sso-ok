(function(module) {
	"use strict";

	var User = module.parent.require('./user'),
		meta = module.parent.require('./meta'),
		db = module.parent.require('../src/database'),
		passport = module.parent.require('passport'),
  		passportOk = require('passport-ok').Strategy,
  		nconf = module.parent.require('nconf'),
        async = module.parent.require('async');

	var constants = Object.freeze({
		'name': "Ok",
		'admin': {
			'route': '/plugins/sso-ok',
			'icon': 'fa-odnoklassniki'
		}
	});

	var Ok = {};

	Ok.init = function(data, callback) {
		function render(req, res, next) {
			res.render('admin/plugins/sso-ok', {});
		}

		data.router.get('/admin/plugins/sso-ok', data.middleware.admin.buildHeader, render);
		data.router.get('/api/admin/plugins/sso-ok', render);

		callback();
	}

	Ok.getStrategy = function(strategies, callback) {
		meta.settings.get('sso-ok', function(err, settings) {
			if (!err && settings['id'] && settings['secret'] && settings['public']) {
				passport.use(new passportOk({
					clientID: settings['id'],
					clientPublic: settings['public'],
					clientSecret: settings['secret'],
					callbackURL: nconf.get('url') + '/auth/ok/callback'
				}, function(accessToken, refreshToken, profile, done) {
					var email = profile.emails.length > 0 
							? profile.emails[0].value
							: profile.id + '@ok.ru',
						picture = profile._json['photo_id']
							? profile._json['pic_2']
							: false;
					Ok.login(profile.id, profile.displayName, email, picture, function(err, user) {
						if (err) {
							return done(err);
						}
						done(null, user);
					});
				}));

				strategies.push({
					name: 'odnoklassniki',
					url: '/auth/ok',
					callbackURL: '/auth/ok/callback',
					icon: 'fa-key fa-odnoklassniki'/*,
					scope: 'email'*/
				});
			}

			callback(null, strategies);
		});
	};

	Ok.login = function(okid, handle, email, picture, callback) {
		Ok.getUidByOkId(okid, function(err, uid) {
			if(err) {
				return callback(err);
			}

			if (uid !== null) {
				// Existing User
				callback(null, {
					uid: uid
				});
			} else {
				// New User
				var success = function(uid) {
					meta.settings.get('sso-ok', function(err, settings) {
						var autoConfirm = settings && settings['autoconfirm'] === "on" ? 1 : 0;
						User.setUserField(uid, 'email:confirmed', autoConfirm);
						// Save ok-specific information to the user
						User.setUserField(uid, 'okid', okid);
						db.setObjectField('okid:uid', okid, uid);

						// Save their photo, if present
						if (picture) {
							User.setUserField(uid, 'uploadedpicture', picture);
							User.setUserField(uid, 'picture', picture);
						}

						callback(null, {
							uid: uid
						});

					});
				};

				User.getUidByEmail(email, function(err, uid) {
					if(err) {
						return callback(err);
					}

					if (!uid) {
						User.create({username: handle, email: email}, function(err, uid) {
							if(err) {
								return callback(err);
							}

							success(uid);
						});
					} else {
						success(uid); // Existing account -- merge
					}
				});
			}
		});
	};

	Ok.getUidByOkId = function(okid, callback) {
		db.getObjectField('okid:uid', okid, function(err, uid) {
			if (err) {
				return callback(err);
			}
			callback(null, uid);
		});
	};

	Ok.addMenuItem = function(custom_header, callback) {
		custom_header.authentication.push({
			"route": constants.admin.route,
			"icon": constants.admin.icon,
			"name": constants.name
		});

		callback(null, custom_header);
	}

	Ok.deleteUserData = function(uid, callback) {
		async.waterfall([
			async.apply(User.getUserField, uid, 'okid'),
			function(oAuthIdToDelete, next) {
				db.deleteObjectField('okid:uid', oAuthIdToDelete, next);
			}
		], function(err) {
			if (err) {
				winston.error('[sso-ok] Could not remove OAuthId data for uid ' + uid + '. Error: ' + err);
				return callback(err);
			}
			callback(null, uid);
		});
	};

	module.exports = Ok;
}(module));
