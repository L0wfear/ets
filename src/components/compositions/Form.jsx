import React, { PropTypes, Component } from 'react';
import { autobind } from 'core-decorators';
import { FluxContext } from 'utils/decorators';

/**
 * Форма
 * @abstract
 */
@FluxContext
@autobind
export default class Form extends React.Component {

  static get propTypes() {
    return {
      handleFormChange: PropTypes.func.isRequired,
      handleMultipleChange: PropTypes.func,
      onSubmit: PropTypes.func.isRequired,
      formState: PropTypes.object.isRequired,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      /* inital state */
    };
  }

  handleChange(field, e) {
    return this.props.handleFormChange(field, e);
  }

  handleMultipleChange(fields) {
    this.props.handleMultipleChange(fields);
  }

  handleSubmit() {
    console.log('asd')
    this.props.onSubmit();
  }

  render() {
    return <Component {...this.props} {...this.state} />;
  }

}
