import * as React from 'react';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as Button from 'react-bootstrap/lib/Button';

import { isEmpty } from 'lodash';

import { FluxContext, connectToStores } from 'utils/decorators';

import ModalBody from 'components/ui/Modal';
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
import { createMissionByOrder, createDutyMissionByOrder } from '../utils/createMissionsByOrder';
import { getWarningNotification } from 'utils/notifications';
import { getNormByMissionAndCar, validateMissionsByCheckedElements } from 'components/missions/mission_template/utils';
import ColumnAssignmentMissionTemplate from 'components/missions/mission_template/ColumnAssignmentMissionTemplate';

@connectToStores(['missions', 'session', 'employees', 'objects'])
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
    const { structures } = this.context.flux.getStore('session').getCurrentUser();
    if (this.props.typeClick === typeTemplate.missionTemplate) {
      const payload = {
        order_id: this.props.orderDates.faxogramm_id || null,
      };
      this.context.flux.getActions('missions').getMissionTemplatesCars(payload);
    }

    this.getMissionsList().then(({ result = [] }) => {
      const missionsList = getMissionListByFilter(result);
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

    /* tslint:disable:no-console */
    console.log('check on date end');
    /* tslint:enable */

    this.setState({
      missionsList,
      missionsIndex: missionsList.reduce((newObj, mission) => ({ ...newObj, [mission.frontId]: mission }), {}),
      timeInterval,
    });
  }

  getMissionsList() {
    const { flux } = this.context;
    const { typeClick } = this.props;

    const payload = {
      order_id: this.props.orderDates.faxogramm_id,
    };

    switch (typeClick) {
      case typeTemplate.missionTemplate: return flux.getActions('missions').getMissionTemplates(payload);
      case typeTemplate.missionDutyTemplate: return flux.getActions('missions').getDutyMissionTemplates(payload);
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

    let missionArr = Object.values(checkedElements);
    const hasMissionForColumn = missionArr.some((mission: any) => mission.for_column);

    if (hasMissionForColumn && missionArr.length > 1) {
      global.NOTIFICATION_SYSTEM.notify(
        getWarningNotification(
          'Для создания задания на колонну необходимо выбрать только 1 шаблон!',
        ),
      );
      return;
    }
    if (typeClick === typeTemplate.missionTemplate && missionArr.some(({ front_invalid_interval }) => front_invalid_interval)) {
      global.NOTIFICATION_SYSTEM.notify(
        getWarningNotification(
          'Выбраны шаблоны, которые создадут одинаковые задания, с пересекающимся периодом. Необходимо исключить пересекающиеся шаблоны (выделены красным)',
        ),
      );
      return;
    }

    missionArr = missionArr.map(({ front_invalid_interval, ...other }) => other);

    if (hasMissionForColumn) {
      this.setState({
        showColumnAssignment: true,
        assign_to_waybill_for_column: missionArr.reduce(
          (newObj, { id, car_ids }) => {
            newObj[id] = car_ids.reduce((newObjByCarId, car_id) => {
              newObjByCarId[car_id] = 'assign_to_new_draft';
              return newObjByCarId;
            }, {});

            return newObj;
          },
          {},
        ),
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
        this.setState(
          (oldState) => {
            return {
              selectedElement: undefined,
              checkedElements: {},
              canSubmit: true,
            };
          },
        );
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

    if (this.props.typeClick === typeTemplate.missionTemplate) {
      this.setState({
        checkedElements: validateMissionsByCheckedElements(checkedElements, false),
      });
      return;
    } else {
      this.setState({
        checkedElements,
      });
    }
  }

  onAllChecked = (checkedElements: object, state) => {
    if (this.props.typeClick === typeTemplate.missionTemplate) {
      this.setState({
        checkedElements: validateMissionsByCheckedElements(state ? checkedElements : {}, false),
      });
      return;
    }

    this.setState({ checkedElements: state ? checkedElements : {} });
  }

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

    const missionArr = Object.values(checkedElements).map(({ front_invalid_interval, ...other }) => other);

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

        <ModalBody>
          <Div hidden={typeClick !== typeTemplate.missionTemplate} >
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
          </Div>
          <Div hidden={typeClick !== typeTemplate.missionDutyTemplate} >
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
          </Div>
        </ModalBody>
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

export default OrderMissionTemplate;
