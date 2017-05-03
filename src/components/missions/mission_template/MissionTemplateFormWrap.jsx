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
import IntervalPicker from 'components/ui/IntervalPicker.jsx';
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
        if (mission.structure_id == null) {
          mission.structure_id = this.context.flux.getStore('session').getCurrentUser().structure_id;
        }
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
      const externalPayload = {
        mission_source_id: formState.mission_source_id,
        passes_count: formState.passes_count,
        date_start: formState.date_start,
        date_end: formState.date_end,
        assign_to_waybill: formState.assign_to_waybill,
      };

      const createMissions = async (element, payload) => {
        let error = false;
        try {
          await flux.getActions('missions').createMissions(element, payload);
        } catch (e) {
          error = true;
          if (e && e.message.code === 'no_active_waybill') {
            let cancel = false;
            try {
              await confirmDialog({
                title: 'Для ТС не существует активного ПЛ',
                body: 'Создать черновик ПЛ?',
              });
            } catch (err) {
              cancel = true;
            }
            if (!cancel) {
              const newPayload = {
                mission_source_id: payload.mission_source_id,
                passes_count: payload.passes_count,
                date_start: payload.date_start,
                date_end: payload.date_end,
                assign_to_waybill: 'assign_to_new_draft',
              };
              await createMissions(element, newPayload);
            }
          }
          if (e && e.message.code === 'invalid_period') {
            const waybillNumber = e.message.message.split('№')[1].split(' ')[0];

            const body = self => <div>
              <div>{e.message.message}</div><br />
              <center>Введите даты задания:</center>
              <IntervalPicker
                interval={self.state.interval}
                onChange={interval => self.setState({ interval })}
              />
            </div>;

            let cancel = false;
            let state;
            try {
              state = await confirmDialog({
                title: <b>{`Задание будет добавлено в ПЛ №${waybillNumber}`}</b>,
                body,
              });
            } catch (err) {
              cancel = true;
            }
            if (!cancel) {
              const newPayload = {
                mission_source_id: payload.mission_source_id,
                passes_count: payload.passes_count,
                date_start: state.interval[0],
                date_end: state.interval[1],
                assign_to_waybill: payload.assign_to_waybill,
              };
              await createMissions(element, newPayload);
            }
          }
        }
        return error;
      };

      const missions = _.keys(this.props.missions)
        .map(key => this.props.missions[key]);

      let closeForm = true;

      for (const m of missions) {
        const e = await createMissions({ [m.id]: m }, externalPayload);
        if (e) closeForm = false;
      }

      closeForm && this.props.onFormHide(true);
      return;
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
            template
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
