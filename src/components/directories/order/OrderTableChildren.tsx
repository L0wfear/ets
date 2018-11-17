import * as React from 'react';
import * as DropdownButton from 'react-bootstrap/lib/DropdownButton';
import * as MenuItem from 'react-bootstrap/lib/MenuItem';
import * as BootstrapButton from 'react-bootstrap/lib/Button';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  setMInMissionTemplateData,
  setDMInMissionTemplateData,
} from 'redux-main/reducers/modules/order/action-order';

import permissions_mission_template from 'components/missions/mission_template/config-data/permissions';
import permissions_duty_mission_template from 'components/missions/duty_mission_template/config-data/permissions';

import { TypeDownload } from 'components/directories/order/constant-order';
import enhanceWithPermissions from 'components/util/RequirePermissionsNew';
import { getBlobOrder } from 'components/directories/order/utils-order';

const marginLeft = { marginLeft: 10 };

const Button = enhanceWithPermissions({})(BootstrapButton);
const title: any = <Glyphicon glyph="download-alt" />;

const OrderTableChilrend: React.SFC<any> = (props) => (
  <div>
    <Button
      permission={permissions_mission_template.create}
      disabled={props.disabledTemplateMission}
      onClick={props.handleClickOnCMTemplate}
    >
      {'Создать задание по шаблону'}
    </Button>
    <Button
      permission={permissions_duty_mission_template.create}
      disabled={props.disabledTemplateDutyMission}
      onClick={props.handleClickOnCDMTemplate}
    >
      {'Создать наряд-задание по шаблону'}
    </Button>
    <span style={marginLeft} >
      <DropdownButton disabled={props.disabledButtonsMenu} onSelect={props.selectDownload} pullRight title={title} id="bg-nested-dropdown">
        <MenuItem eventKey={TypeDownload.old}>Скан-копия факсограммы</MenuItem>
        <MenuItem eventKey={TypeDownload.new}>Расшифровка централизованного задания</MenuItem>
      </DropdownButton>
    </span>
  </div>
);

const mapStateToProps = (state) => ({
  selectedElementOrder: state.order.selectedElementOrder,

  disabledTemplateMission: state.order.disabledOrderButton.templateMission,
  disabledTemplateDutyMission: state.order.disabledOrderButton.templateDutyMission,
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

const mergeProps = (stateProps, dispatchProps, { order_mission_source_id: mission_source_id }) => ({
  disabledButtonsMenu: !stateProps.selectedElementOrder,
  disabledTemplateMission: stateProps.disabledTemplateMission,
  disabledTemplateDutyMission: stateProps.disabledTemplateDutyMission,

  handleClickOnCMTemplate: () => dispatchProps.setMInMissionTemplateData({ mission_source_id }),
  handleClickOnCDMTemplate: () => dispatchProps.setDMInMissionTemplateData({ mission_source_id }),
  selectDownload: (eventName) => getBlobOrder(stateProps.selectedElementOrder, eventName),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(OrderTableChilrend);
