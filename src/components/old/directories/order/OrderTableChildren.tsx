import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  setMInMissionTemplateData,
  setDMInMissionTemplateData,
} from 'redux-main/reducers/modules/order/action-order';

import permissions_mission_template from 'components/new/pages/missions/mission_template/_config-data/permissions';

import { TypeDownload } from 'components/old/directories/order/constant-order';
import { getBlobOrder } from 'components/old/directories/order/utils-order';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import dutyMissionTemplatePermissions from 'components/new/pages/missions/duty_mission_template/_config-data/permissions';
import ButtonCheckPermission from 'components/old/ui/buttons/ButtonCheckPermission';

const marginLeft = { marginLeft: 10 };

const toggleElement = <EtsBootstrap.Glyphicon glyph="download-alt" />;

const OrderTableChilrend: React.FC<any> = (props) => {
  return (
    <React.Fragment>
      <ButtonCheckPermission
        permissions={permissions_mission_template.create}
        disabled={props.disabledTemplateMission}
        onClick={props.handleClickOnCMTemplate}>
        {'Создать задание по шаблону'}
      </ButtonCheckPermission>
      <ButtonCheckPermission
        permissions={dutyMissionTemplatePermissions.create}
        disabled={props.disabledTemplateDutyMission}
        onClick={props.handleClickOnCDMTemplate}>
        {'Создать наряд-задание по шаблону'}
      </ButtonCheckPermission>
      <span style={marginLeft}>
        <EtsBootstrap.Dropdown
          id="bg-nested-dropdown"
          disabled={props.disabledButtonsMenu}

          toggleElement={toggleElement}
          toggleElementSize="small"
        >
          <EtsBootstrap.DropdownMenu pullRight>
            <EtsBootstrap.MenuItem eventKey={TypeDownload.old} onSelect={props.selectDownload}>
              Скан-копия факсограммы
            </EtsBootstrap.MenuItem>
            <EtsBootstrap.MenuItem eventKey={TypeDownload.new} onSelect={props.selectDownload}>
              Расшифровка централизованного задания
            </EtsBootstrap.MenuItem>
          </EtsBootstrap.DropdownMenu>
        </EtsBootstrap.Dropdown>
      </span>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  selectedElementOrder: state.order.selectedElementOrder,
  order_mission_source_id: getSomeUniqState(state).missionSource.order_mission_source_id,

  disabledTemplateMission: state.order.disabledOrderButton.templateMission,
  disabledTemplateDutyMission:
    state.order.disabledOrderButton.templateDutyMission,
});
const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      setMInMissionTemplateData,
      setDMInMissionTemplateData,
    },
    dispatch,
  ),
});

const mergeProps = (
  stateProps,
  dispatchProps,
) => ({
  disabledButtonsMenu: !stateProps.selectedElementOrder,
  disabledTemplateMission: stateProps.disabledTemplateMission,
  disabledTemplateDutyMission: stateProps.disabledTemplateDutyMission,

  handleClickOnCMTemplate: () =>
    dispatchProps.setMInMissionTemplateData({ mission_source_id: stateProps.mission_source_id }),
  handleClickOnCDMTemplate: () =>
    dispatchProps.setDMInMissionTemplateData({ mission_source_id: stateProps.mission_source_id }),
  selectDownload: (eventName) =>
    getBlobOrder(stateProps.selectedElementOrder, eventName),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(OrderTableChilrend);
