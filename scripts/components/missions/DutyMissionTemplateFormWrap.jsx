import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import Div from '../ui/Div.jsx';
import DutyMissionTemplateForm from './DutyMissionTemplateForm.jsx';
import DutyMissionsCreationForm from './DutyMissionsCreationForm.jsx';
import { getDefaultDutyMissionTemplate, getDefaultDutyMissionsCreationTemplate } from '../../stores/MissionsStore.js';
import { validate as validateNumber} from 'validate/validateNumber.js';
import { isNotNull, isEmpty } from 'utils/functions';
import { validateRow } from 'validate/validateRow.js';
import { dutyMissionTemplateSchema } from '../models/DutyMissionTemplateModel.js';
import { dutyMissionsCreationTemplateSchema } from '../models/DutyMissionsCreationTemplateModel.js';
import FormWrap from '../compositions/FormWrap.jsx';

let validateDutyMissionsCreationTemplate = (mission, errors) => {
  return errors;
  let missionsCreationTemplateErrors = _.clone(errors);

  _.each(dutyMissionsCreationTemplateSchema.properties, prop => {
    missionsCreationTemplateErrors[prop.key] = validateRow(prop, mission[prop.key]);
  });

  return missionsCreationTemplateErrors;
};

class DutyMissionTemplateFormWrap extends FormWrap {
	constructor(props) {
		super(props);

		this.schema = dutyMissionTemplateSchema;
	}

	componentWillReceiveProps(props) {
		if (props.showForm && props.showForm !== this.props.showForm) {
      if (props.formType === "ViewForm") {
        let mission = props.element === null ? getDefaultDutyMissionTemplate() : _.clone(props.element);
  			let formErrors = this.validate(mission, {});
  			this.setState({
  				formState: mission,
  				canSave: ! !!_.filter(formErrors).length,//false,
  				formErrors,
  			});
      } else {
        const defaultDutyMissionsCreationTemplate = getDefaultDutyMissionsCreationTemplate();
        this.setState({
          formState: defaultDutyMissionsCreationTemplate,
          canSave: true,
          formErrors: validateDutyMissionsCreationTemplate(defaultDutyMissionsCreationTemplate, {})
        });
      }
		}
	}

	handleFormSubmit() {
		const { flux } = this.context;
    let { formState } = this.state;

    if (this.props.formType === "ViewForm") {
      if (isEmpty(formState.id)) {
        flux.getActions('missions').createDutyMissionTemplate(formState);
      } else {
        flux.getActions('missions').updateDutyMissionTemplate(formState);
      }
			this.props.onFormHide();
    } else {
      flux.getActions('missions').createDutyMissions(this.props.missions, formState).then(() => {
				this.props.onFormHide(true);
			});
    }

	}

	render() {
    if (this.props.formType === 'ViewForm') {
      return 	<Div hidden={!this.props.showForm}>
        <DutyMissionTemplateForm formState = {this.state.formState}
                              onSubmit={this.handleFormSubmit.bind(this)}
                              handleFormChange={this.handleFormStateChange.bind(this)}
                              show={this.props.showForm}
                              onHide={this.props.onFormHide}
          {...this.state}/>
      </Div>
    } else {
      return 	<Div hidden={!this.props.showForm}>
        <DutyMissionsCreationForm formState = {this.state.formState}
                              onSubmit={this.handleFormSubmit.bind(this)}
                              handleFormChange={this.handleFormStateChange.bind(this)}
                              show={this.props.showForm}
                              onHide={this.props.onFormHide}
                              missions={this.props.missions}
          {...this.state}/>
      </Div>
    }
	}

}

DutyMissionTemplateFormWrap.contextTypes = {
	flux: React.PropTypes.object,
	setLoading: React.PropTypes.func,
};

export default DutyMissionTemplateFormWrap;
