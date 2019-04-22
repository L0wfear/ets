import React from 'react';
import { cloneDeep, get } from 'lodash';
import * as Button from 'react-bootstrap/lib/Button';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';

import { getWarningNotification } from 'utils/notifications';

import { MAX_ITEMS_PER_PAGE } from 'constants/ui';
import MissionInfoFormWrap from 'components/new/ui/mission_info_form/MissionInfoFormWrap';
import permissions from 'components/missions/mission/config-data/permissions';
import order_permissions from 'components/directories/order/config-data/permissions';
import CheckableElementsList from 'components/CheckableElementsList';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
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
import MissionFormLazy from 'components/new/pages/missions/mission/form/main';
import MissionRejectForm from 'components/missions/mission/MissionRejectForm';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import {
  getSessionState,
  getSomeUniqState,
  getMissionsState,
} from 'redux-main/reducers/selectors';
import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

import { loadMoscowTime } from 'redux-main/trash-actions/uniq/promise';
import { diffDates } from 'utils/dates';
import moment from 'moment';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import missionsActions from 'redux-main/reducers/modules/missions/actions';

const is_archive = false;
const loadingPageName = 'mission';

const ButtonGoFaxogramm = withRequirePermissionsNew({
  permissions: order_permissions.list,
})(Button);
const ButtonUpdateMission = withRequirePermissionsNew({
  permissions: permissions.update,
})(Button);

