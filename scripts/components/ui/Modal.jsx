import React, {Component} from 'react';
import { RouteHandler } from 'react-router';


export default class Modal extends Component {
	render () {
		return (<div>Rendering modal with some content<br/>
						{this.props.children}
							<RouteHandler/>
						</div>)
	}
}
