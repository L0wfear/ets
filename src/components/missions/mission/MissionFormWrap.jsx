import React from 'react';
import {
  clone,
  each,
  isEmpty,
  filter,
} from 'lodash';
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
    return this.context.flux.getActions('missions').createMission(formState, !this.props.fromWaybill || this.props.fromOrder).then((r) => {
      if (!this.props.fromWaybill && !this.props.fromOrder) {
        this.props.refreshTableList();
      }
      return r;
    });
  }

  componentWillReceiveProps(props) {
    if (props.showForm && (props.showForm !== this.props.showForm)) {
      const mission = props.element === null ? getDefaultMission() : clone(props.element);
      const waybillsActions = this.context.flux.getActions('waybills');
      const ordersActions = this.context.flux.getActions('objects');

      const {
        status,
        order_id,
      } = mission;

      if (mission.structure_id == null) {
        mission.structure_id = this.context.flux.getStore('session').getCurrentUser().structure_id;
      }
      if (status === 'assigned') {
        waybillsActions.getWaybill(mission.waybill_id).then(({ result: inWaybill }) => {
          this.setState({ ...this.state, inWaybill });
          const formErrors = this.validate(mission, {}, { inWaybill });
          this.setState({
            formState: mission,
            canSave: !filter(this.validate(mission, {})).length,
            formErrors,
          });
        });
      }
      if (order_id) {
        ordersActions.getOrderById(order_id).then(({ result: [order] }) => {
          this.setState({ ...this.state, order });
          const formErrors = this.validate(mission, {}, { order });
          this.setState({
            formState: mission,
            canSave: !filter(this.validate(mission, {})).length,
            formErrors,
          });
        });
      }
      const formErrors = this.validate(mission, {});
      this.setState({
        formState: mission,
        canSave: !filter(this.validate(mission, {})).length,
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
        try {
          await this.props.refreshTableList();
        } catch (e) {
          // function refreshTableList not in father modules
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  validate(formState, errors, otherData = {}) {
    const formErrors = clone(errors);
    each(missionSchema.properties, (prop) => {
      formErrors[prop.key] = validateField(prop, formState[prop.key], formState, missionSchema);
    });
    const {
      inWaybill: othInWaybill = {},
      order: othOrder = {},
    } = otherData;
    const {
      inWaybill = othInWaybill,
      order = othOrder,
    } = this.state;

    if ((this.props.fromWaybill && this.props.waybillStartDate) || (this.props.fromWaybill && this.props.waybillEndDate)) {
      if (moment(formState.date_start).toDate().getTime() < moment(this.props.waybillStartDate).toDate().getTime()) {
        formErrors.date_start = 'Дата не должна выходить за пределы путевого листа';
      }

      if (moment(formState.date_end).toDate().getTime() > moment(this.props.waybillEndDate).toDate().getTime()) {
        formErrors.date_end = 'Дата не должна выходить за пределы путевого листа';
      }
    }

    if (this.props.fromOrder && this.props.initMission && this.props.initMission.date_start) {
      const {
        initMission: {
          date_start: init_ds,
          date_end: init_de,
          passes_count: init_pc,
        } = {},
      } = this.props;
      const {
        date_start: new_ds,
        date_end: new_de,
        passes_count: new_pc,
      } = formState;

      if (moment(new_ds).toDate().getTime() < moment(init_ds).toDate().getTime()) {
        formErrors.date_start = 'Дата не должна выходить за пределы действия поручения';
      }
      if (moment(new_de).toDate().getTime() > moment(init_de).toDate().getTime()) {
        formErrors.date_end = 'Дата не должна выходить за пределы действия поручения';
      }
      if (new_pc > init_pc) {
        formErrors.passes_count = '"Кол-во проходов" не должно превышать значение "Кол-во проходов" из поручения';
      }
      if (new_pc <= 0) {
        formErrors.passes_count = '"Кол-во проходов" должно быть больше нуля';
      }
    }

    if (!this.props.fromWaybill && !this.props.fromOrder && !isEmpty(inWaybill)) {
      const {
        status,
        plan_departure_date: pdd,
        plan_arrival_date: pad,
        fact_departure_date: fdd,
        fact_arrival_date: fad,
      } = inWaybill;

      const {
        date_start: new_ds,
        date_end: new_de,
      } = formState;

      if (status === 'draft') {
        if (moment(new_ds).toDate().getTime() < moment(pdd).toDate().getTime()) {
          formErrors.date_start = 'Дата не должна выходить за пределы путевого листа';
        }
  
        if (moment(new_de).toDate().getTime() > moment(pad).toDate().getTime()) {
          formErrors.date_end = 'Дата не должна выходить за пределы путевого листа';
        }
      }
      if (status === 'active') {
        if (moment(new_ds).toDate().getTime() < moment(fdd).toDate().getTime()) {
          formErrors.date_start = 'Дата не должна выходить за пределы путевого листа';
        }

        if (moment(new_de).toDate().getTime() > moment(fad).toDate().getTime()) {
          formErrors.date_end = 'Дата не должна выходить за пределы путевого листа';
        }
      }
    }
    if (!this.props.fromWaybill && !this.props.fromOrder && !isEmpty(order)) {
      const {
        date_start: new_ds,
        date_end: new_de,
        order_operation_id,
      } = formState;

      const {
        order_date,
        order_date_to,
        technical_operations = [],        
      } = order;
      const {
        date_from = order_date,
        date_to = order_date_to,
      } = technical_operations.find(({ id }) => id === order_operation_id) || {};

      if (moment(new_ds).toDate().getTime() < moment(date_from).toDate().getTime()) {
        formErrors.date_start = 'Дата не должна выходить за пределы поручения';
      }

      if (moment(new_de).toDate().getTime() > moment(date_to).toDate().getTime()) {
        formErrors.date_end = 'Дата не должна выходить за пределы поручения';
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
      fromOrder: this.props.fromOrder || false,
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
