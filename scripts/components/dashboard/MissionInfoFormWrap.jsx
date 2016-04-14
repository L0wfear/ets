import React from 'react';
import FormWrap from '../compositions/FormWrap.jsx';
import MissionInfoForm from './MissionInfoForm.jsx';
import Div from '../ui/Div.jsx';

export default class MissionInfoFormWrap extends FormWrap {

  constructor(props) {
    super(props);
  }

  handleFormSubmit() {
    this.props.onFormHide();
  }

	render() {

		return 	<Div hidden={!this.props.showForm}>
							<MissionInfoForm formState = {this.state.formState}
    													 onSubmit={this.handleFormSubmit.bind(this)}
    													 handleFormChange={this.handleFormStateChange.bind(this)}
    													 show={this.props.showForm}
    													 onHide={this.props.onFormHide}
    													 {...this.state}/>
						</Div>

	}
}
