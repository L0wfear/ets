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
import missionPermissions from 'components/missions/mission/config-data/permissions';
import { edc_form_permitted_type } from 'components/new/pages/edc_request/_config-data/contants';

type ButtonCreateMissionByEdcRequestStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
};
type ButtonCreateMissionByEdcRequestDispatchProps = {
  registrySetSelectedRowToShowInForm: any;
};
type ButtonCreateMissionByEdcRequestOwnProps = {
  registryKey: string;
};
type ButtonCreateMissionByEdcRequestMergeProps = {};

type ButtonCreateMissionByEdcRequestProps = (
  ButtonCreateMissionByEdcRequestStateProps
  & ButtonCreateMissionByEdcRequestDispatchProps
  & ButtonCreateMissionByEdcRequestOwnProps
  & ButtonCreateMissionByEdcRequestMergeProps
) & WithSearchProps;

class ButtonCreateMissionByEdcRequest extends React.Component<ButtonCreateMissionByEdcRequestProps, {}> {
  handleClick: React.MouseEventHandler<Button> = () => {
    this.props.setParams({
      [this.props.uniqKey]: get(this.props.selectedRow, this.props.uniqKey, null),
      type: edc_form_permitted_type.mission,
    }),
    this.props.registrySetSelectedRowToShowInForm();
  }

  render() {
    const { props } = this;

    return (
      <Button id="open-update-form" bsSize="small" onClick={this.handleClick} disabled={!props.selectedRow}>
        <Glyphicon glyph="plus" /> Создать децентрализованное задание
      </Button>
    );
  }
}

export default compose<ButtonCreateMissionByEdcRequestProps, ButtonCreateMissionByEdcRequestOwnProps>(
  withRequirePermissionsNew({
    permissions: missionPermissions.update,
  }),
  connect<ButtonCreateMissionByEdcRequestStateProps, ButtonCreateMissionByEdcRequestDispatchProps, ButtonCreateMissionByEdcRequestOwnProps, ButtonCreateMissionByEdcRequestMergeProps, ReduxState>(
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
)(ButtonCreateMissionByEdcRequest);
