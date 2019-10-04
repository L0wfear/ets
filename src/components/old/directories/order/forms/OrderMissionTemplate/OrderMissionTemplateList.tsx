import * as React from 'react';
import { connect } from 'react-redux';
import {
  isEmpty,
} from 'lodash';

import EtsBootstrap from 'components/new/ui/@bootstrap';

import { FluxContext } from 'utils/decorators';

import Div from 'components/old/ui/Div';
import ReactSelect from 'components/old/ui/input/ReactSelect/ReactSelect';

import MissionTemplateTable from 'components/old/directories/order/forms/OrderMissionTemplate/MissionTemplateTable';
import DutyMissionTemplateTable from 'components/old/directories/order/forms/OrderMissionTemplate/DutyMissionTemplateTable';

import { diffDates } from 'components/@next/@utils/dates/dates';

import { checkStructureByTypeClick } from 'components/old/directories/order/forms/utils/customValidate';
import {
  getMissionListByFilter,
} from 'components/old/directories/order/forms/utils/filtersData';

import {
  ASSIGN_OPTIONS,
  typeTemplate,
} from 'components/old/directories/order/forms/utils/constant';

import {
  IStateOrderMissionTemplate,
} from 'components/old/directories/order/forms/OrderMissionTemplate/OrderMissionTemplateList.h';
import { createMissionByOrder, getValidDutyMissionFromOrderTemplate } from 'components/old/directories/order/forms/utils/createMissionsByOrder';
import { getWarningNotification } from 'utils/notifications';
import { ReduxState } from 'redux-main/@types/state';
import { getSessionState, getSomeUniqState, getAutobaseState } from 'redux-main/reducers/selectors';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import LoadingOverlayLegacy from 'components/old/directories/order/forms/OrderMissionTemplate/LoadingOverlayLegacy';
import { DivNone } from 'global-styled/global-styled';
import ColumnAssignmentMissionTemplate from './ColumnAssignmentMissionTemplate';
import { validateMissionsByCheckedElements } from 'components/new/pages/missions/utils';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { Order } from 'redux-main/reducers/modules/order/@types';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { carGetAndSetInStore } from 'redux-main/reducers/modules/autobase/car/actions';

type StateProps = {
  carList: Car[];
  userData: InitialStateSession['userData'];
  order_mission_source_id: IStateSomeUniq['missionSource']['order_mission_source_id'];
};
type DispatchProps = {
  dispatch: EtsDispatch;
};
type OwnProps = {
  typeClick: typeof typeTemplate[keyof typeof typeTemplate];
  onFormHide: () => any;
  technical_operations: Order['technical_operations'];
  orderDates: {
    order_date: Order['order_date'];
    order_date_to: Order['order_date_to'];
    faxogramm_id: Order['id'];
    status: Order['status'];
  };
};
type Props = (
  StateProps
  & DispatchProps
  & OwnProps
);

export const makePayloadFromState = (formState, type_id) => ({
  datetime: formState.date_start,
  technical_operation_id: formState.technical_operation_id,
  municipal_facility_id: formState.municipal_facility_id,
  route_type: formState.route_type,
  func_type_id: type_id || formState.type_id,
  needs_brigade: false,
});

export const getNormByMissionAndCar = async (getCleaningOneNorm, missionArr: any[]) => {
  const ans = await Promise.all(
    missionArr.map(async (missionData: any) => {
      const carIdNormIdArray = await Promise.all(
        missionData.car_ids.map(async (car_id, index) => {
          const normData = await getCleaningOneNorm({
            ...makePayloadFromState(missionData, missionData.car_type_ids[index]),
          });

          return {
            car_id,
            norm_id: normData.norm_id,
          };
        }),
      );

      return {
        id: missionData.id,
        normByCarId: carIdNormIdArray.reduce((newObj: any, { car_id, norm_id }: any) => {
          newObj[car_id] = norm_id;

          return newObj;
        }, {}),
      };
    }),
  );

  return ans.reduce((newObj: any, { id, normByCarId }) => {
    newObj[id] = normByCarId;

    return newObj;
  }, {});
};

const loadingPage = 'OrderMissionTemplateList';
const loadingPath = 'OrderMissionTemplateListPath';
const meta = {
  page: loadingPage,
  path: loadingPath,
};

