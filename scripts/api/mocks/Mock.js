const ERROR_METHOD_NOT_ALLOWED = {
	message: 'Method not allowed'
};

export default class Mock {

	constructor(data = []) {
		this.data = data.slice();
		this.availableMethods = ['GET', 'POST', 'PUT', 'DELETE'];
		this.basicResponse = {
			warnings: [],
			errors: [],
			result: [],
		};
	}

	serves(methodName) {
		return this.availableMethods.indexOf(methodName) > -1;
	}

	getData(payload = {}) {
		let data = this.data;
		_.map(payload, (v, k) => {
			data = data.filter(obj => obj[k] === v);
		});
		return {
			data
		};
	}

	get(payload) {
		if (!this.serves('GET')) {
			return Object.assign(this.basicResponse, {
				errors: [ERROR_METHOD_NOT_ALLOWED]
			});
		}
		return this.wrapData(this.getData(payload));
	}

	post(payload) {
		if (!this.serves('POST')) {
			return Object.assign(this.basicResponse, {
				errors: [ERROR_METHOD_NOT_ALLOWED]
			});
		}
		payload.id = Math.max.apply(null, this.data.map(d => d.id)) + 1;
		this.data.push(payload);
		return this.wrapData({data: this.data});
	}

	delete(payload) {
		if (!this.serves('DELETE')) {
			return Object.assign(this.basicResponse, {
				errors: [ERROR_METHOD_NOT_ALLOWED]
			});
		}
		if (typeof payload.id !== 'undefined') {
			const index = this.data.findIndex(e => e.id === payload.id);
			if (index > -1) {
				this.data.splice(index, 1);
			}
		}
		return this.wrapData({ data: this.data});
	}

	wrapData({data, warnings = [], errors = []}) {
		return {
			warnings,
			errors,
			result: data
		}
	}

}
