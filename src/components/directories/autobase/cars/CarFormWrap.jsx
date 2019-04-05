import React from 'react';

import FormWrap from 'components/compositions/FormWrap';
import schema from 'components/directories/autobase/cars/schema';

class CarFormWrap extends FormWrap {
  constructor(props, context) {
    super(props);

    this.schema = schema;
    this.uniqueField = 'asuods_id';
    this.updateAction = context.flux.getActions('cars').updateCarAdditionalInfo;
  }

  render() {
    return this.props.showForm ? <div>CarForm</div> : null;
  }
}

export default CarFormWrap;
