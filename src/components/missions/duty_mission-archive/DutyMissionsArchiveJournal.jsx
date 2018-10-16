import React from 'react';
import _ from 'lodash';
import { Button } from 'react-bootstrap';

import { MAX_ITEMS_PER_PAGE } from 'constants/ui';
import CheckableElementsList from 'components/CheckableElementsList';
import { connectToStores, staticProps } from 'utils/decorators';
import { extractTableMeta, getServerSortingField, toServerFilteringObject } from 'components/ui/table/utils';
import Paginator from 'components/ui/new/paginator/Paginator';
import PrintForm from 'components/missions/common/PrintForm';
import permissions from 'components/missions/duty_mission/config-data/permissions';
import enhanceWithPermissions from 'components/util/RequirePermissionsNew';

import DutyMissionsTable, { getTableMeta } from 'components/missions/duty_mission/DutyMissionsTable';
import DutyMissionFormWrap from 'components/missions/duty_mission/DutyMissionFormWrap';


const is_archive = true;

const ButtonUpdateDutyMission = enhanceWithPermissions({
  permission: permissions.update,
})(Button);

@connectToStores(['missions', 'objects', 'employees'])
@staticProps({
  entity: 'duty_mission',
  permissions,
  listName: 'dutyMissionsList',
  tableComponent: DutyMissionsTable,
  tableMeta: extractTableMeta(getTableMeta()),
  operations: ['LIST', 'READ', 'UPDATE', 'CHECK'],
  exportable: true,
})
export default class DutyMissionsArchiveJournal extends CheckableElementsList {

  constructor(props) {
    super(props);

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

  init = () => {
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

    const missions = await this.context.flux.getActions('missions').getDutyMissions(MAX_ITEMS_PER_PAGE, state.page * MAX_ITEMS_PER_PAGE, state.sortBy, filter, is_archive);

    const { total_count } = missions.result.meta;
    const resultCount = missions.result.rows.length;

    if (resultCount === 0 && total_count > 0) {
      const offset = (Math.ceil(total_count / MAX_ITEMS_PER_PAGE) - 1) * MAX_ITEMS_PER_PAGE;
      this.context.flux.getActions('missions').getDutyMissions(MAX_ITEMS_PER_PAGE, offset, state.sortBy, filter, is_archive);
    }
  }

  checkDisabledArchive = () => {
    const validateMissionsArr = Object.values(this.state.checkedElements);
    const { selectedElement } = this.state;
    if (selectedElement) {
      validateMissionsArr.push(selectedElement);
    }

    return validateMissionsArr.length === 0;
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
      body: `Вы уверены, что хотите перенести из архива ${moreOne ? 'выбранные-наряд задания' : 'выбранное наряд-задание'}?`,
    })
    .then(() =>
        Promise.all(
          Object.entries(checkedElements).map(([id]) =>
            this.context.flux.getActions('missions').changeArchiveDutuMissionStatus(id, false),
          )
        ).then(() => {
          this.refreshList();
          global.NOTIFICATION_SYSTEM.notify(`${moreOne ? 'Выбранные наряд-задания перенесены из' : 'Выбранное наряд-задание перенесено из'} архива`);
        })
        .catch(() => {
          this.refreshList();
        })
        .then(() => {
          this.setState({
            selectedElement: null,
            checkedElements: {},
          });
        })
    )
    .catch(() => {});
  }

  getButtons = () => {
    const buttons = super.getButtons();

    buttons.push(
      <ButtonUpdateDutyMission key="button-archive-mission" bsSize="small" onClick={this.archiveCheckedElements} disabled={this.checkDisabledArchive()}>Перенести из архива</ButtonUpdateDutyMission>,
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
      is_archive,
    };
  }

  additionalRender = () => {
    return [
      <Paginator
        key={'paginator'}
        currentPage={this.state.page}
        maxPage={Math.ceil(this.props.dutyMissionsTotalCount / MAX_ITEMS_PER_PAGE)}
        setPage={page => this.setState({ page })}
        firstLastButtons
      />,
    ];
  }
}
