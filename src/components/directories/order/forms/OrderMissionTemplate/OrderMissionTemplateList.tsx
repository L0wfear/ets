import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';

import {
  isEmpty,
} from 'lodash';

import { FluxContext, connectToStores } from 'utils/decorators';

import Div from 'components/ui/Div';
import ReactSelect from 'components/ui/input/ReactSelect/ReactSelect';

import MissionTemplateTable from 'components/directories/order/forms/OrderMissionTemplate/MissionTemplateTable';
import DutyMissionTemplateTable from 'components/directories/order/forms/OrderMissionTemplate/DutyMissionTemplateTable';

import { diffDates } from 'utils/dates';

import { checkStructureByTypeClick } from 'components/directories/order/forms/utils/customValidate';
import {
  getMissionListByFilter,
} from 'components/directories/order/forms/utils/filtersData';

import {
  ASSIGN_OPTIONS,
  typeTemplate,
} from 'components/directories/order/forms/utils/constant';

import {
  IStateOrderMissionTemplate,
} from 'components/directories/order/forms/OrderMissionTemplate/OrderMissionTemplateList.h';
import { createMissionByOrder, createDutyMissionByOrder } from 'components/directories/order/forms/utils/createMissionsByOrder';
import { getWarningNotification } from 'utils/notifications';
import { getNormByMissionAndCar } from 'components/missions/mission_template/utils';
import ColumnAssignmentMissionTemplate from 'components/missions/mission_template/ColumnAssignmentMissionTemplate';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getSessionState } from 'redux-main/reducers/selectors';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import ModalBodyPreloader from 'components/ui/new/preloader/modal-body/ModalBodyPreloader';
import LoadingOverlayLegacy from 'components/directories/order/forms/OrderMissionTemplate/LoadingOverlayLegacy';
import { DivNone } from 'global-styled/global-styled';

const loadingPage = 'OrderMissionTemplateList';

@connectToStores(['missions', 'employees', 'objects'])
@FluxContext
class OrderMissionTemplate extends React.Component<any, IStateOrderMissionTemplate> {
  context!: ETSCore.LegacyContext;

  state: any = {
    assign_to_waybill: 'assign_to_new_draft',
    assign_to_waybill_for_column: {},
    missionsList: [],
    missionsIndex: {},
    selectedElement: undefined,
    checkedElements: {},
    structures: [],
    timeInterval: null,
    canSubmit: true,
    showColumnAssignment: false,
  };

