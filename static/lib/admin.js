define('admin/plugins/sso-ok', ['settings'], function(Settings) {
	'use strict';
	/* globals $, app, socket, require */

	var ACP = {};

	ACP.init = function() {
		Settings.load('sso-ok', $('.sso-ok-settings'));

		$('#save').on('click', function() {
			Settings.save('sso-ok', $('.sso-ok-settings'), function() {
				app.alert({
					type: 'success',
					alert_id: 'sso-ok-saved',
					title: 'Settings Saved',
					message: 'Please reload your NodeBB to apply these settings',
					clickfn: function() {
						socket.emit('admin.reload');
					}
				});
			});
		});
	};

	return ACP;
});