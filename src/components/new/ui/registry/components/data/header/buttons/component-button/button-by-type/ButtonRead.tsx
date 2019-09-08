import * as React from 'react';
import { get } from 'lodash';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import {
  getListData,
} from 'components/new/ui/registry/module/selectors-registry';
import { registrySetSelectedRowToShowInForm } from 'components/new/ui/registry/module/actions-registy';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { etsUseIsPermitted } from 'components/@next/ets_hoc/etsUseIsPermitted';
import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

type OwnProps = CommonTypesForButton & {
  onClick?: (item: any) => any;
};

type Props = OwnProps & WithSearchProps;

let lasPermissions = {};
let lastPermissionsArray = [];

const getPermissionsReadUpdate = (permission) => {
  if (lasPermissions !== permission) {
    lasPermissions = permission;

    lastPermissionsArray = [permission.read, permission.update];
  }

  return lastPermissionsArray;
};

const ButtonRead: React.FC<Props> = React.memo(
  (props) => {
    const dispatch = etsUseDispatch();
    const permissions = etsUseSelector((state) => getPermissionsReadUpdate(getListData(state.registry, props.registryKey).permissions));
    const uniqKeyForParams = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.uniqKeyForParams);
    const uniqKey = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.uniqKey);
    const selectedRow = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.selectedRow);

    const data = React.useMemo(
      () => (
        get(props, 'data', {} as Props['data'])
      ),
      [props.data],
    );
    const handleClick = React.useCallback(
      () => {
        if (props.onClick) {
          props.onClick(selectedRow);
          return;
        }

        const keyParams = get(data, 'other_params.uniqKeyForParams.key') || uniqKeyForParams;
        const path = get(data, 'other_params.uniqKeyForParams.path');
        const paramsValue = get(selectedRow, path ||  uniqKey, null);

        props.setParams({
          [keyParams]: paramsValue,
          type: get(data, 'other_params.type', null),
        });
        dispatch(
          registrySetSelectedRowToShowInForm(),
        );
      },
      [data, props.onClick, selectedRow, uniqKey, uniqKeyForParams],
    );

    const isPermitted = etsUseIsPermitted(
      get(data, 'other_params.uniqKeyForParams.permissions') || permissions,
    );

    return isPermitted && (
      <EtsBootstrap.Button id={`${props.registryKey}.open-update-form`} bsSize="small" onClick={handleClick} disabled={!selectedRow}>
        <EtsBootstrap.Glyphicon glyph={data.glyph !== 'none' ? (data.glyph || 'search') : null} />{data.title || 'Просмотреть'}
      </EtsBootstrap.Button>
    );
  },
);

export default withSearch<OwnProps>(ButtonRead);
