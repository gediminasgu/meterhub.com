angular.module("authentication").factory("authentication", ['$cookieStore', '$http', '$document', '$rootScope', function (cookieStore, http, doc, rootScope) {
	return {
		/*
		isAuthenticated: function () {
			return this.getClientId() != null;
		},
		clientId: null,
		clientName: null,
		homeAddress: null,
		client: null,
		token: null,
		type: null,
		getClientId: function () {
			if (this.clientId == null) {
				var userInfo = cookieStore.get("user");
				if (userInfo) {
					this.clientId = userInfo.id;
					this.token = userInfo.token;
					if (typeof (userInfo.type) == 'undefined')
						this.type = 'personal';
					else
						this.type = userInfo.type;
				}
			}
			return this.clientId;
		},
		getClientName: function () {
			if (this.clientName == null) {
				var userInfo = cookieStore.get("user");
				if (userInfo) {
					this.clientName = userInfo.name;
				}
			}
			return this.clientName;
		},
		getHomeAddress: function () {
			if (this.homeAddress == null) {
				var userInfo = cookieStore.get("user");
				if (userInfo) {
					this.homeAddress = userInfo.address;
				}
			}
			return this.homeAddress;
		},
		saveUserToCookie: function () {
			//cookieStore.put("user", { id: this.clientId, token: this.token, name: this.client.name });
		},
		authenticate: function (email, password, onSuccess, onFail) {
			var self = this;
			http.post('/api/authorizations', { "username": email, "password": password }, { headers: { "Accept": "application/vnd.clickataxi.v2+json" } })
				.success(function (data, status, headers, config) {
					self.token = data.token;
					self.requestClientInfo(email, password, onSuccess, onFail);
				})
				.error(function (data, status, headers, config) {
					if (onFail) onFail(data, status, headers);
				});
		},
		requestClientInfo: function (email, password, onSuccess, onFail) {
			var self = this;
			http.post('/api/sessions', { "email": email, "password": password }, { headers: { "Accept": "application/vnd.clickataxi.v2+json" } })
				.success(function (data, status, headers, config) {
					self.token = data.token;
					if (typeof (data.corporation) != 'undefined') {
						_gaq.push(['_setCustomVar', 1, 'user_type', 'corporate', 1]);
						self.updateCorporateInfoLocal(data.corporation);
					} else {
						_gaq.push(['_setCustomVar', 1, 'user_type', 'personal', 1]);
						self.updateClientInfoLocal(data.client);
					}
					self.saveUserToCookie();
					rootScope.$emit('userAuthenticated');
					if (onSuccess) onSuccess();
				})
				.error(function (data, status, headers, config) {
					if (onFail) onFail(data, status, headers);
				});
		},
		updateClientInfo: function (callback) {
			var self = this;
			if (this.type == 'personal') {
				http.get('/api/clients/' + this.getClientId(), { headers: { "Accept": "application/vnd.clickataxi.v2+json" } })
					.success(function(data, status, headers, config) {
						self.updateClientInfoLocal(data);
						if (callback) callback(self.client);
					})
					.error(function(data, status, headers, config) {
						self.client = null;
						if (callback) callback(self.client);
					});
			} else {
				http.get('/api/corporations/' + this.getClientId(), { headers: { "Accept": "application/vnd.clickataxi.v2+json" } })
					.success(function (data, status, headers, config) {
						self.updateCorporateInfoLocal(data);
						if (callback) callback(self.client);
					})
					.error(function (data, status, headers, config) {
						self.client = null;
						if (callback) callback(self.client);
					});
			}
		},
		updateClientInfoLocal: function(client) {
			this.client = client;
			this.clientName = client.name;
			this.clientId = client.id;
			this.type = 'personal';
		},
		updateCorporateInfoLocal: function (corporation) {
			this.client = corporation;
			this.clientName = corporation.displayName;
			this.clientId = corporation.id;
			this.type = 'corporate';

			if (typeof(corporation.homeAddress.placeRef) != 'undefined')
				this.homeAddress = corporation.homeAddress.placeRef.replace('\r\n', ', ');
			else
				this.homeAddress = corporation.homeAddress.singleLineFormattedAddress;
		},
		isCorporate: function() {
			return this.clientId != null && this.type == 'corporate';
		},
		signout: function () {
			cookieStore.remove("user");
			doc[0].cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
			this.clientId = null;
			this.client = null;
			this.clientName = null;
			this.token = null;
			this.type = null;
		}*/
	};
}]);