import React from 'react';
import { autobind } from 'core-decorators';
import {
  cloneDeep,
  get,
} from 'lodash';
import {
  Button,
  Glyphicon,
} from 'react-bootstrap';
import { getWarningNotification } from 'utils/notifications';

import { MAX_ITEMS_PER_PAGE } from 'constants/ui';
import MissionInfoFormWrap from 'components/missions/mission/MissionInfoForm/MissionInfoFormWrap';
import permissions from 'components/missions/mission/config-data/permissions';
import order_permissions from 'components/directories/order/config-data/permissions';
import CheckableElementsList from 'components/CheckableElementsList.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import { extractTableMeta, getServerSortingField } from 'components/ui/table/utils';
import enhanceWithPermissions from 'components/util/RequirePermissionsNew.tsx';
import PrintForm from 'components/missions/common/PrintForm.tsx';

import Paginator from 'components/ui/Paginator.jsx';
import MissionsTable, { getTableMeta } from 'components/missions/mission/MissionsTable.jsx';
import MissionFormWrap from 'components/missions/mission/MissionFormWrap';
import MissionRejectForm from 'components/missions/mission/MissionRejectForm.jsx';

const is_archive = false;

const ButtonGoFaxogramm = enhanceWithPermissions({
  permission: order_permissions.list,
})(Button);
const ButtonUpdateMission = enhanceWithPermissions({
  permission: permissions.update,
})(Button);

@connectToStores(['missions', 'objects', 'employees', 'routes'])
@exportable({ entity: 'mission' })
@staticProps({
  entity: 'mission',
  permissions,
  listName: 'missionsList',
  tableComponent: MissionsTable,
  tableMeta: extractTableMeta(getTableMeta()),
  operations: ['LIST', 'CREATE', 'READ', 'UPDATE', 'DELETE', 'CHECK'],
})
@autobind
export default class MissionsJournal extends CheckableElementsList {

