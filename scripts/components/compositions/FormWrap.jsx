import React from 'react';

class FormWrap extends React.Component {

   static contextTypes = {
     flux: React.PropTypes.object,
   }

   constructor(props){
     super(props)
     this.state = {/* inital state */}
   }

   componentWillReceiveProps(props) {
 		 if (props.showForm) {
 			 if (props.element !== null ) {
         const formState = _.cloneDeep(props.element);
         this.setState({formState});
 			 } else {
         this.setState({formState: {}});
       }
 		 }
 	 }

   handleFormStateChange(field, e) {
     console.info('Form changed', field, e)

     let formState = this.state.formState;
     let newState = {};
     formState[field] = !!e.target ? e.target.value : e;

     newState.formState = formState;

     this.setState(newState);
 	 }

   render() {
     return <Component {...this.props} {...this.state} />
   }

}

FormWrap.propTypes = {
};

export default FormWrap;
