import * as React from 'react';
import _ from 'lodash';
import moment from 'moment';

import Div from 'components/ui/Div.jsx';
import FormWrap from 'components/compositions/FormWrap.jsx';
import { getDefaultDutyMission } from 'stores/MissionsStore.js';
import { saveData } from 'utils/functions';
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
     // console.log('mission в DutyMissonFormWrap', mission);
      const ordersActions = this.context.flux.getActions('objects');
      const {
       order_id,
       faxogramm_id,
        } = mission;

      const id = faxogramm_id || order_id;
      if (id) {
       // ordersActions.getOrderById(id).then(result => console.log('result', result)); // удалить
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
    const formErrors = super.validate(state, errors);

    const {
      order = {},
    } = this.state;

    const {
      initDutyMission: {
        plan_date_start: initDutyMissionPlaneDateStart,
        plan_date_end: initDutyMissionPlaneDateEnd,
        passes_count: initDutyMissionPassesCount,
      } = {},
    } = this.props;  // факсограмма или поручение

    const {
      plan_date_start: dutyMissionPlaneDateStart,
      plan_date_end: dutyMissionPlaneDateEnd,
      fact_date_start: dutyMissionFactDateStart,
      fact_date_end: dutyMissionFactDateEnd,
      passes_count: dutyMissionPassesCount,
      order_operation_id,
    } = state; // наряд-задание

    const {
      order_date,
      order_date_to,
      technical_operations = [],
    } = order;  // техническая операция

    const {
      technicalOperationsDateStart = order_date,
      technicalOperationsDateEnd = order_date_to,
    } = technical_operations.find(({ id }) => id === order_operation_id) || {};

    const checkTimeStamps = (a, b, c, errorMessage) => {
      if (moment(a).diff(moment(b), 'minutes') < 0) {
        formErrors[c] = errorMessage;
      }
    };

    // const error1 = 'Дата не должна выходить за пределы действия поручения';
   // const error2 = 'Дата не должна выходить за пределы путевого листа';
   // const error3 = 'Дата не должна выходить за пределы действия тех.операции';
  const convertDate = (date) =>
    `${date.slice(8,10)}.${date.slice(5,7)}.${date.slice(0,4)} ${date.slice(11,16)}`;

    formErrors.plan_date_start = '';
    formErrors.plan_date_end = '';


    if (this.props.fromOrder && this.props.initDutyMission && this.props.initDutyMission.plan_date_start) {

      const error1 = `Дата начала должна быть позже ${convertDate(initDutyMissionPlaneDateStart)}, но раньше ${convertDate(initDutyMissionPlaneDateEnd)}, чтобы не выходить за пределы действия поручения`;
      const error2 = `Дата окончания должна быть раньше ${convertDate(initDutyMissionPlaneDateEnd)} и позже даты начала, чтобы не выходить за пределы действия поручения`;

      console.log('план начало задания', dutyMissionPlaneDateStart);
      console.log('план окончание задания', dutyMissionPlaneDateEnd);
      console.log('факт начало задания', dutyMissionFactDateStart);
      console.log('факт окончание задания', dutyMissionFactDateEnd);
      console.log('начало поручения', initDutyMissionPlaneDateStart);
      console.log('окончание окончание поручения', initDutyMissionPlaneDateEnd);

      checkTimeStamps(dutyMissionPlaneDateStart, initDutyMissionPlaneDateStart, 'plan_date_start', error1);
      checkTimeStamps(initDutyMissionPlaneDateEnd, dutyMissionPlaneDateEnd, 'plan_date_end', error2);

     // checkTimeStamps(dutyMissionPlaneDateStart, initDutyMissionPlaneDateStart, 'plan_date_start', error1);
     // checkTimeStamps(initDutyMissionPlaneDateEnd, dutyMissionPlaneDateEnd, 'plan_date_end', error1);
     // checkTimeStamps(dutyMissionFactDateStart, dutyMissionPlaneDateStart, 'plan_date_start', error2);
     // checkTimeStamps(dutyMissionPlaneDateEnd, dutyMissionFactDateEnd, 'plan_date_end', error2);

      if (dutyMissionPassesCount > initDutyMissionPassesCount) {
        formErrors.passes_count = '"Кол-во проходов" не должно превышать значение "Кол-во проходов" из поручения';
      }
      if (dutyMissionPassesCount <= 0) {
        formErrors.passes_count = '"Кол-во проходов" должно быть больше нуля';
      }
    }


    if (!this.props.fromWaybill && !this.props.fromOrder && !_.isEmpty(order)) {

      const error3 = `Дата начала должна быть между ${convertDate(technicalOperationsDateStart)}  и  ${convertDate(dutyMissionFactDateStart)}, указанное Вами время находится за пределами действия тех.операции`;
      const error4 = `Дата начала должна быть между ${convertDate(technicalOperationsDateStart)}  и  ${convertDate(dutyMissionFactDateStart)}, указанное Вами время позже фактического начала выполнения задания`;
      const error5 = `Дата окончания должна быть между ${convertDate(dutyMissionFactDateEnd)}  и  ${convertDate(technicalOperationsDateEnd)}, указанное Вами время находится за пределами действия тех.операции`;
      const error6 = `Дата окончания должна быть между ${convertDate(dutyMissionFactDateEnd)}  и  ${convertDate(technicalOperationsDateEnd)}, указанное Вами время раньше фактического окончания выполнения задания`;

      console.log('план начало задания', dutyMissionPlaneDateStart);
      console.log('план окончание задания', dutyMissionPlaneDateEnd);
      console.log('факт начало задания', dutyMissionFactDateStart);
      console.log('факт окончание задания', dutyMissionFactDateEnd);
      console.log('начало тех.операции', technicalOperationsDateStart);
      console.log('окончание тех.операции', technicalOperationsDateEnd);

      checkTimeStamps(dutyMissionPlaneDateStart, technicalOperationsDateStart, 'plan_date_start', error3);
      checkTimeStamps(dutyMissionFactDateStart, dutyMissionPlaneDateStart, 'plan_date_start', error4);
      checkTimeStamps(technicalOperationsDateEnd, dutyMissionPlaneDateEnd, 'plan_date_end', error5);
      checkTimeStamps(dutyMissionPlaneDateEnd, dutyMissionFactDateEnd, 'plan_date_end', error6);

     // checkTimeStamps(dutyMissionPlaneDateStart, technicalOperationsDateStart, 'plan_date_start', error3);
     // checkTimeStamps(technicalOperationsDateEnd, dutyMissionPlaneDateEnd, 'plan_date_end', error3);
     // checkTimeStamps(dutyMissionFactDateStart, dutyMissionPlaneDateStart, 'plan_date_start', error2);
     // checkTimeStamps(dutyMissionPlaneDateEnd, dutyMissionFactDateEnd, 'plan_date_end', error2);
    }


    return formErrors;
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
        } catch(e) {
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
