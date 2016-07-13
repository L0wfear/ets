import React from 'react';
import FormWrap from 'compositions/FormWrap.jsx';
import DtForm from './DtForm.jsx';
import Div from 'components/ui/Div.jsx';

class DtFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.updateAction = context.flux.getActions('objects').updateDT;
  }

  render() {
    return (
      <Div hidden={!this.props.showForm}>
        <DtForm formState={this.state.formState}
                onSubmit={this.handleFormSubmit.bind(this)}
  						  handleFormChange={this.handleFormStateChange.bind(this)}
  						  show={this.props.showForm}
  						  onHide={this.props.onFormHide}
  						  {...this.state} />
			</Div>
    );
  }

}

export default DtFormWrap;
