import * as React from 'react';
import {
  clone,
  cloneDeep,
  filter,
  isEmpty,
} from 'lodash';

import Div from 'components/ui/Div.jsx';
import FormWrap from 'components/compositions/FormWrap.jsx';
import { getDefaultDutyMission } from 'stores/MissionsStore.js';
import { saveData } from 'utils/functions';
import { diffDates } from 'utils/dates.js';
import dutyMissionSchema from 'models/DutyMissionModel.js';

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
      const mission = props.element === null ? getDefaultDutyMission() : clone(props.element);
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
      });
    }
  }

  handleFormPrint = async () => {
    const mission = cloneDeep(this.state.formState);

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
  validate(formState, errors, otherData = {}) {
    let formErrors = super.validate(formState, errors);

    const {
      order: othOrder = {},
    } = otherData;
    const {
      order = othOrder,
    } = this.state;

    if (!isEmpty(order)) {
      formErrors = {
        ...formErrors,
        ...this.checkDataByOrderDefault(order, formState, formErrors),
      };
    }

    return formErrors;
  }

  checkDataByOrderDefault(order, state, errors) {
    const {
      plan_date_start: new_ds,
      plan_date_end: new_de,
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

    const ansError = {};

    if (diffDates(new_ds, date_from) < 0 || diffDates(new_ds, date_to) > 0) {
      ansError.plan_date_start = 'Дата не должна выходить за пределы действия поручения (факсограммы)';
    }
    if (diffDates(new_de, date_to) > 0 || diffDates(new_de, date_from) < 0) {
      ansError.plan_date_end = 'Дата не должна выходить за пределы действия поручения (факсограммы)';
    }

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
            onPrint={this.handleFormPrint}
            handleFormChange={this.handleFormStateChange.bind(this)}
            show={this.props.showForm}
            onHide={this.props.onFormHide}
            readOnly={this.props.readOnly || !this.state.formState.is_new}
            fromOrder={!!this.props.fromOrder}
            {...this.state}
          />
        </Div>
        <Div hidden={this.state.formState.is_new} >
          <DutyMissionFormOld
            formState={this.state.formState}
            onSubmit={this.handleFormSubmit.bind(this)}
            onPrint={this.handleFormPrint}
            handleFormChange={this.handleFormStateChange.bind(this)}
            show={this.props.showForm}
            onHide={this.props.onFormHide}
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
