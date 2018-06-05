import React from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import {
  ButtonToolbar,
  Button as BootstrapButton,
  Glyphicon,
} from 'react-bootstrap';
import { getWarningNotification } from 'utils/notifications';

import { MAX_ITEMS_PER_PAGE } from 'constants/ui';
import MissionInfoFormWrap from 'components/dashboard/MissionInfoForm/MissionInfoFormWrap.jsx';

import CheckableElementsList from 'components/CheckableElementsList.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import { extractTableMeta, getServerSortingField } from 'components/ui/table/utils';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';
import PrintForm from 'components/missions/common/PrintForm.tsx';

import Paginator from 'components/ui/Paginator.jsx';
import MissionsTable, { getTableMeta } from './MissionsTable.jsx';
import MissionFormWrap from './MissionFormWrap.jsx';
import MissionRejectForm from './MissionRejectForm.jsx';

const Button = enhanceWithPermissions(BootstrapButton);

@connectToStores(['missions', 'objects', 'employees', 'routes'])
@exportable({ entity: 'mission' })
@staticProps({
  entity: 'mission',
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

    this.removeDisabled = () => {
      const keysChEl = Object.keys(this.state.checkedElements);

      if (keysChEl.length !== 0) {
        return !keysChEl.every(el => this.state.checkedElements[el].status === 'assigned');
      }

      if (this.state.selectedElement === null) {
        return true;
      }

      return this.state.selectedElement.status !== 'assigned';
    };

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
    flux.getActions('missions').getMissions(null, MAX_ITEMS_PER_PAGE, 0, this.state.sortBy, this.state.filter);
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
    const missions = await this.context.flux.getActions('missions').getMissions(null, MAX_ITEMS_PER_PAGE, state.page * MAX_ITEMS_PER_PAGE, state.sortBy, state.filter);

    const { total_count } = missions.result.meta;
    const resultCount = missions.result.rows.length;

    if (resultCount === 0 && total_count > 0) {
      const offset = (Math.ceil(total_count / MAX_ITEMS_PER_PAGE) - 1) * MAX_ITEMS_PER_PAGE;
      this.context.flux.getActions('missions').getMissions(null, MAX_ITEMS_PER_PAGE, offset, state.sortBy, state.filter);
    }
  }

  removeElementCallback() {
    global.NOTIFICATION_SYSTEM.notify('Данные успешно удалены', 'success');
    this.refreshList();
  }

  checkDisabled() {
    const keysChEl = Object.keys(this.state.checkedElements);

    if (keysChEl.length !== 0) {
      return !keysChEl.every(el => this.state.checkedElements[el].status === 'assigned');
    }

    if (this.state.selectedElement === null) {
      return true;
    }

    return this.state.selectedElement.status !== 'assigned';
  }

  checkDisabledDelete() {
    return (
      super.checkDisabledDelete() ||
      (this.state.selectedElement && this.state.selectedElement.status !== 'not_assigned') ||
      (Object.values(this.state.checkedElements).some(el => el.status !== 'not_assigned'))
    );
  }

  rejectMission = () => this.setState({ showMissionRejectForm: true });

  completeCheckedElements() {
    const { selectedElement } = this.state;
    const missionsObj = this.state.checkedElements || {};
    if (selectedElement) {
      missionsObj[selectedElement.id] = selectedElement;
    }
    const missions = Object.values(missionsObj);

    if (missions.some(({ status }) => status !== 'assigned')) {
      global.NOTIFICATION_SYSTEM.notify(getWarningNotification('Отметить как "Выполненые" можно только назначенные задания!'));
    } else {
      Promise.all(
        Object.values(this.state.checkedElements).map(mission =>
          this.context.flux.getActions('missions')
            .updateMission({ ..._.cloneDeep(mission), status: 'complete' }, false),
        ),
      ).then(() => {
        global.NOTIFICATION_SYSTEM.notify('Данные успешно сохранены', 'success');
        this.refreshList(this.state);
        this.setState({ checkedElements: {} });
      })
      .catch(() => {
        global.NOTIFICATION_SYSTEM.notify(getWarningNotification('Произошла непредвиденная ошибка!'));
        this.refreshList(this.state);
        this.setState({ checkedElements: {} });
      });
    }
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
      .catch(() => global.NOTIFICATION_SYSTEM.notify('Произошла ошибка при удалении', 'error'));
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
          .catch(() => {
            elList[i] = true;
            if (!elList.some(elD => !elD)) {
              this.refreshList();
              global.NOTIFICATION_SYSTEM.notify(notifyText);
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
          this.state.showMissionRejectForm &&
          <MissionRejectForm
            show={this.state.showMissionRejectForm}
            onReject={this.onReject}
            mission={this.state.selectedElement}
            missions={this.state.checkedElements}
          />
        }
        <MissionInfoFormWrap
          onFormHide={() => this.setState({ showMissionInfoForm: false })}
          showForm={this.state.showMissionInfoForm}
          element={this.state.mission}
          flux={this.context.flux}
        />
        <PrintForm
          onExport={this.processExport.bind(this)}
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
      <div className="container-button-create-cz">
        <Button bsSize="small" bsStyle="success" onClick={this.goToOrders} permissions={['faxogramm.list']} disabled={false}>
          <Glyphicon glyph="plus" /> Исполнение централизованного задания
        </Button>
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

    // TODO отображение 2 кнопорей в зависимости от прав
    buttons.push(
      <ButtonToolbar key={buttons.length}>
        <Button bsSize="small" permissions={[`${this.entity}.update`]} onClick={this.completeCheckedElements} disabled={this.checkDisabled()}><Glyphicon glyph="ok" /> Отметка о выполнении</Button>
        <Button bsSize="small" permissions={[`${this.entity}.update`]} onClick={this.rejectCheckedElements} disabled={this.checkDisabled()}><Glyphicon glyph="ban-circle" /> Отметка о невыполнении</Button>
      </ButtonToolbar>
    );

    return buttons;
  }

  changeSort(field, direction) {
    this.setState({ sortBy: getServerSortingField(field, direction, _.get(this.tableMeta, [field, 'sort', 'serverFieldName'])) });
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
