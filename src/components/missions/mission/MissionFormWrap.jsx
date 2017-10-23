import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import Div from 'components/ui/Div.jsx';
import FormWrap from 'components/compositions/FormWrap.jsx';
import { validateField } from 'utils/validate/validateField.js';
import { getDefaultMission } from 'stores/MissionsStore.js';
import { saveData, printData, resizeBase64 } from 'utils/functions';
import { missionSchema } from 'models/MissionModel.js';
import MissionForm from './MissionForm.jsx';

export default class MissionFormWrap extends FormWrap {

  constructor(props) {
    super(props);

    this.schema = missionSchema;
  }
  createAction = (formState) => {
    return this.context.flux.getActions('missions').createMission(formState, !this.props.fromWaybill || this.props.fromFaxogrammMissionForm).then(() => {
      if (!this.props.fromWaybill && !this.props.fromFaxogrammMissionForm) {
        this.props.refreshTableList();
      }
    });
  }

  componentWillReceiveProps(props) {
    if (props.showForm && (props.showForm !== this.props.showForm)) {
      const mission = props.element === null ? getDefaultMission() : _.clone(props.element);
      if (mission.structure_id == null) {
        mission.structure_id = this.context.flux.getStore('session').getCurrentUser().structure_id;
      }
      if (props.fromFaxogrammMissionForm) {
        mission.mission_source_id = 1;
        mission.date_start = props.externalData.to_data.date_from;
        mission.date_end = props.externalData.to_data.date_to;
        mission.passes_count = props.externalData.to_data.num_exec;
        mission.norm_id = props.externalData.to_data.norm_id;
        mission.municipal_facility_id = props.externalData.to_data.municipal_facility_id;
        mission.technical_operation_id = props.externalData.to_data.id;
        mission.order_operation_id = props.externalData.to_data.order_operation_id;

        mission.faxogramm_id = props.externalData.faxogramm_id;
        this.setState({
          fixed_date_start: props.externalData.date_start,
          fixed_date_end: props.externalData.date_end,
        });
      }
      const formErrors = this.validate(mission, {});
      this.setState({
        formState: mission,
        canSave: !_.filter(this.validate(mission, {})).length,
        formErrors,
      });
    }
  }
  /**
   * @override
   * @param {*} formState
   */
  updateAction(formState) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.context.flux.getActions('missions').updateMission(formState, false);
        await this.props.refreshTableList();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  validate(formState, errors) {
    const formErrors = _.clone(errors);
    _.each(missionSchema.properties, (prop) => {
      formErrors[prop.key] = validateField(prop, formState[prop.key], formState, missionSchema);
    });

    if ((this.props.fromWaybill && this.props.waybillStartDate) || (this.props.fromWaybill && this.props.waybillEndDate)) {
      if (moment(formState.date_start).toDate().getTime() < moment(this.props.waybillStartDate).toDate().getTime()) {
        formErrors.date_start = 'Дата не должна выходить за пределы путевого листа';
      }

      if (moment(formState.date_end).toDate().getTime() > moment(this.props.waybillEndDate).toDate().getTime()) {
        formErrors.date_end = 'Дата не должна выходить за пределы путевого листа';
      }
    }
    if ((this.props.fromFaxogrammMissionForm && this.props.faxogrammStartDate) || (this.props.fromFaxogrammMissionForm && this.props.faxogrammEndDate)) {
      const date_start = this.props.externalData.to_data.date_from;
      const date_end = this.props.externalData.to_data.date_to;
      if (moment(date_start).toDate().getTime() < moment(this.props.faxogrammStartDate).toDate().getTime()) {
        formErrors.date_start = 'Дата не должна выходить за пределы технической операции';
      }

      if (moment(date_end).toDate().getTime() > moment(this.props.faxogrammEndDate).toDate().getTime()) {
        formErrors.date_end = 'Дата не должна выходить за пределы технической операции';
      }
    }

    return formErrors;
  }

  handlePrint(ev, print_form_type = 1) {
    const f = this.state.formState;
    const { flux } = this.context;
    const data = { mission_id: f.id };
    global.map.reset();
    global.map.once('postcompose', async (event) => {
      const routeImageBase64Data = await resizeBase64(event.context.canvas.toDataURL('image/png'));
      data.image = routeImageBase64Data;

      flux.getActions('missions').printMission(data).then(({ blob }) => {
        if (print_form_type === 1) {
          saveData(blob, `Задание №${f.number}.pdf`);
        } else {
          printData(blob);
        }
      });
    });
    global.map.render();
  }

  render() {
    const props = {
      show: this.props.showForm,
      onHide: this.props.onFormHide,
      fromWaybill: this.props.fromWaybill,
      waybillStartDate: this.props.waybillStartDate,
      waybillEndDate: this.props.waybillEndDate,
      disabledProps: this.props.disabledProps || {},
      externalData: this.props.externalData || {},
      fromFaxogrammMissionForm: this.props.fromFaxogrammMissionForm || false,
    };

    return (
      <Div hidden={!this.props.showForm}>
        <MissionForm
          formState={this.state.formState}
          onSubmit={this.handleFormSubmit.bind(this)}
          handleFormChange={this.handleFormStateChange.bind(this)}
          handlePrint={this.handlePrint.bind(this)}
          {...props}
          {...this.state}
        />
      </Div>
    );
  }

}
