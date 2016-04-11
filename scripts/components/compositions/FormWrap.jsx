import React from 'react';
import { validateRow } from 'validate/validateRow.js';
import { FluxContext } from '../decorators/index.js';

/**
 * FormWrap базовый класс хранения и работы с состоянием формы
 * @constructor дефолтный
 * @validate валидация состояния формы в соответствии со схемой (this.schema обязателен)
 * @handleFormStateChange обработка изменения состояния формы
 * @handleFormSubmit обработка отправки формы
 * @render дефолтный, обязательно переопределяется
 */

@FluxContext
class FormWrap extends React.Component {

  static propTypes = {
    showForm: React.PropTypes.bool.isRequired,
    //element: React.PropTypes.object.isRequired,
    onFormHide: React.PropTypes.func.isRequired,
  }

  constructor(props){
    super(props);

    this.state = {
      formState: {},
      formErrors: {},
      canSave: false,
      canPrint: false
    };
  }

  componentWillReceiveProps(props) {
    if (props.showForm && (props.showForm !== this.props.showForm) ) {
      if (props.element !== null ) {
        const formState = _.cloneDeep(props.element);
        this.setState({formState});
      } else {
        let defaultElement = this.defaultElement || {};
        this.setState({formState: defaultElement});
      }
    }
  }

  validate(formState, errors) {
    if (typeof this.schema === 'undefined') return errors;
  	let formErrors = _.clone(errors);
    let schema = this.schema;
  	_.each(schema.properties, prop => {
  		formErrors[prop.key] = validateRow(prop, formState[prop.key]);
    });

  	return formErrors;
  }

  handleFormStateChange(field, e) {
    const value = e !== undefined && e !== null && !!e.target ? e.target.value : e;
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

  handleFormSubmit(formState) {
    if (typeof this.props.onFormHide === 'function') {
      this.props.onFormHide();
    }
  }

  render() {
    return <Component {...this.props} {...this.state} />
  }

}

export default FormWrap;


/* Пример создания класса, наследующего FormWrap (скопировать, убрать комментарии, заменить форму): */

// import React, { Component } from 'react';
// import _ from 'lodash';
// import Div from '../ui/Div.jsx';
// import MissionForm from './MissionForm.jsx';
// import FormWrap from '../compositions/FormWrap.jsx';
// import { getDefaultMission } from '../../stores/MissionsStore.js';
// import { isNotNull, isEmpty } from 'utils/functions';
// import { missionSchema, missionClosingSchema } from '../models/MissionModel.js';
//
// class MissionFormWrap extends FormWrap {
//
// 	constructor(props) {
// 		super(props);
//
// 		this.schema = missionSchema;
// 	}
//
// 	handleFormSubmit(formState) {
// 		const { flux } = this.context;
// 		flux.getActions('missions').createMission(formState);
//
// 		this.props.onFormHide();
// 	}
//
// 	render() {
//
// 		return 	<Div hidden={!this.props.showForm}>
// 							<MissionForm formState = {this.state.formState}
// 													 onSubmit={this.handleFormSubmit.bind(this)}
// 													 handleFormChange={this.handleFormStateChange.bind(this)}
// 													 show={this.props.showForm}
// 													 onHide={this.props.onFormHide}
// 													 fromWaybill={this.props.fromWaybill}
// 													 {...this.state}/>
// 						</Div>
//
// 	}
//
// }
//
// export default MissionFormWrap;
