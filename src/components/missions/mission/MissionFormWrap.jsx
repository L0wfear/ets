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
import { diffDates } from 'utils/dates.js';
import { missionSchema } from 'models/MissionModel.js';
import MissionForm from './MissionForm.jsx';
import MissionFormOld from './MissionFormOld.jsx';

export default class MissionFormWrap extends FormWrap {

  constructor(props) {
    super(props);

    this.schema = missionSchema;
  }

  createAction = formState =>
    this.context.flux.getActions('missions').createMission(formState, !this.props.fromWaybill || this.props.fromOrder).then((r) => {
      if (!this.props.fromWaybill && !this.props.fromOrder && !this.props.fromDashboard) {
        try {
          this.props.refreshTableList();
        } catch (e) {
          // function refreshTableList not in father modules
        }
      }
      return r;
    });

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
          const formErrors = this.validate(mission, {}, { inWaybill });

          this.setState({
            canSave: !filter(formErrors).length,
            formErrors,
            inWaybill,
          });
        });
      }
      if (order_id) {
        ordersActions.getOrderById(order_id).then(({ result: [order] }) => {
          const formErrors = this.validate(mission, {}, { order });

          this.setState({
            formState: mission,
            canSave: !filter(formErrors).length,
            formErrors,
            order,
          });
        });
      }
      if (props.fromOrder) {
        const { order } = props;

        const formErrors = this.validate(mission, {}, { order });
        this.setState({
          formState: mission,
          canSave: !filter(formErrors).length,
          formErrors,
          order,
        });
      } else {
        const formErrors = this.validate(mission, {});

        this.setState({
          formState: mission,
          canSave: !filter(formErrors).length,
          formErrors,
        });
      }
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
    let formErrors = clone(errors);
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
      formErrors = {
        ...formErrors,
        date_start: diffDates(formState.date_start, this.props.waybillStartDate) < 0 ? 'Дата не должна выходить за пределы путевого листа' : '',
        date_end: diffDates(formState.date_end, this.props.waybillEndDate) > 0 ? 'Дата не должна выходить за пределы путевого листа' : '',
      };
    }

    if (!this.props.fromWaybill && !this.props.fromOrder && !isEmpty(inWaybill)) {
      formErrors = {
        ...formErrors,
        ...this.checkDataByWaybillDefault(inWaybill, formState),
      };
    }
    if (!this.props.fromWaybill && !isEmpty(order)) {
      formErrors = {
        ...formErrors,
        ...this.checkDataByOrderDefault(order, formState),
      };
    }

    return formErrors;
  }

  checkDataByWaybillDefault(inWaybill, state) {
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
    } = state;

    const ansError = {};

    if (status === 'draft') {
      ansError.date_start = diffDates(new_ds, pdd) < 0 ? 'Дата не должна выходить за пределы путевого листа' : '';
      ansError.date_end = diffDates(new_de, pad) > 0 ? 'Дата не должна выходить за пределы путевого листа' : '';
    }

    if (status === 'active') {
      ansError.date_start = diffDates(new_ds, fdd) < 0 ? 'Дата не должна выходить за пределы путевого листа' : '';
      ansError.date_end = diffDates(new_de, fad) > 0 ? 'Дата не должна выходить за пределы путевого листа' : '';
    }

    return ansError;
  }

  checkDataByOrderDefault(order, state) {
    const {
      date_start: new_ds,
      date_end: new_de,
      order_operation_id,
    } = state;

    const {
      order_date,
      order_date_to,
      technical_operations = [],        
    } = order;

    let {
      date_from = order_date,
      date_to = order_date_to,
    } = technical_operations.find(({ order_operation_id: to_order_operation_id }) => to_order_operation_id === order_operation_id) || {};
    date_from = date_from || order_date;
    date_to = date_to || order_date_to;

    const ansError = {
      date_start: diffDates(new_ds, date_from) < 0 ? 'Дата не должна выходить за пределы поручения (факсограммы)' : '',
      date_end: diffDates(new_de, date_to) > 0 ? 'Дата не должна выходить за пределы поручения (факсограммы)' : '',
    };

    return ansError;
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
        <Div hidden={!this.state.formState.is_new} >
          <MissionForm
            formState={this.state.formState}
            onSubmit={this.handleFormSubmit.bind(this)}
            handleFormChange={this.handleFormStateChange.bind(this)}
            handlePrint={this.handlePrint.bind(this)}
            {...props}
            {...this.state}
          />
        </Div>
        <Div hidden={this.state.formState.is_new} >
          <MissionFormOld
            formState={this.state.formState}
            {...props}
            {...this.state}
          />
        </Div>
      </Div>
    );
  }

}