@connectToStores(['missions', 'objects', 'employees'])
@exportable({ entity: 'mission' })
@staticProps({
  entity: 'mission',
  permissions,
  listName: 'missionList',
  tableComponent: MissionsTable,
  tableMeta: extractTableMeta(getTableMeta()),
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE', 'CHECK'],
})
class MissionsJournal extends CheckableElementsList {
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
      action_at: null,
      completeMarkerBtnDisable: false,
    };
  }

  async init() {
    this.refreshList(this.state);
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
    // this.props.actionResetMissionCancelReasons(); на всякий
    this.props.actionResetMission();
  }

  loadDependecyData = () => {
    const { flux } = this.context;
    const outerPayload = {
      start_date: new Date(),
      end_date: new Date(),
    };

    flux.getActions('objects').getSomeCars('MissionCarService');
    flux.getActions('technicalOperation').getTechnicalOperations();
    flux
      .getActions('missions')
      .getCleaningMunicipalFacilityAllList(outerPayload);
    flux.getActions('technicalOperation').getTechnicalOperationsObjects();
    this.props.actionGetAndSetInStoreMissionCancelReasons();
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

  removeElementAction = (id) => {
    return this.props.actionRemoveMission(id, { page: loadingPageName });
  };
  removeElementCallback = () => {
    global.NOTIFICATION_SYSTEM.notify('Данные успешно удалены', 'success');
    this.refreshList();
  };

  checkDisabled = () => {
    const validateMissionsArr = Object.values(this.state.checkedElements);
    const { selectedElement } = this.state;
    if (selectedElement) {
      validateMissionsArr.push(selectedElement);
    }

    return (
      !validateMissionsArr.length
      || !validateMissionsArr.every(({ can_be_closed }) => can_be_closed)
    );
  };

  checkDisabledDelete = () =>
    super.checkDisabledDelete()
    || (this.state.selectedElement
      && this.state.selectedElement.status !== 'not_assigned')
    || Object.values(this.state.checkedElements).some(
      (el) => el.status !== 'not_assigned',
    );

  checkDisabledArchive = () => {
    const validateMissionsArr = Object.values(this.state.checkedElements);
    const { selectedElement } = this.state;
    if (selectedElement) {
      validateMissionsArr.push(selectedElement);
    }

    return (
      !validateMissionsArr.length
      || validateMissionsArr.some(
        ({ status }) =>
          status === 'assigned'
          || status === 'in_progress'
          || status === 'expired',
      )
    );
  };

  rejectMission = () => {
    loadMoscowTime()
      .then(({ time }) => {
        const action_at = time.date;
        this.setState({
          showMissionRejectForm: true,
          action_at,
        });
      })
      .catch(({ errorIsShow }) => {
        if (!errorIsShow) {
          global.NOTIFICATION_SYSTEM.notify(
            getWarningNotification('Произошла непредвиденная ошибка!'),
          );
        }
        this.refreshList(this.state);
        this.setState({ checkedElements: {} });
      });
  };

  actionCompleteMissions = async (correctMissionsList, action_at) => {
    try {
      await Promise.all(
        correctMissionsList.map((mission) =>
          this.props.actionUpdateMission(
            {
              ...cloneDeep(mission),
              status: 'complete',
              action_at,
            },
            { page: loadingPageName },
          ),
        ),
      );

      global.NOTIFICATION_SYSTEM.notify('Данные успешно сохранены', 'success');
    } catch ({ errorIsShow }) {
      if (!errorIsShow) {
        global.NOTIFICATION_SYSTEM.notify(
          getWarningNotification('Произошла непредвиденная ошибка!'),
        );
      }
    }

    this.refreshList(this.state);
    this.setState({ checkedElements: {} });
  };

  completeCheckedElements = () => {
    const { selectedElement } = this.state;
    const missionsObj = this.state.checkedElements || {};
    let action_at = null;
    if (selectedElement && Object.values(missionsObj).length === 0) {
      missionsObj[selectedElement.id] = selectedElement;
    }
    const missionList = Object.values(missionsObj);

    loadMoscowTime()
      .then(({ time }) => {
        action_at = time.date;
        if (this.state.selectedElement || missionList.length > 1) {
          const correctMissionsList = missionList.filter((mission) => {
            if (diffDates(moment(mission.date_start), moment(time.date)) >= 0) {
              global.NOTIFICATION_SYSTEM.notify(
                getWarningNotification(
                  `Невозможно изменить статус задания ${
                    mission.number
                  } до начала его выполнения`,
                ),
              );
              return false;
            }
            return true;
          });
          if (correctMissionsList.length) {
            this.actionCompleteMissions(correctMissionsList, action_at);
          }
        }
      })
      .catch(({ errorIsShow }) => {
        if (!errorIsShow) {
          global.NOTIFICATION_SYSTEM.notify(
            getWarningNotification('Произошла непредвиденная ошибка!'),
          );
        }
        this.refreshList(this.state);
        this.setState({ checkedElements: {} });
      });
  };

  rejectCheckedElements = () => {
    this.rejectMission();
  };

  removeCheckedElements = () => {
    this.defActionFunc({
      bodyConfirmDialog: 'Вы уверены, что хотите удалить выбранные элементы?',
      callbackForCheckedElement: this.removeElementAction,
      callBackForOneElement: this.removeElement,
      notifyText: 'Данные успешно удалены',
    });
  };

  removeElement = () =>
    confirmDialog({
      title: 'Внимание',
      body: 'Вы уверены, что хотите удалить выбранные элементы?',
    })
      .then(() => {
        const { selectedElement = {} } = this.state;
        const id = selectedElement[this.selectField];

        return this.removeElementAction(id, false)
          .then(() => {
            this.setState({
              checkedElements: {},
              selectedElement: null,
            });
            global.NOTIFICATION_SYSTEM.notify('Данные успешно удалены');
          })
          .catch(
            ({ errorIsShow }) =>
              !errorIsShow
              && global.NOTIFICATION_SYSTEM.notify(
                'Произошла ошибка при удалении',
                'error',
              ),
          );
      })
      .catch(() => {});

  defActionFunc = ({
    bodyConfirmDialog,
    callbackForCheckedElement,
    callBackForOneElement,
    notifyText,
  }) => {
    const { checkedElements = {} } = this.state;

    const checkElList = Object.values(checkedElements);
    const countCheckEl = checkElList.length;

    if (countCheckEl !== 0) {
      confirmDialog({
        title: 'Внимание',
        body: bodyConfirmDialog,
      })
        .then(() => {
          const elList = Array(countCheckEl).fill(false);

          checkElList.forEach((el, i) => {
            callbackForCheckedElement(el[this.selectField], false)
              .then(() => {
                elList[i] = true;
                if (!elList.some((elD) => !elD)) {
                  this.refreshList();
                  global.NOTIFICATION_SYSTEM.notify(notifyText);
                }
              })
              .catch(({ errorIsShow }) => {
                elList[i] = true;
                if (!elList.some((elD) => !elD)) {
                  this.refreshList();
                  if (!errorIsShow) {
                    global.NOTIFICATION_SYSTEM.notify(notifyText);
                  }
                }
              });
          });
          this.setState({
            checkedElements: {},
            selectedElement: null,
          });
        })
        .catch(() => {});
    } else {
      callBackForOneElement().then(() => {
        this.refreshList();
      });
    }
  };

  onReject = (refresh) => {
    const newPropsState = {
      showMissionRejectForm: false,
    };
    if (refresh) {
      this.refreshList(this.state);
    } else {
      this.setState({ ...newPropsState });
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
        moreOne ? 'выбранные задания' : 'выбранное задание'
      }?`,
    })
      .then(() =>
        Promise.all(
          Object.entries(checkedElements).map(([id]) =>
            this.context.flux
              .getActions('missions')
              .changeArchiveMissionStatus(id, true),
          ),
        )
          .then(() => {
            this.refreshList();
            global.NOTIFICATION_SYSTEM.notify(
              `${
                moreOne
                  ? 'Выбранные задания перенесены в'
                  : 'Выбранное задание перенесено в'
              } архив`,
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

  getForms = () => [
    <div key="forms">
      <MissionFormLazy
        onFormHide={this.onFormHideMissionForm}
        showForm={this.state.showForm}
        element={this.state.selectedElement}
        page={loadingPageName}
      />
      {this.state.showMissionRejectForm && (
        <MissionRejectForm
          show={this.state.showMissionRejectForm}
          onReject={this.onReject}
          mission={this.state.selectedElement}
          missions={this.state.checkedElements}
          action_at={this.state.action_at}
        />
      )}
      <MissionInfoFormWrap
        onFormHide={() => this.setState({ showMissionInfoForm: false })}
        showForm={this.state.showMissionInfoForm}
        element={this.state.mission}
      />
      <PrintForm
        onExport={this.processExport}
        show={this.state.showPrintForm}
        onHide={() => this.setState({ showPrintForm: false })}
        title="Печать журнала заданий"
      />
    </div>,
  ];

  goToOrders = () => {
    this.props.history.push('/orders');
  };

  getbuttonAddCZ = () => (
    <div key="00.1" className="container-button-create-cz">
      <ButtonGoFaxogramm
        bsSize="small"
        bsStyle="success"
        onClick={this.goToOrders}
        disabled={false}>
        <Glyphicon glyph="plus" /> Исполнение централизованного задания
      </ButtonGoFaxogramm>
    </div>
  );

  getButtons = () => {
    const superButtons = super.getButtons({
      BCbuttonName: 'Создать децентрализованное задание',
    });

    const buttons = [
      superButtons[0],
      this.getbuttonAddCZ(),
      ...superButtons.slice(1),
    ];

    buttons.push(
      <ButtonUpdateMission
        key="button-complete-mission"
        id="mission-complete"
        bsSize="small"
        onClick={this.completeCheckedElements}
        disabled={this.checkDisabled() || this.state.completeMarkerBtnDisable}>
        <Glyphicon glyph="ok" /> Выполнено
      </ButtonUpdateMission>,
      <ButtonUpdateMission
        key="butto-reject-mission"
        id="mission-reject"
        bsSize="small"
        onClick={this.rejectCheckedElements}
        disabled={this.checkDisabled()}>
        <Glyphicon glyph="ban-circle" /> Не выполнено / Отменено
      </ButtonUpdateMission>,
      <ButtonUpdateMission
        key="butto-archive-mission"
        id="mission-archive"
        bsSize="small"
        onClick={this.archiveCheckedElements}
        disabled={this.checkDisabledArchive()}>
        В архив
      </ButtonUpdateMission>,
    );
    return buttons;
  };

  changeSort = (field, direction) => {
    this.setState({
      sortBy: getServerSortingField(
        field,
        direction,
        get(this.tableMeta, [field, 'sort', 'serverFieldName']),
      ),
    });
  };

  changeFilter = (filter) => {
    this.setState({ filter });
  };

  getAdditionalProps = () => ({
    mapView: this.mapView,
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
      userData: getSessionState(state).userData,
      missionCancelReasonsList: getSomeUniqState(state)
        .missionCancelReasonsList,
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
      actionUpdateMission: (...arg) =>
        dispatch(missionsActions.actionUpdateMission(...arg)),
      actionRemoveMission: (...arg) =>
        dispatch(missionsActions.actionRemoveMission(...arg)),
    }),
  ),
)(MissionsJournal);
