import * as React from 'react';
import { connect } from 'react-redux';
import {
  setEmptyMissionData,
  setEmptyDutyMissionData,
  setEmptyDutyMissionTemplateData,
} from 'redux-main/reducers/modules/order/action-order';
  
import Div from 'components/ui/Div';

import MissionFormWrap from 'components/missions/mission/MissionFormWrap';
import DutyMissionFormWrap from 'components/missions/duty_mission/DutyMissionFormWrap';
import OrderMissionTemplate from 'components/directories/order/forms/OrderMissionTemplate/OrderMissionTemplateList';

// todo
// Описать интерфейсы форм
const MissionFormWrapTSX: any = MissionFormWrap;
const DutyMissionFormWrapTSX: any = DutyMissionFormWrap;

const OrderMissionController: React.SFC<any> = props => {
  const {
    missionData,
    dutyMissionData,
    missionTemplateData,
  } = props;

  return (
    <div>
      <MissionFormWrapTSX
        fromOrder={true}
        showForm={missionData.showForm}
        onFormHide={props.onHideCM}
        element={missionData.mElement}
        order={missionData.order}
      />
      <DutyMissionFormWrapTSX
        fromOrder={true}
        showForm={dutyMissionData.showForm}
        onFormHide={props.onHideCDM}
        element={dutyMissionData.dmElement}
        order={dutyMissionData.order}
      />
      <Div hidden={!missionTemplateData.showForm} >
        <OrderMissionTemplate
          showForm={missionTemplateData.showForm}
          onFormHide={props.onHideCMTemplate}
          technical_operations={missionTemplateData.technical_operations}
          orderDates={missionTemplateData.orderDates}
          typeClick={missionTemplateData.typeClick}
          mission_source_id={missionTemplateData.mission_source_id}
        />
      </Div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  missionData: state.order.missionData,
  missionTemplateData: state.order.missionTemplateData,
  dutyMissionData: state.order.dutyMissionData,
});
const mapDispatchToProps = dispatch => ({
  onHideCM: () => dispatch(setEmptyMissionData()),
  onHideCDM: () => dispatch(setEmptyDutyMissionData()),
  onHideCMTemplate: () => dispatch(setEmptyDutyMissionTemplateData()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrderMissionController);
