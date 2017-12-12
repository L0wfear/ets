import * as React from 'react';
import {
  clone,
  filter,
} from 'lodash';

import Div from 'components/ui/Div.jsx';
import DutyMissionTemplateForm from './DutyMissionTemplateForm.jsx';
import DutyMissionsCreationForm from './DutyMissionsCreationForm.jsx';
import { getDefaultDutyMissionTemplate, getDefaultDutyMissionsCreationTemplate } from 'stores/MissionsStore.js';
import { isEmpty } from 'utils/functions';
import dutyMissionTemplateSchema from 'models/DutyMissionTemplateModel.js';
import dutyMissionsCreationTemplateSchema from 'models/DutyMissionsCreationTemplateModel.js';
import FormWrap from 'components/compositions/FormWrap.jsx';

export const createDutyMissions = async (flux, element, payload) =>
  flux.getActions('missions').createDutyMissions(element, payload);

class DutyMissionTemplateFormWrap extends FormWrap {
  constructor(props) {
    super(props);

    this.schema = dutyMissionTemplateSchema;
  }

  componentWillReceiveProps(props) {
    if (props.showForm && props.showForm !== this.props.showForm) {
      if (props.formType === 'ViewForm') {
        const mission = props.element === null ? getDefaultDutyMissionTemplate() : clone(props.element);
        if (mission.structure_id == null) {
          mission.structure_id = this.context.flux.getStore('session').getCurrentUser().structure_id;
        }
        const formErrors = this.validate(mission, {});
        this.setState({
          formState: mission,
          canSave: !filter(formErrors).length, // false,
          formErrors,
        });
      } else {
        const mission = getDefaultDutyMissionsCreationTemplate();
        this.schema = dutyMissionsCreationTemplateSchema;
        const formErrors = this.validate(mission, {});
        this.setState({
          formState: mission,
          canSave: !filter(formErrors).length, // false,
          formErrors,
        });
      }
    }
  }

  handleFormSubmit() {
    const { flux } = this.context;
    const { formState } = this.state;

    if (this.props.formType === 'ViewForm') {
      if (isEmpty(formState.id)) {
        flux.getActions('missions').createDutyMissionTemplate(formState);
      } else {
        flux.getActions('missions').updateDutyMissionTemplate(formState);
      }
      this.props.onFormHide();
    } else {
      createDutyMissions(flux, this.props.missions, formState).then(() => {
        this.props.onFormHide(true);
      });
    }
  }

  render() {
    if (this.props.formType === 'ViewForm') {
      return (
        <Div hidden={!this.props.showForm}>
          <DutyMissionTemplateForm
            formState={this.state.formState}
            onSubmit={this.handleFormSubmit.bind(this)}
            handleFormChange={this.handleFormStateChange.bind(this)}
            show={this.props.showForm}
            onHide={this.props.onFormHide}
            template
            {...this.state}
          />
        </Div>
      );
    } else {
      return (
        <Div hidden={!this.props.showForm}>
          <DutyMissionsCreationForm
            formState={this.state.formState}
            onSubmit={this.handleFormSubmit.bind(this)}
            handleFormChange={this.handleFormStateChange.bind(this)}
            show={this.props.showForm}
            onHide={this.props.onFormHide}
            missions={this.props.missions}
            {...this.state}
          />
        </Div>
      );
    }
  }

}

export default DutyMissionTemplateFormWrap;
