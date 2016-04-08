import React from 'react';

class Form extends React.Component {

   static propTypes = {
     handleFormChange: React.PropTypes.func.isRequired,
     onSubmit: React.PropTypes.func.isRequired,
     formState: React.PropTypes.object.isRequired,
   }

   constructor(props){
     super(props)
     this.state = {/* inital state */}
   }

   handleChange(field, e) {
     console.info('HANDLE FORM CHANGE');
 		 return this.props.handleFormChange(field, e);
 	 }

   handleMultipleChange(fields) {
     this.props.handleMultipleChange(fields);
   }

   handleSubmit() {
     console.info('SUBMITTING FORM', this.props.formState);
     this.props.onSubmit(this.props.formState);
   }

   render() {
     return <Component {...this.props} {...this.state} />
   }

}

Form.contextTypes = {
	flux: React.PropTypes.object,
};

export default Form;


/* Пример наследования: */

// import React, {Component} from 'react';
// import connectToStores from 'flummox/connect';
// import { Modal, Row, Col, FormControls, Button, DropdownButton, Dropdown, Glyphicon, MenuItem, Input } from 'react-bootstrap';
// import Datepicker from '../ui/DatePicker.jsx';
// import Field from '../ui/Field.jsx';
// import Div from '../ui/Div.jsx';
// import moment from 'moment';
// import cx from 'classnames';
// import Form from '../compositions/Form.jsx';
//
// export class MissionForm extends Form {
//
// 	constructor(props) {
// 		super(props);
//
// 		this.state = {
// 		};
// 	}
//
// 	render() {
//
// 		let state = this.props.formState;
// 		let errors = this.props.formErrors;
//     let title = '';
//
// 		return (
// 			<Modal {...this.props} bsSize="large">
//
// 				<Modal.Header closeButton>
// 	          <Modal.Title id="contained-modal-title-lg">{title}</Modal.Title>
// 				</Modal.Header>
//
// 	      <Modal.Body>
//
// 	      	<Row>
// 	      	</Row>
//
// 	      </Modal.Body>
//
// 	      <Modal.Footer>
// 					<Div className="inline-block">
// 		      	<Button onClick={this.handleSubmit.bind(this)}>Сохранить</Button>
// 					</Div>
// 	      </Modal.Footer>
// 			</Modal>
// 		)
// 	}
// }
//
// export default connectToStores(MissionForm, ['objects', 'employees', 'missions', 'routes']);
