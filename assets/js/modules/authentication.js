angular.module("app").factory("authentication", ['$http', '$rootScope', 'userInfoService', function (http, rootScope, userInfoService) {
	return {
		remember: null,
		getUser: function () {
			return userInfoService.getUser();
		},
		isAuthenticated: function() {
			return this.getUser() != null;
		},
		signin: function (username, password, remember, onSuccess, onFail) {
			var self = this;
			this.remember = remember;
			http.post(apiUrl + '/authentication', { "username": username, "password": password })
				.success(function (data, status, headers, config) {
					userInfoService.ticket = data.ticket;
					self.requestUserInfo(onSuccess, onFail);
				})
				.error(function (data, status, headers, config) {
					if (onFail) onFail(data, status, headers);
				});
		},
		requestUserInfo: function (onSuccess, onFail) {
			var self = this;
			http.get(apiUrl + '/user')
				.success(function (data, status, headers, config) {
					userInfoService.saveUserToCookie(data, self.remember);
					rootScope.$emit('userAuthenticated');
					if (onSuccess) onSuccess();
				})
				.error(function (data, status, headers, config) {
					if (onFail) onFail(data, status, headers);
				});
		},
		logout: function () {
			userInfoService.signout();
		}
	};
}]);

angular.module("app").factory('userInfoService', ['$document', function(doc) {
	return {
		ticket: null,
		user: null,
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
		getTicket: function() {
			if (!this.ticket)
				this.getUser();
			return this.ticket;
		},
		isAuthenticated: function() {
			return this.getUser() != null;
		},
		saveUserToCookie: function (user, remember) {
			this.user = user;
			var config = {path: "/"};
			if (remember)
				config.expires = 30;
			$.cookie('user', JSON.stringify({ticket: this.ticket, user: this.user}), config);
		},
		signout: function () {
			doc[0].cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
			this.ticket = null;
			this.user = null;
		}
	};
}]);

angular.module("app").factory('myHttpInterceptor', ['$q', 'userInfoService', function($q, userInfoService) {
  return {
   'request': function(config) {
      if (userInfoService.getTicket()) {
      	config.headers["X-Auth-Ticket"] = userInfoService.getTicket();
      	if (userInfoService.getUser())
      		config.url = config.url.replace('{userId}', userInfoService.getUser().id);
      }
      return config;
    }
  };
}]);

angular.module("app").config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('myHttpInterceptor');
}]);
