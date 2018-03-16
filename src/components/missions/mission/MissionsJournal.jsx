import React from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import {
  ButtonToolbar,
  Button as BootstrapButton,
  Glyphicon,
} from 'react-bootstrap';

import { MAX_ITEMS_PER_PAGE } from 'constants/ui';
import MissionInfoFormWrap from 'components/dashboard/MissionInfoFormWrap.jsx';
import CheckableElementsList from 'components/CheckableElementsList.jsx';
import { connectToStores, staticProps, exportable } from 'utils/decorators';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';
import PrintForm from 'components/missions/common/PrintForm.tsx';

import Paginator from 'components/ui/Paginator.jsx';
import MissionsTable from './MissionsTable.jsx';
import MissionFormWrap from './MissionFormWrap.jsx';
import MissionRejectForm from './MissionRejectForm.jsx';

const Button = enhanceWithPermissions(BootstrapButton);

@connectToStores(['missions', 'objects', 'employees', 'routes'])
@exportable({ entity: 'mission' })
@staticProps({
  entity: 'mission',
  listName: 'missionsList',
  tableComponent: MissionsTable,
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
    flux.getActions('missions').getMissions(null, MAX_ITEMS_PER_PAGE, 0, this.state.sortBy, this.state.filter);
    flux.getActions('objects').getCars();
    flux.getActions('technicalOperation').getTechnicalOperations();
    flux.getActions('missions').getMissionSources();
    flux.getActions('missions');
    const outerPayload = {
      start_date: new Date(),
      end_date: new Date(),
    };
    this.context.flux.getActions('missions').getCleaningMunicipalFacilityAllList(outerPayload);
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

  async completeMission() {
    const mission = _.cloneDeep(this.state.selectedElement);
    mission.status = 'complete';
    await this.context.flux.getActions('missions').updateMission(mission, false);
    this.setState({
      checkedElements: {},
      selectedElement: null,
    });
    global.NOTIFICATION_SYSTEM.notify('Данные успешно обновлены', 'success');
    this.refreshList(this.state);
  }

  rejectMission = () => {
    this.setState({
      showMissionRejectForm: true,
    });
  }

  completeCheckedElements() {
    const checkElList = Object.values(this.state.checkedElements);
    const countCheckEl = checkElList.length;

    if (countCheckEl !== 0) {
      const elList = Array(countCheckEl).fill(false);

      checkElList.forEach((mission, i) => {
        const updatedMission = _.cloneDeep(mission);
        updatedMission.status = 'complete';

        this.context.flux.getActions('missions').updateMission(updatedMission, false).then(() => {
          elList[i] = true;
          if (!elList.some(elD => !elD)) {
            this.refreshList();
            global.NOTIFICATION_SYSTEM.notify('Данные успешно обновлены');
          }
        })
        .catch(() => {
          elList[i] = true;
          if (!elList.some(elD => !elD)) {
            this.refreshList();
            global.NOTIFICATION_SYSTEM.notify('Произошла ошибка при обновлении данных');
          }
        });
      });
      this.setState({
        checkedElements: {},
        selectedElement: null,
      });
    } else {
      this.completeMission();
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
    if (warnings) {
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

  getAdditionalProps() {
    const { structures } = this.context.flux.getStore('session').getCurrentUser();
    const changeSort = (field, direction) => this.setState({ sortBy: `${field}:${direction ? 'asc' : 'desc'}` });
    const changeFilter = filter => this.setState({ filter });
    return {
      mapView: this.mapView,
      structures,
      changeSort,
      changeFilter,
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
        maxPage={Math.ceil(this.props.totalCount / MAX_ITEMS_PER_PAGE)}
        setPage={page => this.setState({ page })}
        firstLastButtons
      />
    );
  }
}
