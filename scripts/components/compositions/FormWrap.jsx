import React from 'react';
import { validateRow } from '../../validate/validateRow.js';
import { FluxContext } from '../decorators/index.js';

@FluxContext
class FormWrap extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      formState: null,
      formErrors: {},
      canSave: false,
      canPrint: false
    };
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

  validate(formState, errors) {
  	let formErrors = _.clone(errors);
    if (typeof this.schema === 'undefined') return formErrors;
    let schema = this.schema;
  	_.each(schema.properties, prop => {
  		formErrors[prop.key] = validateRow(prop, formState[prop.key]);
  	});

  	return formErrors;
  }

  handleFormStateChange(field, e) {
    const value = e !== undefined && !!e.target ? e.target.value : e;
    console.info('Form changed', field, value);
		let { formState, formErrors } = this.state;
		let newState = {};
		formState[field] = value;

		formErrors = this.validate(formState, formErrors);
		newState.canSave = _(formErrors).map(v => !!v).filter(e => e === true).value().length === 0;

		newState.formState = formState;
		newState.formErrors = formErrors;

		this.setState(newState);
  }

  render() {
    return <Component {...this.props} {...this.state} />
  }

}

FormWrap.propTypes = {
};

export default FormWrap;
