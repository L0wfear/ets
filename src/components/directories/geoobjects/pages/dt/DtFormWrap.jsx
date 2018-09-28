import React from 'react';
import FormWrap from 'components/compositions/FormWrap';
import Div from 'components/ui/Div';
import DtForm from './DtForm';

export default class DtFormWrap extends FormWrap {
  constructor(props, context) {
    super(props);
    this.updateAction = formState => context.flux.getActions('geoObjects').updateDT(formState).then(() => this.context.flux.getActions('geoObjects').getGeozoneByType('dt'));
  }

  render() {
    return (
      <Div hidden={!this.props.showForm}>
        <DtForm
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
