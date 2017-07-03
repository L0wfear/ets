import React from 'react';
import FormWrap from 'components/compositions/FormWrap.jsx';
import OdhForm from './OdhForm.jsx';
import Div from 'components/ui/Div.jsx';

export default class OdhFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.updateAction = context.flux.getActions('geoObjects').updateODH;
  }

  render() {
    return (
      <Div hidden={!this.props.showForm}>
        <OdhForm
          formState={this.state.formState}
          formMeta={this.props.meta}
          onSubmit={this.handleFormSubmit.bind(this)}
          handleFormChange={this.handleFormStateChange.bind(this)}
          show={this.props.showForm}
          onHide={this.props.onFormHide}
          {...this.state}
        />
      </Div>
    );
  }

}
