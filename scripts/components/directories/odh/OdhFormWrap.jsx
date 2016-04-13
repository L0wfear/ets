import React from 'react';
import FormWrap from 'compositions/FormWrap.jsx';
import OdhForm from './OdhForm.jsx';
import Div from '../../ui/Div.jsx';

class OdhFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.updateAction = context.flux.getActions('objects').updateODH;
  }

  render() {
    return 	<Div hidden={!this.props.showForm}>
							<OdhForm formState={this.state.formState}
											 onSubmit={this.handleFormSubmit.bind(this)}
											 handleFormChange={this.handleFormStateChange.bind(this)}
											 show={this.props.showForm}
											 onHide={this.props.onFormHide}
											 {...this.state}/>
						</Div>
  }

}

export default OdhFormWrap;
