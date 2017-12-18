import * as React from 'react';
import _ from 'lodash';

import Div from 'components/ui/Div.jsx';
import FormWrap from 'components/compositions/FormWrap.jsx';
import { getDefaultDutyMission } from 'stores/MissionsStore.js';
import { saveData } from 'utils/functions';
import { diffDates } from 'utils/dates.js';
import { dutyMissionSchema } from 'models/DutyMissionModel.js';
import DutyMissionForm from './DutyMissionForm.jsx';
import DutyMissionFormOld from './DutyMissionFormOld.jsx';

class DutyMissionFormWrap extends FormWrap {

  constructor(props, context) {
    super(props);

    this.schema = dutyMissionSchema;
    this.defaultElement = getDefaultDutyMission();
    this.defaultElement.structure_id = context.flux.getStore('session').getCurrentUser().structure_id;
  }
  createAction = formState =>
    this.context.flux.getActions('missions').createDutyMission(formState).then(() => {
      if (!this.props.fromOrder && !this.props.fromDashboard) {
        return this.props.refreshTableList();
      }
      return Promise.resolve();
    });

  componentWillReceiveProps(props) {
    if (props.showForm && (props.showForm !== this.props.showForm)) {
      const mission = props.element === null ? getDefaultDutyMission() : _.clone(props.element);
      const ordersActions = this.context.flux.getActions('objects');
      const {
       order_id,
       faxogramm_id,
        } = mission;

      const id = faxogramm_id || order_id;
      if (id) {
        ordersActions.getOrderById(id).then(({ result: [order] }) => {
          const formErrors = this.validate(mission, {}, { order });
          this.setState({
            formState: mission,
            canSave: !_.filter(this.validate(mission, {})).length,
            formErrors,
            order,
          });
        });
      }
    }
  }

  async handleFormPrint() {
    const mission = _.cloneDeep(this.state.formState);

    let response;

    if (mission.id) {
      response = await this.context.flux.getActions('missions').updateDutyMission(mission);
    } else {
      response = await this.context.flux.getActions('missions').createDutyMission(mission);
    }

    const id = mission.id ? mission.id : response.result && response.result[0] ? response.result[0].id : null;
    await this.context.flux.getActions('missions').printDutyMission(id).then(({ blob }) => { saveData(blob, `Печатная форма наряд-задания №${id}.pdf`); });
    if (!this.props.fromOrder && !this.props.fromDashboard) {
      await this.props.refreshTableList();
    }
    this.props.onFormHide();
  }

  /**
   * Валидация формы
   * Если миссия создаётся из реестра централизованных заданий, то идёт проверка на даты на графницы поручения(централизованных заданий)
   * @override
   */
  validate(state, errors) {
    let formErrors = super.validate(state, errors);

    if (this.props.fromOrder && this.props.initDutyMission && this.props.initDutyMission.plan_date_start) {
      const ansError = this.checkDataFromOrder(this.props.initDutyMission, state);
      formErrors = { ...formErrors, ...ansError };
    }

    if (!this.props.fromWaybill && !this.props.fromOrder && !_.isEmpty(this.state.order)) {
      const ansError = this.checkDataByOrderDefault(this.state.order, state);
      formErrors = { ...formErrors, ...ansError };
    }

    return formErrors;
  }

  checkDataFromOrder(initDutyMission, state) {
    const {
      plan_date_start: init_pds,
      plan_date_end: init_pde,
      passes_count: init_pc,
    } = initDutyMission;

    const {
      plan_date_start: new_pds,
      plan_date_end: new_pde,
      passes_count: new_pc,
    } = state;


    console.log(`поручение c ${init_pds} по ${init_pde}
            плановое время с ${new_pds} по ${new_pde}`);

    const ansError = {
      plan_date_start: diffDates(new_pds, init_pds) < 0 || diffDates(new_pds, init_pde) > 0 ? 'Дата не должна выходить за пределы действия поручения (факсограммы)' : '',
      plan_date_end: diffDates(new_pde, init_pde) > 0 || diffDates(new_pde, init_pds) < 0 ? 'Дата не должна выходить за пределы действия поручения (факсограммы)' : '',
    };

    ansError.passes_count = new_pc > init_pc ? '"Кол-во проходов" не должно превышать значение "Кол-во проходов" из поручения' : '';
    ansError.passes_count = new_pc <= 0 ? '"Кол-во проходов" должно быть больше нуля' : '';

    return ansError;
  }

  checkDataByOrderDefault(order, state) {
    const {
      plan_date_start: new_ds,
      plan_date_end: new_de,
      fact_date_start: new_fds,
      fact_date_end: new_fde,
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

    console.log(`тех операция c ${date_from} по ${date_to}
        запланированное время с ${new_ds} по ${new_de}
            фактическое время с ${new_fds} по ${new_fde}`);

    const ansError = {
      plan_date_start: diffDates(new_ds, date_from) < 0 || diffDates(new_ds, date_to) > 0 ? 'Дата не должна выходить за пределы тех. операции' : '',
      plan_date_end: diffDates(new_de, date_to) > 0 || diffDates(new_de, date_from) < 0 ? 'Дата не должна выходить за пределы тех. операции' : '',
      fact_date_start: diffDates(new_fds, new_ds) < 0 ? 'Дата не должна выходить за пределы запланированного времени' : '',
      fact_date_end: diffDates(new_fde, new_de) > 0 ? 'Дата не должна выходить за пределы запланированного времени' : '',
    };

    return ansError;
  }

  /**
   * @override
   * @param {*} formState
   */
  updateAction(formState) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.context.flux.getActions('missions').updateDutyMission(formState, false);
        try {
          await this.props.refreshTableList();
        } catch (e) {
          // ну а вдруг
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  render() {
    return (
      <Div hidden={!this.props.showForm}>
        <Div hidden={!this.state.formState.is_new} >
          <DutyMissionForm
            formState={this.state.formState}
            onSubmit={this.handleFormSubmit.bind(this)}
            onPrint={this.handleFormPrint.bind(this)}
            handleFormChange={this.handleFormStateChange.bind(this)}
            show={this.props.showForm}
            onHide={this.props.onFormHide}
            fromWaybill={this.props.fromWaybill}
            readOnly={this.props.readOnly || !this.state.formState.is_new}
            fromOrder={!!this.props.fromOrder}
            {...this.state}
          />
        </Div>
        <Div hidden={this.state.formState.is_new} >
          <DutyMissionFormOld
            formState={this.state.formState}
            onSubmit={this.handleFormSubmit.bind(this)}
            onPrint={this.handleFormPrint.bind(this)}
            handleFormChange={this.handleFormStateChange.bind(this)}
            show={this.props.showForm}
            onHide={this.props.onFormHide}
            fromWaybill={this.props.fromWaybill}
            readOnly={this.props.readOnly || !this.state.formState.is_new}
            fromOrder={!!this.props.fromOrder}
            {...this.state}
          />
        </Div>
      </Div>
    );
  }

}

export default DutyMissionFormWrap;
