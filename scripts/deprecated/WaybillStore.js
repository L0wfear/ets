import Rx from 'rx';

let billActions = {
	create: new Rx.Subject(),
	delete: new Rx.Subject(),
	update: new Rx.Subject()
}

// todo move to Rx.JS
