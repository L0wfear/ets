import React from 'react';
import { autobind } from 'core-decorators';
import { Button, Glyphicon, ButtonToolbar } from 'react-bootstrap';
import MissionInfoFormWrap from 'components/dashboard/MissionInfoFormWrap.jsx';
import CheckableElementsList from 'components/CheckableElementsList.jsx';
import { getWarningNotification } from 'utils/notifications';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import _ from 'lodash';
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
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE'],
})
@autobind
export default class MissionsJournal extends CheckableElementsList {

  constructor(props, context) {
    super(props);

    this.removeElementAction = context.flux.getActions('missions').removeMission;
    this.removeDisabled = () => {
      if (Object.keys(this.state.checkedElements).length !== 0) return false;

      if (this.state.selectedElement === null) {
        return true;
      }

      return this.state.selectedElement.status !== 'not_assigned';
    };

    this.state = Object.assign(this.state, {
      showMissionRejectForm: false,
      showMissionInfoForm: false,
      page: 0,
      sortBy: ['number:desc'],
      filter: {},
    });
  }

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('missions').getMissions(null, 15, 0, this.state.sortBy, this.state.filter);
    flux.getActions('objects').getCars();
    flux.getActions('routes').getRoutes();
    flux.getActions('technicalOperation').getTechnicalOperations();
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.page !== this.state.page || nextState.sortBy !== this.state.sortBy || nextState.filter !== this.state.filter) {
      this.context.flux.getActions('missions').getMissions(null, 15, nextState.page * 15, nextState.sortBy, nextState.filter);
    }
  }

  checkDisabled() {
    if (Object.keys(this.state.checkedElements).length !== 0) return false;

    if (this.state.selectedElement === null) {
      return true;
    }
    return this.state.selectedElement.status !== 'assigned';
  }

  checkDisabledDelete() {
    return super.checkDisabledDelete() &&
      this.state.selectedElement && this.state.selectedElement.status !== 'not_assigned';
  }

  completeMission() {
    const mission = _.cloneDeep(this.state.selectedElement);
    mission.status = 'complete';
    this.context.flux.getActions('missions').updateMission(mission);
  }

  rejectMission() {
    this.setState({ showMissionRejectForm: true });
  }

  completeCheckedElements() {
    let error = false;
    if (Object.keys(this.state.checkedElements).length !== 0) {
      _.forEach(this.state.checkedElements, (mission) => {
        if (mission.status === 'assigned') {
          const updatedMission = _.cloneDeep(mission);
          updatedMission.status = 'complete';
          this.context.flux.getActions('missions').updateMission(updatedMission);
        } else error = true;
      });
      this.setState({ checkedElements: {} });
      if (error) global.NOTIFICATION_SYSTEM.notify(getWarningNotification('Отметить как "Выполненые" можно только назначенные задания!'));
    } else {
      this.completeMission();
    }
  }

  rejectCheckedElements() {
    let error = false;
    if (Object.keys(this.state.checkedElements).length !== 0) {
      _.forEach(this.state.checkedElements, (mission) => {
        if (mission.status === 'assigned') {
          const reason = prompt(`Введите причину для задания №${mission.number}`, '');
          if (reason) {
            const updatedMission = _.cloneDeep(mission);
            updatedMission.status = 'fail';
            updatedMission.comment = reason;
            this.context.flux.getActions('missions').updateMission(updatedMission);
          }
        } else error = true;
      });
      this.setState({ checkedElements: {} });
      if (error) global.NOTIFICATION_SYSTEM.notify(getWarningNotification('Отметить как "Невыполненые" можно только назначенные задания!'));
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
          this.removeElementAction(mission.id);
        } else {
          isNotDeleted = true;
        }
      });

      if (isNotDeleted) {
        global.NOTIFICATION_SYSTEM.notify(getWarningNotification('Удалились только задания со статусом "Не назначено"!'));
      }
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
    refresh && this.context.flux.getActions('missions').getMissions();
  }

  async mapView(id) {
    this.context.flux.getActions('missions').getMissionData(id).then((res) => {
      this.setState({ mission: res.result, showMissionInfoForm: true });
    });
  }

  getForms() {
    return [
      <div key={'forms'}>
        <MissionFormWrap
          onFormHide={this.onFormHide}
          showForm={this.state.showForm}
          element={this.state.selectedElement}
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
        />
      </div>,
    ];
  }

  getButtons() {
    const buttons = super.getButtons();

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
    };
  }

  additionalRender() {
    return <Paginator currentPage={this.state.page} maxPage={Math.ceil(this.props.totalCount / 15)} setPage={page => this.setState({ page })} firstLastButtons />;
  }

}
