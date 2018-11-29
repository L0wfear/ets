import * as React from 'react';
import { connect } from 'react-redux';
import * as Button from 'react-bootstrap/lib/Button';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { compose } from 'redux';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import { ReduxState } from 'redux-main/@types/state';
import {
  getListData,
} from 'components/new/ui/registry/module/selectors-registry';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';
import { registrySetSelectedRowToShowInForm } from 'components/new/ui/registry/module/actions-registy';

type PropsButtonRead = {
  registryKey: string;
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
  registrySetSelectedRowToShowInForm: any;
};

class ButtonRead extends React.Component<PropsButtonRead, {}> {
  handleClick: React.MouseEventHandler<Button> = () => {
    this.props.registrySetSelectedRowToShowInForm();
  }

  render() {
    const { props } = this;

    return (
      <Button id="open-update-form" bsSize="small" onClick={this.handleClick} disabled={!props.selectedRow}>
        <Glyphicon glyph="search" /> Просмотреть
      </Button>
    );
  }
}

export default compose(
  connect<any, any, any, ReduxState>(
    (state, { registryKey }) => ({
      permissions: getListData(state.registry, registryKey).permissions.read,
    }),
  ),
  withRequirePermissionsNew(),
  connect<any, any, any, ReduxState>(
    (state, { registryKey }) => ({
      selectedRow: getListData(state.registry, registryKey).data.selectedRow,
    }),
    (dispatch, { registryKey }) => ({
      registrySetSelectedRowToShowInForm: () => (
        dispatch(
          registrySetSelectedRowToShowInForm(registryKey),
        )
      ),
    }),
  ),
)(ButtonRead);
