import * as React from 'react';
import { autobind } from 'core-decorators';
import clone from 'lodash/clone';
import keys from 'lodash/keys';
import filter from 'lodash/filter';
import Div from 'components/ui/Div.jsx';
import { getDefaultMissionTemplate, getDefaultMissionsCreationTemplate } from 'stores/MissionsStore.js';
import { isEmpty } from 'utils/functions';
import { getToday9am, getTomorrow9am, addTime } from 'utils/dates.js';
import { missionTemplateSchema } from 'models/MissionTemplateModel.js';
import { missionsCreationTemplateSchema } from 'models/MissionsCreationTemplateModel.js';

import FormWrap from 'components/compositions/FormWrap.jsx';
import IntervalPicker from 'components/ui/input/IntervalPicker';
import {
  checkMissionsByRouteType,
  checkMissionsOnStructureIdCar,
} from 'components/missions/utils/customValidate.ts';

import MissionTemplateForm from './MissionTemplateForm.jsx';
import MissionsCreationForm from './MissionsCreationForm.jsx';

export const createMissions = async (flux, element, payload) => {
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
          checkOnOk: (self) => {
            const { state: { interval } } = self;
            if (!interval || interval.some(date => !date)) {
              global.NOTIFICATION_SYSTEM.notify('Поля дат задания должны быть заполнены', 'warning');
              return false;
            }
            return true;
          },
        });
      } catch (err) {
        cancel = true;
      }
      if (!cancel) {
        const { interval = [getToday9am(), getTomorrow9am()] } = state;

        const newPayload = {
          mission_source_id: payload.mission_source_id,
          passes_count: payload.passes_count,
          date_start: interval[0],
          date_end: interval[1],
          assign_to_waybill: payload.assign_to_waybill,
        };
        await createMissions(element, newPayload);
      }
    }
  }
  return error;
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
        this.schema = missionTemplateSchema;
        const mission = props.element === null ? getDefaultMissionTemplate() : clone(props.element);
        mission.type_id = mission.car_type_id;

        const formErrors = this.validate(mission, {});
        if (mission.structure_id == null) {
          mission.structure_id = this.context.flux.getStore('session').getCurrentUser().structure_id;
        }
        this.setState({
          formState: mission,
          canSave: !filter(formErrors).length, // false,
          formErrors,
        });
      } else {
        this.schema = missionsCreationTemplateSchema;
        const defaultMissionsCreationTemplate = getDefaultMissionsCreationTemplate();
        const formErrors = this.validate(defaultMissionsCreationTemplate, {});
        const dataTestRoute = checkMissionsByRouteType(Object.values(this.props.missions), defaultMissionsCreationTemplate);
        if (dataTestRoute.error) {
          defaultMissionsCreationTemplate.date_end = addTime(defaultMissionsCreationTemplate.date_start, dataTestRoute.time, 'hours');
        }

        this.setState({
          formState: defaultMissionsCreationTemplate,
          canSave: !filter(formErrors).length, // false,
          formErrors,
          needMoveDateEnd: dataTestRoute.error,
          countBumpDateEnd: dataTestRoute.time,
        });
      }
    }
  }

  async handleFormSubmit() {
    const { flux } = this.context;
    const { formState } = this.state;
    const {
      _carsIndex = {},
      missions = {},
    } = this.props;

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
      const missionsArr = Object.values(missions);

      if (!checkMissionsOnStructureIdCar(missionsArr, _carsIndex)) {
        const dataTestRoute = checkMissionsByRouteType(missionsArr, formState);

        if (dataTestRoute.error) {
          global.NOTIFICATION_SYSTEM.notify(`Время выполнения задания для ${dataTestRoute.title} должно составлять не более ${dataTestRoute.time} часов`, 'error');
        } else {
          const externalPayload = {
            mission_source_id: formState.mission_source_id,
            passes_count: formState.passes_count,
            date_start: formState.date_start,
            date_end: formState.date_end,
            assign_to_waybill: formState.assign_to_waybill,
          };

          let closeForm = true;
          for (const mission of missionsArr) {
            const e = await createMissions(flux, { [mission.id]: mission }, externalPayload);
            if (e) closeForm = false;
          }

          closeForm && this.props.onFormHide(true);
          return;
        }
      }
    }
  }

  handlMultiFormStateChange = (changesObj) => {
    let { formErrors } = this.state;
    const { formState } = this.state;

    Object.entries(changesObj).forEach(([field, e]) => {
      const value = e !== undefined && e !== null && !!e.target ? e.target.value : e;
      console.info('Form changed', field, value);
      formState[field] = value;
    });

    const newState = {};
    formErrors = this.validate(formState, formErrors);

    newState.canSave = Object.values(formErrors).reduce((boolean, oneError) => boolean && !oneError, true);

    newState.formState = formState;
    newState.formErrors = formErrors;

    this.setState(newState);
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
            handleMultiFormChange={this.handlMultiFormStateChange}
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
