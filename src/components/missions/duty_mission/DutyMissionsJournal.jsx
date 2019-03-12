import React from 'react';
import _ from 'lodash';
import * as Button from 'react-bootstrap/lib/Button';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';

import { MAX_ITEMS_PER_PAGE } from 'constants/ui';
import CheckableElementsList from 'components/CheckableElementsList';
import { getWarningNotification } from 'utils/notifications';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import {
  extractTableMeta,
  getServerSortingField,
  toServerFilteringObject,
} from 'components/ui/table/utils';
import Paginator from 'components/ui/new/paginator/Paginator';
import DutyMissionFormReject from 'components/missions/duty_mission/DutyMissionFormReject';
import Div from 'components/ui/Div';
import PrintForm from 'components/missions/common/PrintForm';
import permissions from 'components/missions/duty_mission/config-data/permissions';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

import DutyMissionsTable, {
  getTableMeta,
} from 'components/missions/duty_mission/DutyMissionsTable';
import DutyMissionFormLazy from 'components/missions/duty_mission/form/main';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import {
  getSessionState,
  getMissionsState,
} from 'redux-main/reducers/selectors';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import missionsActions from 'redux-main/reducers/modules/missions/actions';

const is_archive = false;
const loadingPageName = 'duty_mission';

const ButtonUpdateDutyMission = withRequirePermissionsNew({
  permissions: permissions.update,
})(Button);

@connectToStores(['missions', 'objects', 'employees'])
@exportable({ entity: 'duty_mission' })
@staticProps({
  entity: 'duty_mission',
  permissions,
  listName: 'dutyMissionList',
  tableComponent: DutyMissionsTable,
  tableMeta: extractTableMeta(getTableMeta()),
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE', 'CHECK'],
  exportable: true,
})
class DutyMissionsJournal extends CheckableElementsList {
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

  removeElementAction = (dutyMission) =>
    this.props.actionRemoveDutyMission(dutyMission, { page: loadingPageName });

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

  init() {
    this.refreshList();
  }

  loadDependecyData = () => {
    const { flux } = this.context;
    const outerPayload = {
      start_date: new Date(),
      end_date: new Date(),
    };

    flux.getActions('technicalOperation').getTechnicalOperationsObjects();
    flux.getActions('technicalOperation').getTechnicalOperations();
    flux.getActions('missions').getCarDutyMissions();
    flux.getActions('employees').getForemans();
    flux
      .getActions('missions')
      .getCleaningMunicipalFacilityAllList(outerPayload);
  };

  refreshList = async (state = this.state) => {
    const filter = toServerFilteringObject(state.filter, this.tableMeta);

    this.setState({
      selectedElement: null,
      checkedElements: {},
    });

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

    if (data.length === 0 && total_count > 0) {
      this.setState({ page: Math.ceil(total_count / MAX_ITEMS_PER_PAGE) - 1 });
    }
  };

  checkDisabledDelete = () => {
    const { checkedElements = {}, selectedElement } = this.state;
    const selectedDutyMissions = Object.values(checkedElements);

    return !(
      selectedDutyMissions.length
      || (selectedElement && selectedElement.status === 'not_assigned')
    );
  };

  checkDisabled() {
    const { checkedElements = {}, selectedElement } = this.state;
    const selectedDutyMissions = Object.values(checkedElements);

    return !(
      selectedDutyMissions.length
      || (selectedElement && selectedElement.status === 'assigned')
    );
  }

  checkDisabledArchive = () => {
    const validateMissionsArr = Object.values(this.state.checkedElements);
    const { selectedElement } = this.state;
    if (selectedElement) {
      validateMissionsArr.push(selectedElement);
    }

    return (
      validateMissionsArr.length === 0
      || validateMissionsArr.some(({ status }) => status === 'assigned')
    );
  };

  completeMission = () => {
    const mission = _.cloneDeep(this.state.selectedElement);
    mission.status = 'complete';
    this.props
      .actionUpdateDutyMission(mission, { page: loadingPageName })
      .then(() => {
        this.refreshList(this.state);
      });
  };

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
    const query = this.removeElementAction(mission);

