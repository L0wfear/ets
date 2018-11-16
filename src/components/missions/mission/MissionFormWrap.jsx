import React from 'react';
import {
  clone,
  isEmpty,
  filter,
} from 'lodash';
import Div from 'components/ui/Div';
import FormWrap from 'components/compositions/FormWrap';
import { getDefaultMission } from 'stores/MissionsStore';
import { saveData, printData } from 'utils/functions';
import { diffDates, setZeroSecondsToDate } from 'utils/dates';
import { missionSchema } from 'models/MissionModel';
import MissionForm from 'components/missions/mission/MissionForm/MissionForm';
import MissionFormOld from 'components/missions/mission/MissionForm/MissionFormOld';
import withMapInConsumer from 'components/map/context/withMapInConsumer';
import { DivNone } from 'global-styled/global-styled';

const printMapKeySmall = 'mapMissionTemplateFormA4';

class MissionFormWrap extends FormWrap {
  constructor(props) {
    super(props);

    this.schema = missionSchema;
  }

  createAction = formState => this.context.flux.getActions('missions').createMission(formState, !this.props.fromWaybill || !!this.props.fromOrder).then((r) => {
    if (!this.props.fromWaybill && !this.props.fromOrder && !this.props.fromDashboard) {
      try {
        this.props.refreshTableList();
      } catch (e) {
        // function refreshTableList not in father modules
      }
    }
    return r;
  }).catch((error) => {
    console.log(error);
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
      const IS_ASSIGNED = status === 'assigned';
      const IS_IN_PROGRESS = status === 'in_progress';
      const IS_EXPIRED = status === 'expired';

      if (IS_ASSIGNED || IS_IN_PROGRESS || IS_EXPIRED) {
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
    if (!props.showForm && (props.showForm !== this.props.showForm)) {
      this.setState({
        order: {},
        inWaybill: {},
      });
    }
  }

  /**
   * @override
   * @param {*} formState
   */
  async updateAction(formState) {
    try {
      await this.context.flux.getActions('missions').updateMission(formState);
      await this.props.refreshTableList();
    } catch (error) {
      console.log(error);
    }
  }

  validate(formState, errors, otherData = {}) {
    let formErrors = super.validate(formState, errors);

    const {
      inWaybill: othInWaybill = {},
      order: othOrder = {},
    } = otherData;
    const {
      inWaybill = othInWaybill,
      order = othOrder,
    } = this.state;
    const date_start = setZeroSecondsToDate(formState.date_start);
    const date_end = setZeroSecondsToDate(formState.date_end);
    const waybillStartDate = setZeroSecondsToDate(this.props.waybillStartDate);
    const waybillEndDate = setZeroSecondsToDate(this.props.waybillEndDate);

    if (this.props.fromWaybill && (waybillStartDate || waybillEndDate)) {
      if (diffDates(date_start, waybillStartDate) < -1) {
        formErrors.date_start = 'Дата не должна выходить за пределы путевого листа';
      }
      if (diffDates(date_end, waybillEndDate) > 1) {
        formErrors.date_end = 'Дата не должна выходить за пределы путевого листа';
      }
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
      if (diffDates(new_ds, pdd) < 0) {
        ansError.date_start = 'Дата не должна выходить за пределы путевого листа';
      }
      if (diffDates(new_de, pad) > 0) {
        ansError.date_end = 'Дата не должна выходить за пределы путевого листа';
      }
    }

    if (status === 'active') {
      if (diffDates(new_ds, fdd || pdd) < 0) {
        ansError.date_start = 'Дата не должна выходить за пределы путевого листа';
      }
      if (diffDates(new_de, fad || pad) > 0) {
        ansError.date_end = 'Дата не должна выходить за пределы путевого листа';
      }
    }

    return ansError;
  }

  checkDataByOrderDefault(order, state) {
    const {
      date_start: new_ds,
      date_end: new_de,
      order_operation_id,
      passes_count: new_pc,
    } = state;

    const {
      order_date,
      order_date_to,
      technical_operations = [],
    } = order;

    const {
      date_from = order_date,
      date_to = order_date_to,
      num_exec: order_pc,
    } = technical_operations.find(({ order_operation_id: to_order_operation_id }) => to_order_operation_id === order_operation_id) || {};

    const ansError = {};

    if (diffDates(new_ds, date_from || order_date) < 0 || diffDates(new_ds, date_to || order_date_to) > 0) {
      ansError.date_start = 'Дата не должна выходить за пределы поручения (факсограммы)';
    }
    if (diffDates(new_de, date_to || order_date_to) > 0 || diffDates(new_de, date_from || order_date) < 0) {
      ansError.date_end = 'Дата не должна выходить за пределы поручения (факсограммы)';
    }
    if (Number.parseInt(new_pc, 0) > order_pc) {
      ansError.passes_count = 'Поле "Количество циклов" должно быть не больше количества выполнений поручения (факсограммы)"';
    }

    return ansError;
  }

  handlePrint(print_form_type = 1) {
    const f = this.state.formState;
    const { flux } = this.context;
    const data = { mission_id: f.id };

    this.props.getMapImageInBase64ByKey(printMapKeySmall).then((image) => {
      data.image = image;
      flux.getActions('missions').printMission(data).then(({ blob }) => {
        if (print_form_type === 1) {
          saveData(blob, `Задание №${f.number}.pdf`);
        } else {
          printData(blob);
        }
      });
    });
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
      <>
        {
          this.props.showForm && this.state.formState.is_new
            ? (
              <MissionForm
                formState={this.state.formState}
                onSubmit={this.handleFormSubmit.bind(this)}
                handleFormChange={this.handleFormStateChange.bind(this)}
                handleMultiFormChange={this.handlMultiFormStateChange}
                handlePrint={this.handlePrint.bind(this)}
                printMapKeySmall={printMapKeySmall}
                {...props}
                {...this.state}
                show
              />
            )
            : (
              <DivNone />
            )
        }
        {
          this.props.showForm && !this.state.formState.is_new
            ? (
              <MissionFormOld
                formState={this.state.formState}
                {...props}
                {...this.state}
              />
            )
            : (
              <DivNone />
            )
        }
      </>
    );
  }
}

export default withMapInConsumer()(MissionFormWrap);
