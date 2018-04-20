import * as React from 'react';
import { DropdownButton, MenuItem, Button as BootstrapButton, Glyphicon } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  setMInMissionTemplateData,
  setDMInMissionTemplateData,
} from 'redux/modules/order/action-order';

import { TypeDownload, missionTemplateListPermission } from 'components/directories/order/constant-order';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';
import { getBlobOrder } from 'components/directories/order/utils-order';

const marginLeft = { marginLeft: 10 };

const Button = enhanceWithPermissions(BootstrapButton);
const title: any = <Glyphicon glyph="download-alt" />;

const OrderTableChilrend: React.SFC<any> = props => (
  <div>
    <Button
      permissions={missionTemplateListPermission.missionTemplate}
      disabled={props.disabledTemplateMission}
      onClick={props.handleClickOnCMTemplate}
    >
      {'Создать задание по шаблону'}
    </Button>
    <Button
      permissions={missionTemplateListPermission.dutyMissionTemplate}
      disabled={props.disabledTemplateDutyMission}
      onClick={props.handleClickOnCDMTemplate}
    >
      {'Создать наряд-задание по шаблону'}
    </Button>
    <span style={marginLeft} >
      <DropdownButton onSelect={props.selectDownload} pullRight title={title} id="bg-nested-dropdown">
        <MenuItem eventKey={TypeDownload.old} disabled={!props.disabledButtonsMenu}>Скан-копия факсограммы</MenuItem>
        <MenuItem eventKey={TypeDownload.new} disabled={!props.disabledButtonsMenu}>Расшифровка централизованного задания</MenuItem>
      </DropdownButton>
    </span>
  </div>
);

const mapStateToProps = (state) => ({
  selectedElementOrder: state.order.selectedElementOrder,

  disabledTemplateMission: state.order.disabledOrderButton.templateMission,
  disabledTemplateDutyMission: state.order.disabledOrderButton.templateDutyMission,
});
const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      setMInMissionTemplateData,
      setDMInMissionTemplateData,
    },
    dispatch,
  ),
})

const mergeProps = (stateProps, dispatchProps, { order_mission_source_id: mission_source_id }) => ({
  disabledButtonsMenu: !stateProps.disabledButtonsMenu,
  disabledTemplateMission: stateProps.disabledTemplateMission,
  disabledTemplateDutyMission: stateProps.disabledTemplateDutyMission,

  handleClickOnCMTemplate: () => dispatchProps.setMInMissionTemplateData({ mission_source_id }),
  handleClickOnCDMTemplate: () => dispatchProps.setMInMissionTemplateData({ mission_source_id }),
  selectDownload: eventName => getBlobOrder(stateProps.selectedElementOrder, eventName)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(OrderTableChilrend);
