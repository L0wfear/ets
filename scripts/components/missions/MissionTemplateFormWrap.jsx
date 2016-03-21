import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import Div from '../ui/Div.jsx';
import MissionTemplateForm from './MissionTemplateForm.jsx';
import MissionsCreationForm from './MissionsCreationForm.jsx';
import { getDefaultMissionTemplate, getDefaultMissionsCreationTemplate } from '../../stores/MissionsStore.js';
import { validate as validateNumber} from '../../validate/validateNumber.js';
import { isNotNull, isEmpty } from 'utils/functions';
import { validateRow } from '../../validate/validateRow.js';
import { missionTemplateSchema } from '../models/MissionTemplateModel.js';
import { missionsCreationTemplateSchema } from '../models/MissionsCreationTemplateModel.js';
import FormWrap from '../compositions/FormWrap.jsx';

let validateMissionsCreationTemplate = (mission, errors) => {
  let missionsCreationTemplateErrors = _.clone(errors);

  _.each(missionsCreationTemplateSchema.properties, prop => {
    missionsCreationTemplateErrors[prop.key] = validateRow(prop, mission[prop.key]);
  });

  return missionsCreationTemplateErrors;
};

class MissionFormWrap extends FormWrap {
	constructor(props) {
		super(props);

		this.schema = missionTemplateSchema;
	}

	componentWillReceiveProps(props) {
		if (props.showForm && props.showForm !== this.props.showForm) {
      if (props.formType === "ViewForm") {
        let mission = props.element === null ? getDefaultMissionTemplate() : _.clone(props.element);
  			let formErrors = this.validate(mission, {});
  			this.setState({
  				formState: mission,
  				canSave: ! !!_.filter(formErrors).length,//false,
  				formErrors,
  			});
      } else {
        const defaultMissionsCreationTemplate = getDefaultMissionsCreationTemplate();
        this.setState({
          formState: defaultMissionsCreationTemplate,
          canSave: true,
          formErrors: validateMissionsCreationTemplate(defaultMissionsCreationTemplate, {})
        });
      }
		}
	}

	handleFormSubmit(formState) {
		const { flux } = this.context;

    if (this.props.formType === "ViewForm") {
      if (isEmpty(formState.id)) {
        flux.getActions('missions').createMissionTemplate(formState);
      } else {
        flux.getActions('missions').updateMissionTemplate(formState);
      }
			this.props.onFormHide();
    } else {
      flux.getActions('missions').createMissions(this.props.missions, formState).then(() => {
				this.props.onFormHide(true);
			});
    }

	}

	render() {
    if (this.props.formType === 'ViewForm') {
      return 	<Div hidden={!this.props.showForm}>
        <MissionTemplateForm formState = {this.state.formState}
                              onSubmit={this.handleFormSubmit.bind(this)}
                              handleFormChange={this.handleFormStateChange.bind(this)}
                              show={this.props.showForm}
                              onHide={this.props.onFormHide}
          {...this.state}/>
      </Div>
    } else {
      return 	<Div hidden={!this.props.showForm}>
        <MissionsCreationForm formState = {this.state.formState}
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

MissionFormWrap.contextTypes = {
	flux: React.PropTypes.object,
	setLoading: React.PropTypes.func,
};

export default MissionFormWrap;
