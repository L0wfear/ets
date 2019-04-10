import * as React from 'react';
import _ from 'lodash';
import * as Button from 'react-bootstrap/lib/Button';

import { MAX_ITEMS_PER_PAGE } from 'constants/ui';
import MissionInfoFormWrap from 'components/missions/mission/MissionInfoForm/MissionInfoFormWrap';
import permissions from 'components/missions/mission/config-data/permissions';
import CheckableElementsList from 'components/CheckableElementsList';
import { connectToStores, staticProps } from 'utils/decorators';
import {
  extractTableMeta,
  getServerSortingField,
  toServerFilteringObject,
} from 'components/ui/table/utils';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import PrintForm from 'components/missions/common/PrintForm';
import Paginator from 'components/ui/new/paginator/Paginator';

import MissionsTable, {
  getTableMeta,
} from 'components/missions/mission/MissionsTable';
import MissionFormLazy from 'components/missions/mission/form/main';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import {
  getSessionState,
  getSomeUniqState,
  getMissionsState,
} from 'redux-main/reducers/selectors';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import missionsActions from 'redux-main/reducers/modules/missions/actions';

const is_archive = true;
const loadingPageName = 'mission-archive';

const ButtonUpdateMission = withRequirePermissionsNew({
  permissions: permissions.update,
})(Button);

