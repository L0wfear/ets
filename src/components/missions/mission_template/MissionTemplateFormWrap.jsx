import React from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import Div from 'components/ui/Div.jsx';
import { getDefaultMissionTemplate, getDefaultMissionsCreationTemplate } from 'stores/MissionsStore.js';
import { isEmpty } from 'utils/functions';
import { validateField } from 'utils/validate/validateField.js';
import { missionTemplateSchema } from 'models/MissionTemplateModel.js';
import { missionsCreationTemplateSchema } from 'models/MissionsCreationTemplateModel.js';
import FormWrap from 'components/compositions/FormWrap.jsx';
import MissionTemplateForm from './MissionTemplateForm.jsx';
import MissionsCreationForm from './MissionsCreationForm.jsx';

const validateMissionsCreationTemplate = (mission, errors) => {
  const missionsCreationTemplateErrors = _.clone(errors);

  _.each(missionsCreationTemplateSchema.properties, (prop) => {
    missionsCreationTemplateErrors[prop.key] = validateField(prop, mission[prop.key], mission, missionsCreationTemplateSchema);
  });

  return missionsCreationTemplateErrors;
};

@autobind
export default class MissionFormWrap extends FormWrap {

  constructor(props) {
    super(props);

    this.schema = missionTemplateSchema;
  }

  componentWillReceiveProps(props) {
    if (props.showForm && props.showForm !== this.props.showForm) {
      if (props.formType === 'ViewForm') {
        const mission = props.element === null ? getDefaultMissionTemplate() : _.clone(props.element);
        const formErrors = this.validate(mission, {});
        this.setState({
          formState: mission,
          canSave: !_.filter(formErrors).length, // false,
          formErrors,
        });
      } else {
        const defaultMissionsCreationTemplate = getDefaultMissionsCreationTemplate();
        this.setState({
          formState: defaultMissionsCreationTemplate,
          canSave: true,
          formErrors: validateMissionsCreationTemplate(defaultMissionsCreationTemplate, {}),
        });
      }
    }
  }

  async handleFormSubmit() {
    const { flux } = this.context;
    const { formState } = this.state;
    if (this.props.formType === 'ViewForm') {
      if (isEmpty(formState.id)) {
        try {
          await flux.getActions('missions').createMissionTemplate(formState);
        } catch (e) {
          return;
        }
      } else {
        try {
          await flux.getActions('missions').updateMissionTemplate(formState);
        } catch (e) {
          return;
        }
      }
      this.props.onFormHide();
    } else {
      try {
        await flux.getActions('missions').createMissions(this.props.missions, formState);
      } catch (e) {
        return;
      }
      this.props.onFormHide(true);
    }
  }

  render() {
    if (this.props.formType === 'ViewForm') {
      return (
        <Div hidden={!this.props.showForm}>
          <MissionTemplateForm
            formState={this.state.formState}
            onSubmit={this.handleFormSubmit}
            handleFormChange={this.handleFormStateChange}
            show={this.props.showForm}
            onHide={this.props.onFormHide}
            {...this.state}
          />
        </Div>
      );
    }

    return (
      <Div hidden={!this.props.showForm}>
        <MissionsCreationForm
          formState={this.state.formState}
          onSubmit={this.handleFormSubmit}
          handleFormChange={this.handleFormStateChange}
          show={this.props.showForm}
          onHide={this.props.onFormHide}
          missions={this.props.missions}
          {...this.state}
        />
      </Div>
    );
  }

}
