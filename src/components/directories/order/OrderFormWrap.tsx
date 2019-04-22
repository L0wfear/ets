import * as React from 'react';
import { connect } from 'react-redux';
import {
  setEmptyMissionData,
  setEmptyDutyMissionData,
  setEmptyDutyMissionTemplateData,
} from 'redux-main/reducers/modules/order/action-order';

import Div from 'components/ui/Div';

import OrderMissionTemplate from 'components/directories/order/forms/OrderMissionTemplate/OrderMissionTemplateList';
import DutyMissionFormLazy from 'components/new/pages/missions/duty_mission/form/main';
import MissionFormLazy from 'components/new/pages/missions/mission/form/main';

// todo
// Описать интерфейсы форм

const OrderMissionController: React.FunctionComponent<any> = (props) => {
  const { missionData, dutyMissionData, missionTemplateData } = props;

  return (
    <div>
      <MissionFormLazy
        showForm={missionData.showForm}
        onFormHide={props.onHideCM}
        element={missionData.mElement}
      />
      <DutyMissionFormLazy
        showForm={dutyMissionData.showForm}
        onFormHide={props.onHideCDM}
        element={dutyMissionData.dmElement}
      />
      <Div hidden={!missionTemplateData.showForm}>
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
};

const mapStateToProps = (state) => ({
  missionData: state.order.missionData,
  missionTemplateData: state.order.missionTemplateData,
  dutyMissionData: state.order.dutyMissionData,
});
const mapDispatchToProps = (dispatch) => ({
  onHideCM: () => dispatch(setEmptyMissionData()),
  onHideCDM: () => dispatch(setEmptyDutyMissionData()),
  onHideCMTemplate: () => dispatch(setEmptyDutyMissionTemplateData()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrderMissionController);