  componentDidMount() {
    const { structures } = this.props.userData;
    if (this.props.typeClick === typeTemplate.missionTemplate) {
      const payload = {
        order_id: this.props.orderDates.faxogramm_id || null,
      };
      this.context.flux.getActions('missions').getMissionTemplatesCars(payload);
    }

    this.getMissionsList().then(({ data }) => {
      const missionsList = getMissionListByFilter(data);
      const date = (new Date()).getTime();

      const timeInterval = setTimeout(this.checkMissionsList, new Date(date - (date % 60000) + 60 * 1000).getTime() - date + 1000);

      this.setState({
        missionsList,
        missionsIndex: missionsList.reduce((newObj, mission) => ({ ...newObj, [mission.frontId]: mission }), {}),
        structures,
        timeInterval,
      });
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.timeInterval);
  }

  checkMissionsList = () => {
    const { missionsList: old_missionsList } = this.state;
    const timeInterval = setInterval(this.checkMissionsList, 60 * 1000);
    const missionsList = old_missionsList.filter(({ date_to }) => diffDates(new Date(), date_to) < 0);

    console.log('check on date end'); // tslint:disable-line:no-console

    this.setState({
      missionsList,
      missionsIndex: missionsList.reduce((newObj, mission) => ({ ...newObj, [mission.frontId]: mission }), {}),
      timeInterval,
    });
  }

  getMissionsList() {
    const { typeClick } = this.props;

    const payload = {
      order_id: this.props.orderDates.faxogramm_id,
    };

    switch (typeClick) {
      case typeTemplate.missionTemplate: return this.props.actionGetMissionTemplate(
        payload,
        { page: loadingPage },
      );
      case typeTemplate.missionDutyTemplate: return this.props.actionGetDutyMissionTemplate(
        payload,
        { page: loadingPage },
      );
      default: Promise.reject({ error: 'no typeClick' });
    }
  }

  handleChangeTypePrint = (assign_to_waybill) => {
    this.setState({ assign_to_waybill });
  }

  handleSubmit = async () => {
    const {
      assign_to_waybill,
      checkedElements,
    } = this.state;
    const {
      mission_source_id,
      orderDates: { faxogramm_id },
      technical_operations: [],
      typeClick,
    } = this.props;

    const missionArr = Object.values(checkedElements);
    const hasMissionForColumn = missionArr.some((mission: any) => mission.for_column);

    if (hasMissionForColumn && missionArr.length > 1) {
      global.NOTIFICATION_SYSTEM.notify(
        getWarningNotification(
          'Для создания задания на колонну необходимо выбрать только 1 шаблон!',
        ),
      );
      return;
    }

    if (hasMissionForColumn) {
      this.setState({
        showColumnAssignment: true,
        assign_to_waybill_for_column: missionArr.reduce((newObj, { id, car_ids }) => {
          newObj[id] = car_ids.reduce((newObjByCarId, car_id) => {
            newObjByCarId[car_id] = 'assign_to_new_draft';
            return newObjByCarId;
          }, {});

          return newObj;
        }, {}),
      });
      return 'колонна';
    }

    if (!checkStructureByTypeClick(typeClick, this.props as any, missionArr)) {
      this.setState({ canSubmit: false });
      let goodResponse = true;

      if (typeClick === typeTemplate.missionTemplate) {
        const norm_id = await getNormByMissionAndCar(
          this.context.flux.getActions('missions').getCleaningOneNorm,
          this.props.carsIndex,
          missionArr,
        );
        goodResponse = await createMissionByOrder(this.context.flux, missionArr, mission_source_id, assign_to_waybill, faxogramm_id, norm_id);
      }
      if (typeClick === typeTemplate.missionDutyTemplate) {
        goodResponse = await createDutyMissionByOrder(this.context.flux, missionArr, mission_source_id, faxogramm_id);
      }

      if (goodResponse) {
        this.setState({
          selectedElement: undefined,
          checkedElements: {},
          canSubmit: true,
        });
      } else {
        this.setState({
          canSubmit: true,
        });
      }
    }
  }

  onRowSelected = ({ props: { data: { frontId } } }) => {
    this.setState({ selectedElement: this.state.missionsIndex[frontId] });
  }

  onRowChecked = (frontId, state) => {
    const {
      checkedElements: { ...checkedElements },
    } = this.state;

    if (state) {
      checkedElements[frontId] = this.state.missionsIndex[frontId];
    } else {
      delete checkedElements[frontId];
    }

    this.setState({
      checkedElements,
    });
  }

  onAllChecked = (checkedElements: object, state) => this.setState({ checkedElements: state ? checkedElements : {} });

  checkDisabledSubmit = () => this.state.canSubmit && isEmpty(this.state.checkedElements);

  onFormHide = () => {
    this.componentWillUnmount();
    this.props.onFormHide();
  }

  handleChangeAssignToWaybillForColumn = (name, assign_to_waybill_for_column) => {
    this.setState({
      assign_to_waybill_for_column,
    });
  }

  hideColumnAssignmentMissionTemplate = () => {
    this.setState({
      showColumnAssignment: false,
      assign_to_waybill_for_column: {},
    });
  }

  handleSubmitFromAssignmentModal = async () => {
    const {
      assign_to_waybill_for_column,
      checkedElements,
    } = this.state;
    const {
      mission_source_id,
      orderDates: { faxogramm_id },
      technical_operations: [],
      typeClick,
    } = this.props;

    const missionArr = Object.values(checkedElements);

    if (!checkStructureByTypeClick(this.props.typeClick, this.props as any, missionArr)) {
      this.setState({ canSubmit: false });
      let goodResponse = true;

      if (typeClick === typeTemplate.missionTemplate) {
        const norm_id = await getNormByMissionAndCar(
          this.context.flux.getActions('missions').getCleaningOneNorm,
          this.props.carsIndex,
          missionArr,
        );
        goodResponse = await createMissionByOrder(this.context.flux, missionArr, mission_source_id, assign_to_waybill_for_column, faxogramm_id, norm_id);
      }
      if (typeClick === typeTemplate.missionDutyTemplate) {
        goodResponse = await createDutyMissionByOrder(this.context.flux, missionArr, mission_source_id, faxogramm_id);
      }

      if (goodResponse) {
        this.setState({
          selectedElement: undefined,
          checkedElements: {},
          canSubmit: true,
        });
        return Promise.resolve(goodResponse);
      } else {
        this.setState({
          canSubmit: true,
        });
        return Promise.resolve(goodResponse);
      }
    }
    return Promise.reject(false);
  }

  render() {
    const {
      assign_to_waybill,
      assign_to_waybill_for_column,
      missionsList,
      selectedElement,
      checkedElements,
      structures,
      showColumnAssignment,
    } = this.state;

    if (showColumnAssignment) {
      return (
        <ColumnAssignmentMissionTemplate
          ASSIGN_OPTIONS={ASSIGN_OPTIONS}
          missions={checkedElements}
          assign_to_waybill={assign_to_waybill_for_column}
          hideColumnAssignmentMissionTemplate={this.hideColumnAssignmentMissionTemplate}
          handleChange={this.handleChangeAssignToWaybillForColumn}
          carsList={this.props.carsList}
          handleSubmit={this.handleSubmitFromAssignmentModal}
        />
      );
    }

    const {
      showForm,
      typeClick,
    } = this.props;

    let title = '';

    if (typeClick === typeTemplate.missionTemplate) {
      title = 'Создание заданий';
    }
    if (typeClick === typeTemplate.missionDutyTemplate) {
      title = 'Создание наряд-заданий';
    }

    const hasMissionForColumn = Object.values(checkedElements).some((mission: any) => mission.for_column);

    return (
      <Modal id="modal-order-mission-template" show={showForm} onHide={this.onFormHide} bsSize="lg">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <ModalBodyPreloader page={loadingPage} typePreloader="mainpage">
          <LoadingOverlayLegacy />
          {
            typeClick === typeTemplate.missionTemplate
              ? (
                <MissionTemplateTable
                  data={missionsList}
                  govNumberFilter={this.props.govNumberFilter}
                  selected={selectedElement}
                  checked={checkedElements}
                  onRowSelected={this.onRowSelected}
                  onAllRowsChecked={this.onAllChecked}
                  onRowChecked={this.onRowChecked}

                  structures={structures}
                />
              )
              : (
                <DivNone />
              )
          }
          {
            typeClick === typeTemplate.missionDutyTemplate
              ? (
                <DutyMissionTemplateTable
                  data={missionsList}
                  selected={selectedElement}
                  checked={checkedElements}
                  onRowSelected={this.onRowSelected}
                  onAllRowsChecked={this.onAllChecked}
                  onRowChecked={this.onRowChecked}
                  employeesList={this.props.employeesList}
                  employeesIndex={this.props.employeesIndex}

                  structures={structures}
                />
              )
              : (
                <DivNone />
              )
          }
        </ModalBodyPreloader>
        <Modal.Footer>
          <Div className="inline-block">
            <Div hidden={typeClick === typeTemplate.missionDutyTemplate || hasMissionForColumn} className="inline-block assignToWaybillCheck" style={{ width: '300px', textAlign: 'left !important', height: '22px', marginRight: '20px' }}>
              <ReactSelect
                type="select"
                options={ASSIGN_OPTIONS}
                value={assign_to_waybill}
                clearable={false}
                onChange={this.handleChangeTypePrint}
              />
            </Div>
            <Button disabled={this.checkDisabledSubmit()} onClick={this.handleSubmit}>{'Сформировать'}</Button>
          </Div>
        </Modal.Footer>
      </Modal>
    );
  }
}

type DispatchPropsOrderMissionTemplate = {
  actionGetMissionTemplate: HandleThunkActionCreator<typeof missionsActions.actionGetMissionTemplate>;
  actionGetDutyMissionTemplate: HandleThunkActionCreator<typeof missionsActions.actionGetDutyMissionTemplate>;
};

export default compose<any, any>(
  connect<any, DispatchPropsOrderMissionTemplate, any, ReduxState>(
    (state) => ({
      userData: getSessionState(state).userData,
    }),
    (dispatch: any) => ({
      actionGetMissionTemplate: (...arg) => (
        dispatch(
          missionsActions.actionGetMissionTemplate(...arg),
        )
      ),
      actionGetDutyMissionTemplate: (...arg) => (
        dispatch(
          missionsActions.actionGetDutyMissionTemplate(...arg),
        )
      ),
    }),
  ),
)(OrderMissionTemplate);