  constructor(props, context) {
    super(props);

    this.removeElementAction = context.flux.getActions('missions').removeMission;
    this.removeElementCallback = this.removeElementCallback.bind(this);

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

  async componentDidMount() {
    super.componentDidMount();
    const { flux } = this.context;
    const linear = true;
    const outerPayload = {
      start_date: new Date(),
      end_date: new Date(),
    };

    flux.getActions('companyStructure').getCompanyStructure(linear);
    flux.getActions('missions').getMissions(null, MAX_ITEMS_PER_PAGE, 0, this.state.sortBy, this.state.filter, is_archive);
    flux.getActions('objects').getCars();
    flux.getActions('technicalOperation').getTechnicalOperations();
    flux.getActions('missions').getMissionSources();
    flux.getActions('companyStructure').getCompanyStructure(linear);
    flux.getActions('missions').getCleaningMunicipalFacilityAllList(outerPayload);
    flux.getActions('technicalOperation').getTechnicalOperationsObjects();
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
    this.setState({
      selectedElement: null,
      checkedElements: {},
    });

    const missions = await this.context.flux.getActions('missions').getMissions(null, MAX_ITEMS_PER_PAGE, state.page * MAX_ITEMS_PER_PAGE, state.sortBy, state.filter, is_archive);

    const { total_count } = missions.result.meta;
    const resultCount = missions.result.rows.length;

    if (resultCount === 0 && total_count > 0) {
      this.setState({ page: (Math.ceil(total_count / MAX_ITEMS_PER_PAGE) - 1) });
    }
  }

  removeElementCallback() {
    global.NOTIFICATION_SYSTEM.notify('Данные успешно удалены', 'success');
    this.refreshList();
  }

  checkDisabled() {
    const validateMissionsArr = Object.values(this.state.checkedElements);
    const { selectedElement } = this.state;
    if (selectedElement) {
      validateMissionsArr.push(selectedElement);
    }

    console.log(validateMissionsArr)

    return !validateMissionsArr.length || !validateMissionsArr.every(({ status, can_be_closed }) => (
      (
        status === 'assigned'
        || status === 'in_progress'
        || status === 'expired'
      )
      && can_be_closed
    ));
  }

  checkDisabledDelete() {
    return (
      super.checkDisabledDelete() ||
      (this.state.selectedElement && this.state.selectedElement.status !== 'not_assigned') ||
      (Object.values(this.state.checkedElements).some(el => el.status !== 'not_assigned'))
    );
  }

  checkDisabledArchive() {
    const validateMissionsArr = Object.values(this.state.checkedElements);
    const { selectedElement } = this.state;
    if (selectedElement) {
      validateMissionsArr.push(selectedElement);
    }

    return !validateMissionsArr.length || validateMissionsArr.some(({ status }) => (
      status === 'assigned'
      || status === 'in_progress'
      || status === 'expired'
    ));
  }

  rejectMission = () => this.setState({ showMissionRejectForm: true });

  completeCheckedElements() {
    const { selectedElement } = this.state;
    const missionsObj = this.state.checkedElements || {};
    if (selectedElement) {
      missionsObj[selectedElement.id] = selectedElement;
    }
    Promise.all(
      Object.values(missionsObj).map(mission =>
        this.context.flux.getActions('missions')
          .updateMission({ ...cloneDeep(mission), status: 'complete' }),
      ),
    ).then(() => {
      global.NOTIFICATION_SYSTEM.notify('Данные успешно сохранены', 'success');
      this.refreshList(this.state);
      this.setState({ checkedElements: {} });
    })
    .catch(({ errorIsShow }) => {
      !errorIsShow && global.NOTIFICATION_SYSTEM.notify(getWarningNotification('Произошла непредвиденная ошибка!'));
      this.refreshList(this.state);
      this.setState({ checkedElements: {} });
    })
  }

  rejectCheckedElements() {
    this.rejectMission();
  }


  removeCheckedElements = () => {
    this.defActionFunc({
      bodyConfirmDialog: 'Вы уверены, что хотите удалить выбранные элементы?',
      callbackForCheckedElement: this.removeElementAction,
      callBackForOneElement: this.removeElement,
      notifyText: 'Данные успешно удалены',
    });
  }

  removeElement = () => {
    return confirmDialog({
      title: 'Внимание',
      body: 'Вы уверены, что хотите удалить выбранные элементы?',
    })
    .then(() => {
      const {
        selectedElement = {},
      } = this.state;
      const id = selectedElement[this.selectField];

      return this.removeElementAction(id, false).then(() => {
        this.setState({
          checkedElements: {},
          selectedElement: null,
        });
        global.NOTIFICATION_SYSTEM.notify('Данные успешно удалены');
      })
      .catch(({ errorIsShow }) => !errorIsShow && global.NOTIFICATION_SYSTEM.notify('Произошла ошибка при удалении', 'error'));
    })
    .catch(() => {});
  }

  defActionFunc = ({
    bodyConfirmDialog,
    callbackForCheckedElement,
    callBackForOneElement,
    notifyText,
  }) => {
    const {
      checkedElements = {},
    } = this.state;

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
          callbackForCheckedElement(el[this.selectField], false).then(() => {
            elList[i] = true;
            if (!elList.some(elD => !elD)) {
              this.refreshList();
              global.NOTIFICATION_SYSTEM.notify(notifyText);
            }
          })
          .catch(({ errorIsShow }) => {
            elList[i] = true;
            if (!elList.some(elD => !elD)) {
              this.refreshList();
              !errorIsShow && global.NOTIFICATION_SYSTEM.notify(notifyText);
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
  }

  onReject(refresh) {
    const newPropsState = {
      showMissionRejectForm: false,
    };
    if (refresh) {
      this.refreshList(this.state);
      newPropsState.checkedElements = {};
      newPropsState.selectedElement = null;
    }
    this.setState({ ...newPropsState });
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
      body: `Вы уверены, что хотите перенести в архив ${moreOne ? 'выбранные задания' : 'выбранное задание'}?`,
    })
    .then(() =>
        Promise.all(
          Object.entries(checkedElements).map(([id]) =>
            this.context.flux.getActions('missions').changeArchiveMissionStatus(id, true),
          )
        ).then(() => {
          this.refreshList();
          global.NOTIFICATION_SYSTEM.notify(`${moreOne ? 'Выбранные задания перенесены в' : 'Выбранное задание перенесено в'} архив`);
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

  async mapView(id) {
    const { result, warnings = false } = await this.context.flux.getActions('missions').getMissionData(id);
    if (warnings && warnings.length > 0) {
      global.NOTIFICATION_SYSTEM.notify(warnings[0], 'error');
    } else {
      this.setState({ mission: result, showMissionInfoForm: true });
    }
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
        {
          this.state.showMissionRejectForm
          && (
            <MissionRejectForm
              show={this.state.showMissionRejectForm}
              onReject={this.onReject}
              mission={this.state.selectedElement}
              missions={this.state.checkedElements}
            />
          )
        }
        <MissionInfoFormWrap
          onFormHide={() => this.setState({ showMissionInfoForm: false })}
          showForm={this.state.showMissionInfoForm}
          element={this.state.mission}
        />
        <PrintForm
          onExport={this.processExport}
          show={this.state.showPrintForm}
          onHide={() => this.setState({ showPrintForm: false })}
          title={'Печать журнала заданий'}
        />
      </div>,
    ];
  }
  goToOrders = () => {
    this.props.history.push('/orders');
  }

  getbuttonAddCZ() {
    return (
      <div key={'00.1'} className="container-button-create-cz">
        <ButtonGoFaxogramm bsSize="small" bsStyle="success" onClick={this.goToOrders} disabled={false}>
          <Glyphicon glyph="plus" /> Исполнение централизованного задания
        </ButtonGoFaxogramm>
      </div>
    );
  }

  getButtons() {
    const superButtons = super.getButtons({
      BCbuttonName: 'Создать децентрализованное задание',
    });

    const buttons = [
      superButtons[0],
      this.getbuttonAddCZ(),
      ...superButtons.slice(1),
    ];

    buttons.push(
      <ButtonUpdateMission key="button-complete-mission" bsSize="small" onClick={this.completeCheckedElements} disabled={this.checkDisabled()}><Glyphicon glyph="ok" /> Отметка о выполнении</ButtonUpdateMission>,
      <ButtonUpdateMission key="butto-reject-mission" bsSize="small" onClick={this.rejectCheckedElements} disabled={this.checkDisabled()}><Glyphicon glyph="ban-circle" /> Отметка о невыполнении</ButtonUpdateMission>,
      <ButtonUpdateMission key="butto-archive-mission" bsSize="small" onClick={this.archiveCheckedElements} disabled={this.checkDisabledArchive()}>В архив</ButtonUpdateMission>,
    );

    return buttons;
  }

  changeSort(field, direction) {
    this.setState({ sortBy: getServerSortingField(field, direction, get(this.tableMeta, [field, 'sort', 'serverFieldName'])) });
  }

  changeFilter(filter) {
    this.setState({ filter });
  }

  getAdditionalProps() {
    return {
      mapView: this.mapView,
      structures: this.props.companyStructureLinearList,
      changeSort: this.changeSort,
      changeFilter: this.changeFilter,
      filterValues: this.state.filter,
      rowNumberOffset: this.state.page * MAX_ITEMS_PER_PAGE,
      useServerFilter: true,
      useServerSort: true,
    };
  }

  export() {
    this.setState({ showPrintForm: true });
  }

  additionalRender() {
    return (
      <Paginator
        currentPage={this.state.page}
        maxPage={Math.ceil(this.props.missionsTotalCount / MAX_ITEMS_PER_PAGE)}
        setPage={page => this.setState({ page })}
        firstLastButtons
      />
    );
  }
}
