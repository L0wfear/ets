import React from 'react';
import { validateRow } from 'validate/validateRow.js';
import { FluxContext } from '../decorators/index.js';
import { isEmpty } from 'utils/functions';
import { saveDataSuccessNotification } from 'utils/notifications';

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
      let element = {};
      if (props.element !== null) {
        element = _.cloneDeep(props.element);
      } else {
        element = !isEmpty(this.defaultElement) ? _.cloneDeep(this.defaultElement) : {};
      }
      let formErrors = this.validate(element, {});
      this.setState({
        formState: element,
        formErrors,
        canSave: ! !!_.filter(formErrors).length
      });
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

  // отправка формы
  async handleFormSubmit() {
    const uniqueField = this.uniqueField || 'id';
    const { formState } = this.state;

    try {

      // понять, обновлять форму или создавать новую
      // можно по отсутствию уникального идентификатора
      if (isEmpty(formState[uniqueField])) {

        if (typeof this.createAction === 'function') {
          await this.createAction(formState);
        } else {
          throw new Error('Create action called but not specified');
        }

      } else {

        if (typeof this.updateAction === 'function') {
          await this.updateAction(formState);
        } else {
          throw new Error('Update action called but not specified');
        }

      }
      global.NOTIFICATION_SYSTEM._addNotification(saveDataSuccessNotification);
    } catch (e) {
      return;
    }

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
