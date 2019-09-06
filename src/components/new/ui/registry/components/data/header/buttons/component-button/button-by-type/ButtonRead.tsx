import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import withRequirePermissionsNew from 'components/old/util/RequirePermissionsNewRedux';
import { ReduxState } from 'redux-main/@types/state';
import {
  getListData,
} from 'components/new/ui/registry/module/selectors-registry';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { registrySetSelectedRowToShowInForm } from 'components/new/ui/registry/module/actions-registy';
import { compose } from 'recompose';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { get } from 'lodash';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';

type ButtonReadStateProps = {
  uniqKey: OneRegistryData['list']['data']['uniqKey'];
  uniqKeyForParams: OneRegistryData['list']['data']['uniqKeyForParams'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
};
type ButtonReadDispatchProps = {
  registrySetSelectedRowToShowInForm: any;
};
type ButtonReadOwnProps = CommonTypesForButton & {
  onClick?: (item: any) => any;
};
type ButtonReadMergeProps = {};

type ButtonReadProps = (
  ButtonReadStateProps
  & ButtonReadDispatchProps
  & ButtonReadOwnProps
  & ButtonReadMergeProps
) & WithSearchProps;

let lasPermissions = {};
let lastPermissionsArray = [];

const getPermissionsReadUpdate = (permission) => {
  if (lasPermissions !== permission) {
    lasPermissions = permission;

    lastPermissionsArray = [permission.read, permission.update];
  }

  return lastPermissionsArray;
};

const ButtonRead: React.FC<ButtonReadProps> = React.memo(
  (props) => {
    const data = React.useMemo(
      () => (
        get(props, 'data', {} as ButtonReadOwnProps['data'])
      ),
      [props.data],
    );
    const handleClick = React.useCallback(
      () => {
        if (props.onClick) {
          props.onClick(props.selectedRow);
          return;
        }
        props.setParams({
          [props.uniqKeyForParams]: get(props.selectedRow, props.uniqKey, null),
          ...get(data, 'objChangeParams', {}),
        }),
        props.registrySetSelectedRowToShowInForm();
      },
      [data, props.onClick, props.selectedRow, props.uniqKey, props.uniqKeyForParams, props.registrySetSelectedRowToShowInForm],
    );

    return (
      <EtsBootstrap.Button id="open-update-form" bsSize="small" onClick={handleClick} disabled={!props.selectedRow}>
        <EtsBootstrap.Glyphicon glyph={data.glyph || 'search'} />{data.title || 'Просмотреть'}
      </EtsBootstrap.Button>
    );
  },
);

export default compose<ButtonReadProps, ButtonReadOwnProps>(
  withSearch,
  connect<{ permissions: (string | boolean)[] }, DispatchProp, { registryKey: string }, ReduxState>(
    (state, { registryKey }) => ({
      permissions: getPermissionsReadUpdate(getListData(state.registry, registryKey).permissions), //  прокидывается в следующий компонент
    }),
  ),
  withRequirePermissionsNew(),
  connect<ButtonReadStateProps, ButtonReadDispatchProps, ButtonReadOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKey: getListData(state.registry, registryKey).data.uniqKey,
      uniqKeyForParams: getListData(state.registry, registryKey).data.uniqKeyForParams,
      selectedRow: getListData(state.registry, registryKey).data.selectedRow,
    }),
    (dispatch: any, { registryKey }) => ({
      registrySetSelectedRowToShowInForm: () => (
        dispatch(
          registrySetSelectedRowToShowInForm(registryKey),
        )
      ),
    }),
  ),
)(ButtonRead);
