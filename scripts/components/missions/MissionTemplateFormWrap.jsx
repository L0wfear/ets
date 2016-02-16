import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import Div from '../ui/Div.jsx';
import MissionTemplateForm from './MissionTemplateForm.jsx';
import MissionsCreationForm from './MissionsCreationForm.jsx';
import { getDefaultMissionTemplate, getDefaultMissionsCreationTemplate } from '../../stores/MissionsStore.js';
import { validate as validateNumber} from '../../validate/validateNumber.js';
import { isNotNull, isEmpty } from '../../utils/functions.js';
import { missionCreationSuccessNotification } from '../../utils/notifications.js';
import { validateRow } from '../../validate/validateRow.js';
import { missionTemplateSchema } from '../models/MissionTemplateModel.js';
import { missionsCreationTemplateSchema } from '../models/MissionsCreationTemplateModel.js';
import FormWrap from '../compositions/FormWrap.jsx';

let validateMission = (mission, errors) => {
	let missionErrors = _.clone(errors);

	_.each(missionTemplateSchema.properties, prop => {
		missionErrors[prop.key] = validateRow(prop, mission[prop.key]);
	});

	return missionErrors;
};

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
        if (props.element === null ) {
          const defaultMission = getDefaultMissionTemplate();
          this.setState({
            formState: defaultMission,
            canSave: false,
            formErrors: this.validate(defaultMission, {}),
          })
        } else {
          let _mission = _.clone(props.element);

          this.setState({
            formState: _mission,
            formErrors: this.validate(_mission, {}),
            canSave: true,
          });
        }
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
    } else {
			console.log(this.props.missions);
      flux.getActions('missions').createMissions(this.props.missions, formState).then(() => {
				return global.NOTIFICATION_SYSTEM._addNotification(missionCreationSuccessNotification);
			});
    }
		this.props.onFormHide();

		return;
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
