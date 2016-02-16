import React from 'react';

class Form extends React.Component {

   constructor(props){
     super(props)
     this.state = {/* inital state */}
   }

   handleChange(field, e) {
     console.info('HANDLE FORM CHANGE');
 		 this.props.handleFormChange(field, e);
 	 }

   handleSubmit() {
     console.info('SUBMITTING FORM', this.props.formState);
     this.props.onSubmit(this.props.formState);
   }

   render() {
     return <Component {...this.props} {...this.state} />
   }

}

Form.propTypes = {
  handleFormChange: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  formState: React.PropTypes.object.isRequired,
};

Form.contextTypes = {
	flux: React.PropTypes.object,
};

export default Form;