@connectToStores(['missions', 'objects', 'employees'])
@staticProps({
  entity: 'mission',
  permissions,
  listName: 'missionList',
  tableComponent: MissionsTable,
  tableMeta: extractTableMeta(getTableMeta()),
  operations: ['LIST', 'READ', 'UPDATE', 'CHECK'],
})
class MissionsArchiveJournal extends CheckableElementsList {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      showPrintForm: false,
      showMissionRejectForm: false,
      showMissionInfoForm: false,
      page: 0,
      sortBy: ['number:desc'],
      filter: {},
    };
  }

  init = async () => {
    this.refreshList();
  };

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
    // this.props.actionResetMissionCancelReasons(); на всякий
    this.props.actionResetMission();
  }

  loadDependecyData = () => {
    const { flux } = this.context;
    const outerPayload = {
      start_date: new Date(),
      end_date: new Date(),
    };

    this.props.actionGetAndSetInStoreMissionCancelReasons();
    flux.getActions('objects').getSomeCars('mission_archive');
    flux.getActions('technicalOperation').getTechnicalOperations();
    flux
      .getActions('missions')
      .getCleaningMunicipalFacilityAllList(outerPayload);
    flux.getActions('technicalOperation').getTechnicalOperationsObjects();
  };

  refreshList = async (state = this.state) => {
    this.setState({
      selectedElement: null,
      checkedElements: {},
      showPrintForm: false,
      showMissionRejectForm: false,
      showMissionInfoForm: false,
    });

    const filter = toServerFilteringObject(state.filter, this.tableMeta);

    const {
      data,
      total_count,
    } = await this.props.actionGetAndSetInStoreMission(
      {
        limit: MAX_ITEMS_PER_PAGE,
        offset: state.page * MAX_ITEMS_PER_PAGE,
        sort_by: state.sortBy,
        filter,
        is_archive,
      },
      { page: loadingPageName },
    );

    if (data.length === 0 && total_count > 0) {
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
      body: `Вы уверены, что хотите вернуть из архива ${
        moreOne ? 'выбранные задания' : 'выбранное задание'
      }?`,
    })
      .then(() =>
        Promise.all(
          Object.entries(checkedElements).map(([id]) =>
            this.context.flux
              .getActions('missions')
              .changeArchiveMissionStatus(id, false),
          ),
        )
          .then(() => {
            this.refreshList();
            global.NOTIFICATION_SYSTEM.notify(
              `${
                moreOne
                  ? 'Выбранные задания перенесены из'
                  : 'Выбранное задание перенесено из'
              } архива`,
            );
          })
          .catch(() => {
            this.refreshList();
          })
          .then(() => {
            this.setState({
              selectedElement: null,
              checkedElements: {},
            });
          }),
      )
      .catch(() => {});
  };

  mapView = async (id) => {
    const { result, warnings = false } = await this.context.flux
      .getActions('missions')
      .getMissionData(id);
    if (warnings && warnings.length > 0) {
      global.NOTIFICATION_SYSTEM.notify(warnings[0], 'error');
    } else {
      this.setState({ mission: result, showMissionInfoForm: true });
    }
  };

  onFormHideMissionForm = (isSubmitted) => {
    if (isSubmitted) {
      this.refreshList();

      this.setState({
        showForm: false,
        selectedElement: null,
        formType: 'ViewForm',
        checkedElements: {},
      });
    } else {
      this.setState({
        showForm: false,
      });
    }
  };

  getForms = () => {
    return [
      <div key={'forms'}>
        <MissionFormLazy
          onFormHide={this.onFormHideMissionForm}
          showForm={this.state.showForm}
          element={this.state.selectedElement}
          page={loadingPageName}
        />
        <MissionInfoFormWrap
          onFormHide={() => this.setState({ showMissionInfoForm: false })}
          showForm={this.state.showMissionInfoForm}
          element={this.state.mission}
          flux={this.context.flux}
        />
        <PrintForm
          onExport={this.processExport}
          show={this.state.showPrintForm}
          onHide={() => this.setState({ showPrintForm: false })}
          title={'Печать журнала заданий'}
        />
      </div>,
    ];
  };

  getButtons = () => {
    const buttons = super.getButtons();

    buttons.push(
      <ButtonUpdateMission
        key="butto-archive-mission"
        bsSize="small"
        onClick={this.archiveCheckedElements}
        disabled={this.checkDisabledArchive()}>
        Вернуть из архива
      </ButtonUpdateMission>,
    );

    return buttons;
  };

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

  getAdditionalProps = () => {
    return {
      mapView: this.mapView,
      changeSort: this.changeSort,
      changeFilter: this.changeFilter,
      filterValues: this.state.filter,
      rowNumberOffset: this.state.page * MAX_ITEMS_PER_PAGE,
      useServerFilter: true,
      useServerSort: true,
      is_archive,
      loadDependecyData: this.loadDependecyData,
    };
  };

  getAdditionalFormProps() {
    return {
      loadingPageName,
    };
  }

  additionalRender = () => {
    return (
      <Paginator
        currentPage={this.state.page}
        maxPage={Math.ceil(this.props.total_count / MAX_ITEMS_PER_PAGE)}
        setPage={(page) => this.setState({ page })}
        firstLastButtons
      />
    );
  };
}

export default compose(
  withPreloader({
    page: loadingPageName,
    typePreloader: 'mainpage',
  }),
  connect(
    (state) => ({
      missionCancelReasonsList: getSomeUniqState(state)
        .missionCancelReasonsList,
      userData: getSessionState(state).userData,
      missionList: getMissionsState(state).missionData.list,
      total_count: getMissionsState(state).missionData.total_count,
    }),
    (dispatch) => ({
      actionGetAndSetInStoreMissionCancelReasons: () =>
        dispatch(
          someUniqActions.actionGetAndSetInStoreMissionCancelReasons(
            {},
            { page: loadingPageName },
          ),
        ),
      actionResetMissionCancelReasons: () =>
        dispatch(
          someUniqActions.actionResetMissionCancelReasons(
            {},
            { page: loadingPageName },
          ),
        ),
      actionGetAndSetInStoreMission: (...arg) =>
        dispatch(missionsActions.actionGetAndSetInStoreMission(...arg)),
      actionResetMission: (...arg) =>
        dispatch(missionsActions.actionResetMission(...arg)),
    }),
  ),
)(MissionsArchiveJournal);
