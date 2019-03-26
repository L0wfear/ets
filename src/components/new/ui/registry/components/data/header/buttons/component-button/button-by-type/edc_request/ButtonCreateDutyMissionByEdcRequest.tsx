import * as React from 'react';
import { connect } from 'react-redux';
import * as Button from 'react-bootstrap/lib/Button';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import { ReduxState } from 'redux-main/@types/state';
import {
  getListData,
} from 'components/new/ui/registry/module/selectors-registry';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { registrySetSelectedRowToShowInForm } from 'components/new/ui/registry/module/actions-registy';
import { compose } from 'recompose';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { get } from 'lodash';
import dutyMssionPermissions from 'components/missions/duty_mission/config-data/permissions';
import { edc_form_permitted_type } from 'components/new/pages/edc_request/_config-data/contants';

type ButtonCreateDutyMissionByEdcRequestStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
};
type ButtonCreateDutyMissionByEdcRequestDispatchProps = {
  registrySetSelectedRowToShowInForm: any;
};
type ButtonCreateDutyMissionByEdcRequestOwnProps = {
  registryKey: string;
};
type ButtonCreateDutyMissionByEdcRequestMergeProps = (
  ButtonCreateDutyMissionByEdcRequestStateProps
  & ButtonCreateDutyMissionByEdcRequestDispatchProps
  & ButtonCreateDutyMissionByEdcRequestOwnProps
);

type ButtonCreateDutyMissionByEdcRequestProps = (
  ButtonCreateDutyMissionByEdcRequestMergeProps
  & WithSearchProps
);

class ButtonCreateDutyMissionByEdcRequest extends React.Component<ButtonCreateDutyMissionByEdcRequestProps, {}> {
  handleClick: React.MouseEventHandler<Button> = () => {
    this.props.setParams({
      [this.props.uniqKey]: get(this.props.selectedRow, this.props.uniqKey, null),
      type: edc_form_permitted_type.duty_mission,
    }),
    this.props.registrySetSelectedRowToShowInForm();
  }

  render() {
    const { props } = this;

    return (
      <Button id="open-update-form" bsSize="small" onClick={this.handleClick} disabled={!props.selectedRow}>
        <Glyphicon glyph="plus" /> Создать наряд-задание
      </Button>
    );
  }
}

export default compose<ButtonCreateDutyMissionByEdcRequestProps, ButtonCreateDutyMissionByEdcRequestOwnProps>(
  withRequirePermissionsNew({
    permissions: dutyMssionPermissions.update,
  }),
  connect<ButtonCreateDutyMissionByEdcRequestStateProps, ButtonCreateDutyMissionByEdcRequestDispatchProps, ButtonCreateDutyMissionByEdcRequestOwnProps, ButtonCreateDutyMissionByEdcRequestMergeProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKey: getListData(state.registry, registryKey).data.uniqKey,
      selectedRow: getListData(state.registry, registryKey).data.selectedRow,
    }),
    (dispatch: any, { registryKey }) => ({
      registrySetSelectedRowToShowInForm: () => (
        dispatch(
          registrySetSelectedRowToShowInForm(registryKey),
        )
      ),
    }),
    null,
    {
      pure: false,
    },
  ),
  withSearch,
)(ButtonCreateDutyMissionByEdcRequest);
