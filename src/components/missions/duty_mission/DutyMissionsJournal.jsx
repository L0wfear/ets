import React from 'react';
import _ from 'lodash';
import * as Button from 'react-bootstrap/lib/Button';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import * as ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';

import { MAX_ITEMS_PER_PAGE } from 'constants/ui';
import CheckableElementsList from 'components/CheckableElementsList';
import { getWarningNotification } from 'utils/notifications';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import { extractTableMeta, getServerSortingField, toServerFilteringObject } from 'components/ui/table/utils';
import Paginator from 'components/ui/new/paginator/Paginator';
import DutyMissionFormReject from 'components/missions/duty_mission/DutyMissionFormReject';
import Div from 'components/ui/Div';
import PrintForm from 'components/missions/common/PrintForm';
import permissions from 'components/missions/duty_mission/config-data/permissions';
import enhanceWithPermissions from 'components/util/RequirePermissionsNew';

import DutyMissionsTable, { getTableMeta } from 'components/missions/duty_mission/DutyMissionsTable';
import DutyMissionFormWrap from 'components/missions/duty_mission/DutyMissionFormWrap';
import { compose } from 'recompose';

const is_archive = false;

const ButtonUpdateDutyMission = enhanceWithPermissions({
  permission: permissions.update,
})(Button);

@connectToStores(['missions', 'objects', 'employees'])
@exportable({ entity: 'duty_mission' })
@staticProps({
  entity: 'duty_mission',
  permissions,
  listName: 'dutyMissionsList',
  tableComponent: DutyMissionsTable,
  tableMeta: extractTableMeta(getTableMeta()),
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE', 'CHECK'],
  exportable: true,
})
class DutyMissionsJournal extends CheckableElementsList {

  constructor(props, context) {
    super(props);

    this.removeElementAction = id => context.flux.getActions('missions').removeDutyMission(id);

    this.state = {
      ...this.state,
      showPrintForm: false,
      page: 0,
      sortBy: ['number:desc'],
      filter: {},
      dutyMissionToRejectList: [],
    };
  }

  componentDidUpdate(nextProps, prevState) {
    if (
      prevState.page !== this.state.page ||
      prevState.sortBy !== this.state.sortBy ||
      prevState.filter !== this.state.filter
    ) {
      this.refreshList(this.state);
    }
  }

  init() {
    const { flux } = this.context;
    const linear = true;
    const outerPayload = {
      start_date: new Date(),
      end_date: new Date(),
    };

    flux.getActions('companyStructure').getCompanyStructure(linear);
    flux.getActions('technicalOperation').getTechnicalOperations();
    flux.getActions('missions').getDutyMissions(MAX_ITEMS_PER_PAGE, 0, this.state.sortBy, this.state.filter, is_archive);
    flux.getActions('missions').getMissionSources();
    flux.getActions('missions').getCarDutyMissions();
    flux.getActions('employees').getForemans();
    flux.getActions('missions').getCleaningMunicipalFacilityAllList(outerPayload);
    flux.getActions('companyStructure').getCompanyStructure(linear);
    flux.getActions('technicalOperation').getTechnicalOperationsObjects();
  }