    query
      .then(() => {
        this.refreshList(this.state);
      })
      .catch(
        (error) => console.warn(error), // eslint-disable-line
      );
  };

  completeCheckedElements = async () => {
    const checkedElements = Object.values(this.state.checkedElements);
    if (checkedElements.some(({ status }) => status !== 'assigned')) {
      global.NOTIFICATION_SYSTEM.notify(
        getWarningNotification(
          'Отметить как "Выполнено" можно только назначенные наряд-задания!',
        ),
      );
      return;
    }
    if (checkedElements.length) {
      const allQuerys = Object.values(this.state.checkedElements).map(
        (mission) => {
          const updatedMission = _.cloneDeep(mission);
          updatedMission.status = 'complete';

          return this.props.actionUpdateDutyMission(updatedMission, {
            page: loadingPageName,
          });
        },
      );
      try {
        await Promise.all(allQuerys);
      } catch (error) {
        console.warn(error); // eslint-disable-line
      }

      this.refreshList(this.state);
    } else {
      this.completeMission();
    }
  };

  rejectCheckedElements = async () => {
    const missions = Object.values(this.state.checkedElements);

    if (missions.some(({ status }) => status !== 'assigned')) {
      global.NOTIFICATION_SYSTEM.notify(
        getWarningNotification(
          'Отметить как "Не выполнено" можно только назначенные наряд-задания!',
        ),
      );
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
        global.NOTIFICATION_SYSTEM.notify(
          getWarningNotification(
            'Отметить как "выполнено" можно только назначенные наряд-задания!',
          ),
        );
      }
    }
  };

  handleRejectAll = (allQuery, needUpdate) => {
    Promise.all(allQuery)
      .then(() => {
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
  };

  removeCheckedElements = async () => {
    const missions = Object.values(this.state.checkedElements);

    if (missions.some(({ status }) => status !== 'not_assigned')) {
      global.NOTIFICATION_SYSTEM.notify(
        getWarningNotification(
          'Удалить можно только задания со статусом "Не назначено"!',
        ),
      );
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
      const allQuerys = missions.map((mission) =>
        this.removeElementAction(mission),
      );

      try {
        await Promise.all(allQuerys);
      } catch (error) {
        console.warn(error); // eslint-disable-line
      }

      this.refreshList(this.staet);
    } else {
      this.removeElement().then(() => this.refreshList());
    }
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
      body: `Вы уверены, что хотите перенести в архив ${
        moreOne ? 'выбранные-наряд задания' : 'выбранное наряд-задание'
      }?`,
    })
      .then(() =>
        Promise.all(
          Object.entries(checkedElements).map(([id]) =>
            this.props.actionChangeArchiveDutuMissionStatus(id, true, {
              page: loadingPageName,
            }),
          ),
        )
          .then(() => {
            this.refreshList();
            global.NOTIFICATION_SYSTEM.notify(
              `${
                moreOne
                  ? 'Выбранные наряд-задания перенесены в'
                  : 'Выбранное наряд-задание перенесено в'
              } архив`,
            );
          })
          .catch(() => {
            this.refreshList();
          }),
      )
      .catch(() => {});
  };

  getButtons = () => {
    const buttons = super.getButtons();
    // TODO отображение 2 кнопорей в зависимости от прав
    buttons.push(
      <ButtonUpdateDutyMission
        key="button-complete-mission"
        id="mission-complete"
        bsSize="small"
        onClick={this.completeCheckedElements}
        disabled={this.checkDisabled()}>
        <Glyphicon glyph="ok" /> Отметка о выполнении
      </ButtonUpdateDutyMission>,
      <ButtonUpdateDutyMission
        key="button-reject-mission"
        id="mission-reject"
        bsSize="small"
        onClick={this.rejectCheckedElements}
        disabled={this.checkDisabled()}>
        <Glyphicon glyph="ban-circle" /> Отметка о невыполнении
      </ButtonUpdateDutyMission>,
      <ButtonUpdateDutyMission
        key="button-archive-mission"
        id="mission-archive"
        bsSize="small"
        onClick={this.archiveCheckedElements}
        disabled={this.checkDisabledArchive()}>
        В архив
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
    <div key="DutyMissionFormLazy">
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
      <Div
        key="other-render"
        hidden={this.state.dutyMissionToRejectList.length === 0}>
        <DutyMissionFormReject
          rejectedDutyMission={this.state.dutyMissionToRejectList}
          onRejectAll={this.handleRejectAll}
          page={loadingPageName}
        />
      </Div>
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
    loadDependecyData: this.loadDependecyData,
  });

  getAdditionalFormProps() {
    return {
      loadingPageName,
    };
  }

  export = () => {
    this.setState({ showPrintForm: true });
  };

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
      actionRemoveDutyMission: (...arg) =>
        dispatch(missionsActions.actionRemoveDutyMission(...arg)),
      actionGetAndSetInStoreDutyMission: (...arg) =>
        dispatch(missionsActions.actionGetAndSetInStoreDutyMission(...arg)),
      actionResetDutyMission: (...arg) =>
        dispatch(missionsActions.actionResetDutyMission(...arg)),
      actionUpdateDutyMission: (...arg) =>
        dispatch(missionsActions.actionUpdateDutyMission(...arg)),
      actionChangeArchiveDutuMissionStatus: (...arg) =>
        dispatch(missionsActions.actionChangeArchiveDutuMissionStatus(...arg)),
    }),
  ),
)(DutyMissionsJournal);
