import React from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Button, Glyphicon, ButtonToolbar } from 'react-bootstrap';

import { MAX_ITEMS_PER_PAGE } from 'constants/ui';
import CheckableElementsList from 'components/CheckableElementsList.jsx';
import { getWarningNotification } from 'utils/notifications';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import { extractTableMeta, getServerSortingField, toServerFilteringObject } from 'components/ui/table/utils';
import Paginator from 'components/ui/Paginator.jsx';
import DutyMissionsTable, { getTableMeta } from './DutyMissionsTable.jsx';
import DutyMissionFormWrap from './DutyMissionFormWrap.jsx';

@connectToStores(['missions', 'objects', 'employees'])
@exportable({ entity: 'duty_mission' })
@staticProps({
  entity: 'duty_mission',
  listName: 'dutyMissionsList',
  tableComponent: DutyMissionsTable,
  tableMeta: extractTableMeta(getTableMeta()),
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE', 'CHECK'],
  exportable: true,
})
@autobind
export default class DutyMissionsJournal extends CheckableElementsList {

  constructor(props, context) {
    super(props);

    this.removeElementAction = id => context.flux.getActions('missions').removeDutyMission(id);

    this.removeDisabled = () => {
      if (Object.keys(this.state.checkedElements).length !== 0) return false;
      if (this.state.selectedElement === null) {
        return true;
      }
      return this.state.selectedElement && this.state.selectedElement.status !== 'not_assigned';
    };

    this.state = {
      ...this.state,
      page: 0,
      sortBy: ['number:desc'],
      filter: {},
    };
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

  componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    flux.getActions('technicalOperation').getTechnicalOperations();
    flux.getActions('missions').getDutyMissions(MAX_ITEMS_PER_PAGE, 0, this.state.sortBy, this.state.filter);
    flux.getActions('missions').getMissionSources();
    flux.getActions('missions').getCarDutyMissions();
    flux.getActions('employees').getForemans();
    // flux.getActions('companyStructure').getLinearCompanyStructure();
  }

  async refreshList(state = this.state) {
    const filter = toServerFilteringObject(state.filter, this.tableMeta);

    const pageOffset = state.page * MAX_ITEMS_PER_PAGE;
    const missions = await this.context.flux.getActions('missions').getDutyMissions(MAX_ITEMS_PER_PAGE, pageOffset, state.sortBy, filter);

    const { total_count } = missions.result.meta;
    const resultCount = missions.result.rows.length;

    if (resultCount === 0 && total_count > 0) {
      const offset = (Math.ceil(total_count / MAX_ITEMS_PER_PAGE) - 1) * MAX_ITEMS_PER_PAGE;
      this.context.flux.getActions('missions').getDutyMissions(MAX_ITEMS_PER_PAGE, offset, state.sortBy, filter);
    }
  }


  checkDisabled() {
    if (Object.keys(this.state.checkedElements).length !== 0) return false;

    if (this.state.selectedElement === null) {
      return true;
    }
    return this.state.selectedElement.status !== 'assigned';
  }

  completeMission() {
    const mission = _.cloneDeep(this.state.selectedElement);
    mission.status = 'complete';
    this.context.flux.getActions('missions').updateDutyMission(mission, false).then(() => {
      this.refreshList(this.state);
    });
  }

  rejectMission() {
    const reason = prompt('Введите причину', '');
    if (reason) {
      const mission = _.cloneDeep(this.state.selectedElement);
      mission.status = 'fail';
      mission.comment = reason;
      this.context.flux.getActions('missions').updateDutyMission(mission, false).then(() => {
        this.refreshList(this.state);
      });
    }
  }

  removeElement = async () => {
    if (!confirm('Вы уверены, что хотите удалить выбранные элементы?')) return;
    const mission = _.cloneDeep(this.state.selectedElement);
    const query = new Promise((res, rej) => {
      if (mission.status === 'not_assigned') {
        return this.removeElementAction(mission.id).then(() => res());
      }
      return rej();
    });

    query.then(() => {
      this.refreshList(this.state);
      this.setState({
        checkedElements: {},
        selectedElement: null,
      });
    }).catch(() => global.NOTIFICATION_SYSTEM.notify(getWarningNotification('Удалились только задания со статусом "Не назначено"!')));
  }