  refreshList = async (state = this.state) => {
    const filter = toServerFilteringObject(state.filter, this.tableMeta);

    this.setState({
      selectedElement: null,
      checkedElements: {},
    });

    const missions = await this.context.flux.getActions('missions').getDutyMissions(MAX_ITEMS_PER_PAGE, state.page * MAX_ITEMS_PER_PAGE, state.sortBy, filter, is_archive);

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
  checkDisabledArchive = () => {
    const validateMissionsArr = Object.values(this.state.checkedElements);
    const { selectedElement } = this.state;
    if (selectedElement) {
      validateMissionsArr.push(selectedElement);
    }

    return validateMissionsArr.length === 0 || validateMissionsArr.some(({ status }) => status === 'assigned');
  }

  completeMission = () => {
    const mission = _.cloneDeep(this.state.selectedElement);
    mission.status = 'complete';
    this.context.flux.getActions('missions').updateDutyMission(mission).then(() => {
      this.refreshList(this.state);
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
    }).catch((error) => (
      console.warn(error) // eslint-disable-line
    ));
  }

  completeCheckedElements = async () => {
    const checkedElements = Object.values(this.state.checkedElements);
    if (checkedElements.some(({ status }) => status !== 'assigned')) {
      global.NOTIFICATION_SYSTEM.notify(getWarningNotification('Отметить как "Выполнено" можно только назначенные наряд-задания!'));
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
    } else {
      this.completeMission();
    }
  }

  rejectCheckedElements = async () => {
    const missions = Object.values(this.state.checkedElements);

    if (missions.some(({ status }) => status !== 'assigned')) {
      global.NOTIFICATION_SYSTEM.notify(getWarningNotification('Отметить как "Не выполнено" можно только назначенные наряд-задания!'));
      return;
    }

    if (missions.length) {
      this.setState({
        dutyMissionToRejectList: missions,
        selectedElement: null,
        checkedElements: {},
      });
    } else {
      const mission = this.state.selectedElement;
      if (mission.status === 'assigned') {
        this.setState({
          dutyMissionToRejectList: [mission],
          selectedElement: null,
          checkedElements: {},
        });
      } else {
        global.NOTIFICATION_SYSTEM.notify(getWarningNotification('Отметить как "выполнено" можно только назначенные наряд-задания!'));
      }
    }
  }

  handleRejectAll = (allQuery, needUpdate) => {
    Promise.all(allQuery).then(() => {
      if (needUpdate) {
        this.refreshList(this.state);
      }
      this.setState({
        dutyMissionToRejectList: [],
      });
    })
    .catch(() => {
      this.setState({
        dutyMissionToRejectList: [],
      });
    });
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
          body: 'Вы уверены, что хотите удалить выбранные элементы ?',
        });
      } catch (err) {
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

      this.refreshList(this.staet);
    } else {
      this.removeElement()
        .then(() => this.refreshList());
    }
  }

  archiveCheckedElements = () => {
    const { selectedElement } = this.state;
    const { checkedElements = {} } = this.state;

    if (selectedElement) {
      checkedElements[selectedElement[this.selectField]] = selectedElement;
    }

    const moreOne = Object.keys(checkedElements).length > 1;

    confirmDialog({
      title: 'Внимание',
      body: `Вы уверены, что хотите перенести в архив ${moreOne ? 'выбранные-наряд задания' : 'выбранное наряд-задание'}?`,
    })
    .then(() =>
        Promise.all(
          Object.entries(checkedElements).map(([id]) =>
            this.context.flux.getActions('missions').changeArchiveDutuMissionStatus(id, true),
          )
        ).then(() => {
          this.refreshList();
          global.NOTIFICATION_SYSTEM.notify(`${moreOne ? 'Выбранные наряд-задания перенесены в' : 'Выбранное наряд-задание перенесено в'} архив`);
        })
        .catch(() => {
          this.refreshList();
        })
    )
    .catch(() => {});
  }

  getButtons = () => {
    const buttons = super.getButtons();
    // TODO отображение 2 кнопорей в зависимости от прав
    buttons.push(
      <ButtonUpdateDutyMission key="button-complete-mission" bsSize="small" onClick={this.completeCheckedElements} disabled={this.checkDisabled()}><Glyphicon glyph="ok" /> Отметка о выполнении</ButtonUpdateDutyMission>,
      <ButtonUpdateDutyMission key="button-reject-mission" bsSize="small" onClick={this.rejectCheckedElements} disabled={this.checkDisabled()}><Glyphicon glyph="ban-circle" /> Отметка о невыполнении</ButtonUpdateDutyMission>,
      <ButtonUpdateDutyMission key="button-archive-mission" bsSize="small" onClick={this.archiveCheckedElements} disabled={this.checkDisabledArchive()}>В архив</ButtonUpdateDutyMission>,
    );

    return buttons;
  }

  getForms = () => {
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
          onExport={this.processExport}
          show={this.state.showPrintForm}
          onHide={() => this.setState({ showPrintForm: false })}
          title={'Печать журнала наряд-заданий'}
        />
        <Div key={'other-render'} hidden={this.state.dutyMissionToRejectList.length === 0} >
          <DutyMissionFormReject
            rejectedDutyMission={this.state.dutyMissionToRejectList}
            onRejectAll={this.handleRejectAll}
          />
        </Div>
      </div>,
    ];
  }

  changeSort = (field, direction) => {
    this.setState({ sortBy: getServerSortingField(field, direction, _.get(this.tableMeta, [field, 'sort', 'serverFieldName'])) });
  }

  changeFilter = (filter) => {
    this.setState({ filter });
  }

  getAdditionalProps = () => {
    return {
      structures: this.props.companyStructureLinearList,
      changeSort: this.changeSort,
      changeFilter: this.changeFilter,
      filterValues: this.state.filter,
      rowNumberOffset: this.state.page * MAX_ITEMS_PER_PAGE,
      useServerFilter: true,
      useServerSort: true,
    };
  }

  export = () => {
    this.setState({ showPrintForm: true });
  }

  additionalRender = () => {
    return [
      <Paginator
        key="paginator"
        currentPage={this.state.page}
        maxPage={Math.ceil(this.props.dutyMissionsTotalCount / MAX_ITEMS_PER_PAGE)}
        setPage={page => this.setState({ page })}
        firstLastButtons
      />,
    ];
  }
}

export default compose()(DutyMissionsJournal);
