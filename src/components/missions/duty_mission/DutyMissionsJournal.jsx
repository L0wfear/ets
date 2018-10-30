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
import PrintForm from 'components/missions/common/PrintForm.tsx';
import { rejectMissionsPack } from 'components/missions/common/rejectMissionsPack';

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

    this.state = {
      ...this.state,
      showPrintForm: false,
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
    flux.getActions('companyStructure').getLinearCompanyStructure();
    flux.getActions('technicalOperation').getTechnicalOperationsObjects();
  }

  async refreshList(state = this.state) {
    const filter = toServerFilteringObject(state.filter, this.tableMeta);

    const pageOffset = state.page * MAX_ITEMS_PER_PAGE;
    const missions = await this.context.flux.getActions('missions').getDutyMissions(MAX_ITEMS_PER_PAGE, pageOffset, state.sortBy, filter);

    const { total_count } = missions.result.meta;
    const resultCount = missions.result.rows.length;

    if (resultCount === 0 && total_count > 0) {
      this.setState({ page: (Math.ceil(total_count / MAX_ITEMS_PER_PAGE) - 1) });
    }
  }

  checkDisabledDelete = () => {
    const { checkedElements = {}, selectedElement } = this.state;
    const selectedDutyMissions = Object.values(checkedElements);

    return !(selectedDutyMissions.length || (selectedElement && selectedElement.status === 'not_assigned'));
  }

  checkDisabled() {
    const { checkedElements = {}, selectedElement } = this.state;
    const selectedDutyMissions = Object.values(checkedElements);

    return !(selectedDutyMissions.length || (selectedElement && selectedElement.status === 'assigned'));
  }

  completeMission() {
    const mission = _.cloneDeep(this.state.selectedElement);
    mission.status = 'complete';
    this.context.flux.getActions('missions').updateDutyMission(mission).then(() => {
      this.refreshList(this.state);
      this.setState({ selectedElement: null });
    });
  }

  rejectMission() {
    rejectMissionsPack(
      [this.state.selectedElement],
      {
        updateMission: mission => this.context.flux.getActions('missions').updateDutyMission(mission),
      },
      'dutyMission',
    ).then(() => {
      this.refreshList(this.state);
      this.setState({
        checkedElements: {},
        selectedElement: null,
      });
      global.NOTIFICATION_SYSTEM.notify('Данные успешно сохранены', 'success');
    });
  }

  removeElement = async () => {
    try {
      await confirmDialog({
        title: 'Внимание!',
        body: 'Вы уверены, что хотите удалить выбранный элемент?',
      });
    } catch (er) {
      return;
    }
    const mission = _.cloneDeep(this.state.selectedElement);
    const query = this.removeElementAction(mission.id);

    query.then(() => {
      this.refreshList(this.state);
      this.setState({
        checkedElements: {},
        selectedElement: null,
      });
    }).catch((error) => (
      console.warn(error) // eslint-disable-line
    ));
  }

  completeCheckedElements = async () => {
    const checkedElements = Object.values(this.state.checkedElements);
    if (checkedElements.some(({ status }) => status !== 'assigned')) {
      global.NOTIFICATION_SYSTEM.notify(getWarningNotification('Отметить как "Выполненые" можно только назначенные наряд-задания!'));
      return;
    }
    if (checkedElements.length) {
      const allQuerys = Object.values(this.state.checkedElements).map((mission) => {
        const updatedMission = _.cloneDeep(mission);
        updatedMission.status = 'complete';

        return this.context.flux.getActions('missions').updateDutyMission(updatedMission);
      });
      try {
        await Promise.all(allQuerys);
      } catch (error) {
        console.warn(error); // eslint-disable-line
      }

      this.refreshList(this.state);
      this.setState({
        checkedElements: {},
        selectedElement: null,
      });
    } else {
      this.completeMission();
    }
  }

  rejectCheckedElements = async () => {
    const missions = Object.values(this.state.checkedElements);

    if (missions.some(({ status }) => status !== 'assigned')) {
      global.NOTIFICATION_SYSTEM.notify(getWarningNotification('Отметить как "Не выполненые" можно только назначенные наряд-задания!'));
      return;
    }

    if (missions.length) {
      rejectMissionsPack(
        missions,
        {
          updateMission: mission => this.context.flux.getActions('missions').updateDutyMission(mission),
        },
        'dutyMission',
      ).then(() => {
        this.refreshList(this.state);
        this.setState({ checkedElements: {} });
        global.NOTIFICATION_SYSTEM.notify('Данные успешно сохранены', 'success');
      });
    } else {
      this.rejectMission();
    }
  }

  removeCheckedElements = async () => {
    const missions = Object.values(this.state.checkedElements);

    if (missions.some(({ status }) => status !== 'not_assigned')) {
      global.NOTIFICATION_SYSTEM.notify(getWarningNotification('Удалить можно только задания со статусом "Не назначено"!'));
      return;
    }

    if (missions.length) {
      try {
        await confirmDialog({
          title: 'Внимание!',
          body: 'Вы уверены, что хотите удалить выбранные элементы?',
        });
      } catch (er) {
        return;
      }
      const allQuerys = missions.map((mission) => (
        this.removeElementAction(mission.id)
      ));

      try {
        await Promise.all(allQuerys);
      } catch (error) {
        console.warn(error); // eslint-disable-line
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
    return [
      <div key={'forms'}>
        <DutyMissionFormWrap
          onFormHide={this.onFormHide}
          showForm={this.state.showForm}
          element={this.state.selectedElement}
          refreshTableList={this.refreshList}
          {...this.props}
        />
        <PrintForm
          onExport={this.processExport.bind(this)}
          show={this.state.showPrintForm}
          onHide={() => this.setState({ showPrintForm: false })}
          title={'Печать журнала наряд-заданий'}
        />
      </div>,
    ];
  }

  changeSort(field, direction) {
    this.setState({ sortBy: getServerSortingField(field, direction, _.get(this.tableMeta, [field, 'sort', 'serverFieldName'])) });
  }

  changeFilter(filter) {
    this.setState({ filter });
  }

  getAdditionalProps() {
    return {
      structures: this.props.companyStructureLinearList,
      changeSort: this.changeSort,
      changeFilter: this.changeFilter,
      filterValues: this.state.filter,
      rowNumberOffset: this.state.page * MAX_ITEMS_PER_PAGE,
    };
  }

  export() {
    this.setState({ showPrintForm: true });
  }

  additionalRender() {
    return (
      <Paginator
        currentPage={this.state.page}
        maxPage={Math.ceil(this.props.dutyMissionsTotalCount / MAX_ITEMS_PER_PAGE)}
        setPage={page => this.setState({ page })}
        firstLastButtons
      />
    );
  }
}
