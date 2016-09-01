import React, { PropTypes } from 'react';
import { FluxContext } from 'utils/decorators';

/**
 * Форма
 * @abstract
 */
@FluxContext
export default class Form extends React.Component {

  static get propTypes() {
    return {
      handleFormChange: PropTypes.func.isRequired,
      handleMultipleChange: PropTypes.func,
      onSubmit: PropTypes.func.isRequired,
      formState: PropTypes.object.isRequired
    }
  }

  constructor(props){
    super(props);

    this.state = {
      /* inital state */
    };
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
     this.props.onSubmit();
   }

   render() {
     return <Component {...this.props} {...this.state} />
   }

}
