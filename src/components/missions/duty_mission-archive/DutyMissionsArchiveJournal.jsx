import React from 'react';
import _ from 'lodash';
import * as Button from 'react-bootstrap/lib/Button';

import { MAX_ITEMS_PER_PAGE } from 'constants/ui';
import CheckableElementsList from 'components/CheckableElementsList';
import { connectToStores, staticProps } from 'utils/decorators';
import {
  extractTableMeta,
  getServerSortingField,
  toServerFilteringObject,
} from 'components/ui/table/utils';
import Paginator from 'components/ui/new/paginator/Paginator';
import PrintForm from 'components/missions/common/PrintForm';
import permissions from 'components/missions/duty_mission/config-data/permissions';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

import DutyMissionsTable, {
  getTableMeta,
} from 'components/missions/duty_mission/DutyMissionsTable';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import {
  getSessionState,
  getMissionsState,
} from 'redux-main/reducers/selectors';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import DutyMissionFormLazy from 'components/missions/duty_mission/form/main';

const is_archive = true;
const loadingPageName = 'duty-mission-archive';

const ButtonUpdateDutyMission = withRequirePermissionsNew({
  permissions: permissions.update,
})(Button);

@connectToStores(['missions', 'objects', 'employees'])
@staticProps({
  entity: 'duty_mission',
  permissions,
  listName: 'dutyMissionList',
  tableComponent: DutyMissionsTable,
  tableMeta: extractTableMeta(getTableMeta()),
  operations: ['LIST', 'READ', 'UPDATE', 'CHECK'],
  exportable: true,
})
class DutyMissionsArchiveJournal extends CheckableElementsList {
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
      prevState.page !== this.state.page
      || prevState.sortBy !== this.state.sortBy
      || prevState.filter !== this.state.filter
    ) {
      this.refreshList(this.state);
    }
  }

  componentWillUnmount() {
    this.props.actionResetDutyMission();
  }

  init = () => {
    this.refreshList();
  };

  loadDependecyData = () => {
    const { flux } = this.context;
    const outerPayload = {
      start_date: new Date(),
      end_date: new Date(),
    };

    this.refreshList();
    flux.getActions('technicalOperation').getTechnicalOperations();
    flux.getActions('missions').getCarDutyMissions();
    flux.getActions('employees').getForemans();
    flux
      .getActions('missions')
      .getCleaningMunicipalFacilityAllList(outerPayload);
    flux.getActions('technicalOperation').getTechnicalOperationsObjects();
  };

  refreshList = async (state = this.state) => {
    const filter = toServerFilteringObject(state.filter, this.tableMeta);

    const {
      data,
      total_count,
    } = await this.props.actionGetAndSetInStoreDutyMission(
      {
        limit: MAX_ITEMS_PER_PAGE,
        offset: state.page * MAX_ITEMS_PER_PAGE,
        sort_by: state.sortBy,
        filter,
        is_archive,
      },
      { page: loadingPageName },
    );

    if (data === 0 && total_count > 0) {
      this.setState({ page: Math.ceil(total_count / MAX_ITEMS_PER_PAGE) - 1 });
    }
  };

  checkDisabledArchive = () => {
    const validateMissionsArr = Object.values(this.state.checkedElements);
    const { selectedElement } = this.state;
    if (selectedElement) {
      validateMissionsArr.push(selectedElement);
    }

    return validateMissionsArr.length === 0;
  };

  archiveCheckedElements = () => {
    const { selectedElement } = this.state;
    const { checkedElements = {} } = this.state;

    if (selectedElement) {
      checkedElements[selectedElement[this.selectField]] = selectedElement;
    }

    const moreOne = Object.keys(checkedElements).length > 1;

    confirmDialog({
      title: 'Внимание',
      body: `Вы уверены, что хотите перенести из архива ${
        moreOne ? 'выбранные-наряд задания' : 'выбранное наряд-задание'
      }?`,
    })
      .then(() =>
        Promise.all(
          Object.entries(checkedElements).map(([id]) =>
            this.props.actionChangeArchiveDutuMissionStatus(id, false, {
              page: loadingPageName,
            }),
          ),
        )
          .then(() => {
            global.NOTIFICATION_SYSTEM.notify(
              `${
                moreOne
                  ? 'Выбранные наряд-задания перенесены из'
                  : 'Выбранное наряд-задание перенесено из'
              } архива`,
            );
          })
          .catch(() => {})
          .then(() => {
            this.refreshList();
            this.setState({
              selectedElement: null,
              checkedElements: {},
            });
          }),
      )
      .catch(() => {});
  };

  getButtons = () => {
    const buttons = super.getButtons();

    buttons.push(
      <ButtonUpdateDutyMission
        key="button-archive-mission"
        bsSize="small"
        onClick={this.archiveCheckedElements}
        disabled={this.checkDisabledArchive()}>
        Перенести из архива
      </ButtonUpdateDutyMission>,
    );

    return buttons;
  };

  onDutyMissionFormLazyHide = (isSubmitted) => {
    if (isSubmitted) {
      this.refreshList();
    }

    this.setState({
      showForm: false,
      selectedElement: null,
      formType: 'ViewForm',
      checkedElements: {},
    });
  };

  getForms = () => [
    <div key="forms">
      <DutyMissionFormLazy
        onFormHide={this.onDutyMissionFormLazyHide}
        showForm={this.state.showForm}
        element={this.state.selectedElement}
        page={loadingPageName}
      />
      <PrintForm
        onExport={this.processExport}
        show={this.state.showPrintForm}
        onHide={() => this.setState({ showPrintForm: false })}
        title="Печать журнала наряд-заданий"
      />
    </div>,
  ];

  changeSort = (field, direction) => {
    this.setState({
      sortBy: getServerSortingField(
        field,
        direction,
        _.get(this.tableMeta, [field, 'sort', 'serverFieldName']),
      ),
    });
  };

  changeFilter = (filter) => {
    this.setState({ filter });
  };

  getAdditionalProps = () => ({
    changeSort: this.changeSort,
    changeFilter: this.changeFilter,
    filterValues: this.state.filter,
    rowNumberOffset: this.state.page * MAX_ITEMS_PER_PAGE,
    useServerFilter: true,
    useServerSort: true,
    is_archive,
    loadDependecyData: this.loadDependecyData,
  });

  getAdditionalFormProps() {
    return {
      loadingPageName,
    };
  }

  setNewPage = (page) => this.setState({ page });

  additionalRender = () => [
    <Paginator
      key="paginator"
      currentPage={this.state.page}
      maxPage={Math.ceil(this.props.total_count / MAX_ITEMS_PER_PAGE)}
      setPage={this.setNewPage}
      firstLastButtons
    />,
  ];
}

export default compose(
  withPreloader({
    page: loadingPageName,
    typePreloader: 'mainpage',
  }),
  connect(
    (state) => ({
      userData: getSessionState(state).userData,
      dutyMissionList: getMissionsState(state).dutyMissionData.dutyMissionList,
      total_count: getMissionsState(state).dutyMissionData.total_count,
    }),
    (dispatch) => ({
      actionGetAndSetInStoreDutyMission: (...arg) =>
        dispatch(missionsActions.actionGetAndSetInStoreDutyMission(...arg)),
      actionResetDutyMission: (...arg) =>
        dispatch(missionsActions.actionResetDutyMission(...arg)),
      actionChangeArchiveDutuMissionStatus: (...arg) =>
        dispatch(missionsActions.actionChangeArchiveDutuMissionStatus(...arg)),
    }),
  ),
)(DutyMissionsArchiveJournal);
