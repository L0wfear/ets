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
import { printData, resizeBase64 } from 'utils/functions';

import MissionTemplateForm from './MissionTemplateForm.jsx';
import MissionsCreationForm from './MissionsCreationForm.jsx';

const keyGlobal = 'mission_template_hidden';

@autobind
export default class MissionFormWrap extends FormWrap {

  constructor(props) {
    super(props);

    this.schema = missionTemplateSchema;

    this.state = {
      ...this.state,
    };
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

  handlePrint = (print_format) => {
    const f = this.state.formState;
    const { flux } = this.context;
    const data = {
      template_id: f.id,
      size: `a${print_format}`,
    };
    const mapKey = `map${keyGlobal}/${data.size}`;

    global[mapKey].once('postcompose', async (event) => {
      const routeImageBase64Data = await resizeBase64(event.context.canvas.toDataURL('image/png'));
      data.image = routeImageBase64Data;

      flux.getActions('missions').printMissionTemplate(data).then(({ blob }) => {
        printData(blob);
      });
    });

    global[mapKey].render();
  }


  render() {
    if (this.props.formType === 'ViewForm') {
      // Создание шаблона задания
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
            handlePrint={this.handlePrint}
            keyGlobal={keyGlobal}
            {...this.state}
          />
        </Div>
      );
    }

    // Создание задания по шаблону
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
