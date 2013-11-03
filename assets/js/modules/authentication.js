angular.module("app", []).factory("authentication", ['$http', '$document', '$rootScope', function (http, doc, rootScope) {
	return {
		/*
		isAuthenticated: function () {
			return this.getClientId() != null;
		},
		clientId: null,
		clientName: null,
		homeAddress: null,
		client: null,*/
		ticket: null,
		user: null,
		remember: null,
		getUser: function () {
			if (!this.user) {
				var userInfo = $.cookie('user');
				if (userInfo) {
					var u = JSON.parse(userInfo);
					this.user = u.user;
					this.ticket = u.ticket;
				}
			}
			return this.user;
		},
		saveUserToCookie: function () {
			var config = {path: "/"};
			if (this.remember)
				config.expires = 30;
			$.cookie('user', JSON.stringify({ticket: this.ticket, user: this.user}), config);
		},
		signin: function (username, password, remember, onSuccess, onFail) {
			var self = this;
			this.remember = remember;
			http.post(apiUrl + '/authentication', { "username": username, "password": password })
				.success(function (data, status, headers, config) {
					self.ticket = data.ticket;
					self.saveUserToCookie();
					self.requestUserInfo(onSuccess, onFail);
				})
				.error(function (data, status, headers, config) {
					if (onFail) onFail(data, status, headers);
				});
		},
		requestUserInfo: function (onSuccess, onFail) {
			var self = this;
			http.get(apiUrl + '/user', { headers: { "X-Auth-Ticket": this.ticket } })
				.success(function (data, status, headers, config) {
					self.user = data;
					self.saveUserToCookie();
					rootScope.$emit('userAuthenticated');
					if (onSuccess) onSuccess();
				})
				.error(function (data, status, headers, config) {
					if (onFail) onFail(data, status, headers);
				});
		},
		logout: function () {
			doc[0].cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
			this.ticket = null;
			this.user = null;
		}
	};
}]);