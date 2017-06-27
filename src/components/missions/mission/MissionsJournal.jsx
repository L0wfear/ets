import React from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Button, Glyphicon, ButtonToolbar } from 'react-bootstrap';

import { MAX_ITEMS_PER_PAGE } from 'constants/ui';
import MissionInfoFormWrap from 'components/dashboard/MissionInfoFormWrap.jsx';
import CheckableElementsList from 'components/CheckableElementsList.jsx';
import { getWarningNotification } from 'utils/notifications';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import Paginator from 'components/ui/Paginator.jsx';
import MissionsTable from './MissionsTable.jsx';
import MissionFormWrap from './MissionFormWrap.jsx';
import MissionRejectForm from './MissionRejectForm.jsx';

@connectToStores(['missions', 'objects', 'employees', 'routes'])
@exportable({ entity: 'mission' })
@staticProps({
  entity: 'mission',
  listName: 'missionsList',
  tableComponent: MissionsTable,
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE', 'CHECK'],
})
@autobind
export default class MissionsJournal extends CheckableElementsList {

  constructor(props, context) {
    super(props);

    this.removeElementAction = context.flux.getActions('missions').removeMission;
    this.removeElementCallback = this.removeElementCallback.bind(this);

    this.removeDisabled = () => {
      const keysChEl = Object.keys(this.state.checkedElements);

      if (keysChEl.length !== 0) {
        return !keysChEl.every(el => this.state.checkedElements[el].status === 'assigned');
      }

      if (this.state.selectedElement === null) {
        return true;
      }

      return this.state.selectedElement.status !== 'assigned';
    };

    this.state = Object.assign(this.state, {
      showMissionRejectForm: false,
      showMissionInfoForm: false,
      equipmentData: null,
      page: 0,
      sortBy: ['number:desc'],
      filter: {},
    });
  }