@FluxContext
class OrderMissionTemplate extends React.Component<Props, IStateOrderMissionTemplate> {
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
    this.props.dispatch(carGetAndSetInStore({}, meta));

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
      case typeTemplate.missionTemplate: return this.props.dispatch(
        missionsActions.actionGetMissionTemplate(
          payload,
          meta,
        ),
      );
      case typeTemplate.missionDutyTemplate: return this.props.dispatch(
        missionsActions.actionGetDutyMissionTemplate(
          payload,
          meta,
        ),
      );
      default: Promise.reject({ error: 'no typeClick' });
    }
  }

  handleChangeTypePrint = (assign_to_waybill) => {
    this.setState({ assign_to_waybill });
  }

  getNormId = (missionArr: any[]) => {
    return getNormByMissionAndCar(
      this.context.flux.getActions('missions').getCleaningOneNorm,
      missionArr,
    );
  }

  handleSubmit = async () => {
    const {
      assign_to_waybill,
      checkedElements,
    } = this.state;
    const {
      order_mission_source_id,
      orderDates: { faxogramm_id },
      technical_operations: [],
      typeClick,
    } = this.props;

    let missionArr: any = Object.values(checkedElements);
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

    missionArr = missionArr.map(({ front_invalid_interval, ...other }) => ({
      consumable_materials: null,
      ...other,
    }));

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
        const norm_id = await this.getNormId(missionArr);
        goodResponse = await createMissionByOrder(this.context.flux, missionArr, order_mission_source_id, assign_to_waybill, faxogramm_id, norm_id);
      }
      if (typeClick === typeTemplate.missionDutyTemplate) {
        goodResponse = await Promise.all(
          missionArr.map((dutyMission: any) => (
            this.props.dispatch(
              missionsActions.actionCreateDutyMission(
                getValidDutyMissionFromOrderTemplate(dutyMission, order_mission_source_id, faxogramm_id),
                meta,
              ),
            )
          )),
        ).then((responseArr) => responseArr.every((ans) => ans));
      }

      if (goodResponse) {
        global.NOTIFICATION_SYSTEM.notify('Данные успешно сохранены');

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
      order_mission_source_id,
      orderDates: { faxogramm_id },
      technical_operations: [],
      typeClick,
    } = this.props;

    const missionArr = Object.values(checkedElements).map(({ front_invalid_interval, ...other }) => other);

    if (!checkStructureByTypeClick(this.props.typeClick, this.props as any, missionArr)) {
      this.setState({ canSubmit: false });
      let goodResponse = true;

      if (typeClick === typeTemplate.missionTemplate) {
        const norm_id = await this.getNormId(missionArr);
        goodResponse = await createMissionByOrder(this.context.flux, missionArr, order_mission_source_id, assign_to_waybill_for_column, faxogramm_id, norm_id);
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
          carsList={this.props.carList}
          handleSubmit={this.handleSubmitFromAssignmentModal}
        />
      );
    }

    const {
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
      <EtsBootstrap.ModalContainer show id="modal-order-mission-template" onHide={this.onFormHide} bsSize="large">
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{title}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader meta={meta} typePreloader="mainpage">
          <LoadingOverlayLegacy />
          {
            typeClick === typeTemplate.missionTemplate
              ? (
                <MissionTemplateTable
                  data={missionsList}
                  selected={selectedElement}
                  checked={checkedElements}
                  onRowSelected={this.onRowSelected}
                  onAllRowsChecked={this.onAllChecked}
                  onRowChecked={this.onRowChecked}

                  order_id={this.props.orderDates.faxogramm_id}
                  {...meta}

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
                  {...meta}

                  structures={structures}
                />
              )
              : (
                <DivNone />
              )
          }
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
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
            <EtsBootstrap.Button disabled={this.checkDisabledSubmit()} onClick={this.handleSubmit}>{'Сформировать'}</EtsBootstrap.Button>
          </Div>
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  }
}

export default connect<StateProps, DispatchProps, OwnProps, ReduxState>(
  (state) => ({
    userData: getSessionState(state).userData,
    order_mission_source_id: getSomeUniqState(state).missionSource.order_mission_source_id,
    carList: getAutobaseState(state).carList,
  }),
)(OrderMissionTemplate);
