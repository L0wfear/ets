import React from 'react';

import FormWrap from 'components/compositions/FormWrap';
import schema from 'components/directories/autobase/cars/schema';

class CarFormWrap extends FormWrap {
  constructor(props) {
    super(props);

    this.schema = schema;
  }

  render() {
    return this.props.showForm ? <div>CarForm</div> : null;
  }
}

export default CarFormWrap;