  async componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('missions').getMissions(null, MAX_ITEMS_PER_PAGE, 0, this.state.sortBy, this.state.filter);
    flux.getActions('objects').getCars();
    flux.getActions('technicalOperation').getTechnicalOperations();
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      nextState.page !== this.state.page ||
      nextState.sortBy !== this.state.sortBy ||
      nextState.filter !== this.state.filter
    ) {
      this.refreshList(nextState);
    }
  }

  async refreshList(state = this.state) {
    this.context.flux.getActions('missions').getMissions(null, MAX_ITEMS_PER_PAGE, state.page * MAX_ITEMS_PER_PAGE, state.sortBy, state.filter);

    const pageOffset = state.page * MAX_ITEMS_PER_PAGE;
    const missions = await this.context.flux.getActions('missions').getMissions(null, MAX_ITEMS_PER_PAGE, pageOffset, state.sortBy, state.filter);

    const { total_count } = missions.result.meta;
    const resultCount = missions.result.rows.length;

    if (resultCount === 0 && total_count > 0) {
      const offset = (Math.ceil(total_count / MAX_ITEMS_PER_PAGE) - 1) * MAX_ITEMS_PER_PAGE;
      this.context.flux.getActions('missions').getMissions(null, MAX_ITEMS_PER_PAGE, offset, state.sortBy, state.filter);
    }
  }

  removeElementCallback() {
    global.NOTIFICATION_SYSTEM.notify('Данные успешно удалены', 'success');
    this.refreshList();
  }

  checkDisabled() {
    const keysChEl = Object.keys(this.state.checkedElements);

    if (keysChEl.length !== 0) {
      return !keysChEl.every(el => this.state.checkedElements[el].status === 'assigned');
    }

    if (this.state.selectedElement === null) {
      return true;
    }

    return this.state.selectedElement.status !== 'assigned';
  }

  checkDisabledDelete() {
    return (
      super.checkDisabledDelete() ||
      (this.state.selectedElement && this.state.selectedElement.status !== 'not_assigned')
    );
  }

  async completeMission() {
    const mission = _.cloneDeep(this.state.selectedElement);
    mission.status = 'complete';
    await this.context.flux.getActions('missions').updateMission(mission, false);
    global.NOTIFICATION_SYSTEM.notify('Данные успешно сохранены', 'success');
    this.refreshList(this.state);
  }

  rejectMission() {
    this.setState({ showMissionRejectForm: true });
  }

  completeCheckedElements() {
    let error = false;
    if (Object.keys(this.state.checkedElements).length !== 0) {
      _.forEach(this.state.checkedElements, async (mission) => {
        if (mission.status === 'assigned') {
          const updatedMission = _.cloneDeep(mission);
          updatedMission.status = 'complete';
          await this.context.flux.getActions('missions').updateMission(updatedMission, false);
        } else error = true;
      });

      this.refreshList(this.state);
      this.setState({ checkedElements: {} });
      if (error) {
        global.NOTIFICATION_SYSTEM.notify(getWarningNotification('Отметить как "Выполненые" можно только назначенные задания!'));
      } else {
        global.NOTIFICATION_SYSTEM.notify('Данные успешно сохранены', 'success');
      }
    } else {
      this.completeMission();
    }
  }

  rejectCheckedElements() {
    let error = false;
    if (Object.keys(this.state.checkedElements).length !== 0) {
      _.forEach(this.state.checkedElements, async (mission) => {
        if (mission.status === 'assigned') {
          const reason = prompt(`Введите причину для задания №${mission.number}`, '');
          if (reason) {
            const updatedMission = _.cloneDeep(mission);
            updatedMission.status = 'fail';
            updatedMission.comment = reason;
            await this.context.flux.getActions('missions').updateMission(updatedMission, false);
          }
        } else error = true;
      });
      this.refreshList(this.state);
      this.setState({ checkedElements: {} });
      if (error) {
        global.NOTIFICATION_SYSTEM.notify(getWarningNotification('Отметить как "Невыполненые" можно только назначенные задания!'));
      } else {
        global.NOTIFICATION_SYSTEM.notify('Данные успешно сохранены', 'success');
      }
    } else {
      this.rejectMission();
    }
  }

  removeCheckedElements() {
    if (typeof this.removeElementAction !== 'function') return;

    if (Object.keys(this.state.checkedElements).length !== 0) {
      if (!confirm('Вы уверены, что хотите удалить выбранные элементы?')) return;

      let isNotDeleted = false;

      _.forEach(this.state.checkedElements, (mission) => {
        if (mission.status === 'not_assigned') {
          this.removeElementAction(mission.id, false);
        } else {
          isNotDeleted = true;
        }
      });

      if (isNotDeleted) {
        global.NOTIFICATION_SYSTEM.notify(getWarningNotification('Удалились только задания со статусом "Не назначено"!'));
      } else {
        global.NOTIFICATION_SYSTEM.notify('Данные успешно удалены', 'success');
      }

      this.refreshList();
      this.setState({
        checkedElements: {},
        selectedElement: null,
      });
    } else {
      this.removeElement();
    }
  }

  onReject(refresh) {
    this.setState({ showMissionRejectForm: false });
    refresh && this.refreshList(this.state);
  }

  async mapView(id) {
    const { flux } = this.context;

    const res = await this.context.flux.getActions('missions').getMissionData(id);
    const mission = res.result;
    const { car_data, mission_data } = mission;
    this.setState({ mission, showMissionInfoForm: true });

    const cars = await flux.getActions('objects').getCars().then(r => r.result);
    const carGpsCode = cars.find(c => c.gov_number === car_data.gov_number).gps_code;
    const equipmentData = await flux.getActions('cars').getTrack(carGpsCode, mission_data.date_start, mission_data.date_end)
      .then(r => Object.keys(r.equipment)
        .map(k => r.equipment[k].distance)
        .reduce((a, b) => a + b, 0)
      );

    this.setState({ equipmentData });
  }

  getForms() {
    return [
      <div key={'forms'}>
        <MissionFormWrap
          onFormHide={this.onFormHide}
          showForm={this.state.showForm}
          element={this.state.selectedElement}
          refreshTableList={this.refreshList}
          {...this.props}
        />
        <MissionRejectForm
          show={this.state.showMissionRejectForm}
          onReject={this.onReject}
          mission={this.state.selectedElement}
        />
        <MissionInfoFormWrap
          onFormHide={() => this.setState({ showMissionInfoForm: false })}
          showForm={this.state.showMissionInfoForm}
          element={this.state.mission}
          equipmentData={this.state.equipmentData}
        />
      </div>,
    ];
  }

  getButtons() {
    const buttons = super.getButtons();

    // TODO отображение 2 кнопорей в зависимости от прав
    buttons.push(
      <ButtonToolbar key={buttons.length}>
        <Button bsSize="small" onClick={this.completeCheckedElements} disabled={this.checkDisabled()}><Glyphicon glyph="ok" /> Отметка о выполнении</Button>
        <Button bsSize="small" onClick={this.rejectCheckedElements} disabled={this.checkDisabled()}><Glyphicon glyph="ban-circle" /> Отметка о невыполнении</Button>
      </ButtonToolbar>
    );

    return buttons;
  }

  getAdditionalProps() {
    const { structures } = this.context.flux.getStore('session').getCurrentUser();
    const changeSort = (field, direction) => this.setState({ sortBy: `${field}:${direction ? 'asc' : 'desc'}` });
    const changeFilter = filter => this.setState({ filter });
    return {
      mapView: this.mapView,
      structures,
      changeSort,
      changeFilter,
      filterValues: this.state.filter,
      rowNumberOffset: this.state.page * MAX_ITEMS_PER_PAGE,
    };
  }

  additionalRender() {
    return (
      <Paginator
        currentPage={this.state.page}
        maxPage={Math.ceil(this.props.totalCount / MAX_ITEMS_PER_PAGE)}
        setPage={page => this.setState({ page })}
        firstLastButtons
      />
    );
  }
}
