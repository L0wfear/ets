import * as React from 'react';
import * as DropdownButton from 'react-bootstrap/lib/DropdownButton';
import * as MenuItem from 'react-bootstrap/lib/MenuItem';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  setMInMissionTemplateData,
  setDMInMissionTemplateData,
} from 'redux-main/reducers/modules/order/action-order';

import permissions_mission_template from 'components/new/pages/missions/mission_template/_config-data/permissions';

import { TypeDownload } from 'components/directories/order/constant-order';
import { getBlobOrder } from 'components/directories/order/utils-order';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import dutyMissionTemplatePermissions from 'components/new/pages/missions/duty_mission_template/_config-data/permissions';
import ButtonCheckPermission from 'components/ui/buttons/ButtonCheckPermission';

const marginLeft = { marginLeft: 10 };

const title: any = <EtsBootstrap.Glyphicon glyph="download-alt" />;

const OrderTableChilrend: React.FC<any> = (props) => (
  <>
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
      <DropdownButton
        disabled={props.disabledButtonsMenu}
        onSelect={props.selectDownload}
        pullRight
        title={title}
        id="bg-nested-dropdown">
        <MenuItem eventKey={TypeDownload.old}>Скан-копия факсограммы</MenuItem>
        <MenuItem eventKey={TypeDownload.new}>
          Расшифровка централизованного задания
        </MenuItem>
      </DropdownButton>
    </span>
  </>
);

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