  completeCheckedElements = async () => {
    if (Object.keys(this.state.checkedElements).length !== 0) {
      const allQuerys = Object.values(this.state.checkedElements).map((mission) => {
        if (mission.status === 'assigned') {
          const updatedMission = _.cloneDeep(mission);
          updatedMission.status = 'complete';
          return this.context.flux.getActions('missions').updateDutyMission(updatedMission, false);
        }
        return Promise.reject();
      });
      try {
        await Promise.all(allQuerys);
      } catch (e) {
        global.NOTIFICATION_SYSTEM.notify(getWarningNotification('Отметить как "Выполненые" можно только назначенные наряд-задания!'));
      }

      this.refreshList(this.state);
      this.setState({ checkedElements: {} });
    } else {
      this.completeMission();
    }
  }

  rejectCheckedElements = async () => {
    if (Object.keys(this.state.checkedElements).length !== 0) {
      const allQuerys = Object.values(this.state.checkedElements).map((mission) => {
        if (mission.status === 'assigned') {
          const reason = prompt(`Введите причину для наряд-задания №${mission.number}`, '');
          if (reason) {
            const updatedMission = _.cloneDeep(mission);
            updatedMission.status = 'fail';
            updatedMission.comment = reason;
            return this.context.flux.getActions('missions').updateDutyMission(updatedMission, false);
          }
        }
        return Promise.reject();
      });
      try {
        await Promise.all(allQuerys);
      } catch (e) {
        global.NOTIFICATION_SYSTEM.notify(getWarningNotification('Отметить как "Невыполненые" можно только назначенные наряд-задания!'));
      }

      this.refreshList(this.state);
      this.setState({ checkedElements: {} });
    } else {
      this.rejectMission();
    }
  }

  removeCheckedElements = async () => {
    if (typeof this.removeElementAction !== 'function') return;

    if (Object.keys(this.state.checkedElements).length !== 0) {
      if (!confirm('Вы уверены, что хотите удалить выбранные элементы?')) return;
      const allQuerys = Object.values(this.state.checkedElements).map((mission) => {
        if (mission.status === 'not_assigned') {
          return this.removeElementAction(mission.id);
        }
        return Promise.reject();
      });

      try {
        await Promise.all(allQuerys);
      } catch (e) {
        global.NOTIFICATION_SYSTEM.notify(getWarningNotification('Удалились только задания со статусом "Не назначено"!'));
      }

      this.refreshList(this.state);
      this.setState({
        checkedElements: {},
        selectedElement: null,
      });
    } else {
      this.removeElement();
    }
  }

  getButtons() {
    const buttons = super.getButtons();
    // TODO отображение 2 кнопорей в зависимости от прав
    buttons.push(
      <ButtonToolbar key={buttons.length}>
        <Button bsSize="small" onClick={this.completeCheckedElements} disabled={this.checkDisabled()}><Glyphicon glyph="ok" /> Отметка о выполнении</Button>
        <Button bsSize="small" onClick={this.rejectCheckedElements} disabled={this.checkDisabled()}><Glyphicon glyph="ban-circle" /> Отметка о невыполнении</Button>
        {/* <Button bsSize="small" onClick={this.handleSubmit}><Glyphicon glyph="download-alt" /></Button>*/}
      </ButtonToolbar>
    );

    return buttons;
  }

  getForms() {
    return (
      <DutyMissionFormWrap
        onFormHide={this.onFormHide}
        showForm={this.state.showForm}
        element={this.state.selectedElement}
        refreshTableList={this.refreshList}
        {...this.props}
      />
    );
  }

  getAdditionalProps() {
    const { structures } = this.context.flux.getStore('session').getCurrentUser();

    const changeSort = (field, direction) =>
      this.setState({ sortBy: getServerSortingField(field, direction, _.get(this.tableMeta, [field, 'sort', 'serverFieldName'])) });

    const changeFilter = filter => this.setState({ filter });

    return {
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
