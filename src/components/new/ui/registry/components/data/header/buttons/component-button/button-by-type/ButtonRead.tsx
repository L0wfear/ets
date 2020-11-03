import * as React from 'react';
import { get } from 'lodash';

import EtsBootstrap from 'components/new/ui/@bootstrap';

import {
  getListData,
} from 'components/new/ui/registry/module/selectors-registry';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { etsUseIsPermitted } from 'components/@next/ets_hoc/etsUseIsPermitted';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { makePayloadToParamsForRead } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/utils';
import { registrySetRowIsOpen } from 'components/new/ui/registry/module/actions-registy';

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
    const permissions = etsUseSelector((state) => getPermissionsReadUpdate(getListData(state.registry, props.registryKey).permissions));
    const uniqKeyForParams = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.uniqKeyForParams);
    const uniqKey = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.uniqKey);
    const selectedRow = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.selectedRow);
    const withoutWithSearch = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.withoutWithSearch);
    const dispatch = etsUseDispatch();
    
    const data = React.useMemo(
      () => (
        get(props, 'data', {}) as Props['data']
      ),
      [props.data],
    );
    const handleClick = React.useCallback(
      () => {
        if(withoutWithSearch) {
          dispatch(registrySetRowIsOpen(props.registryKey, true));
          return;
        }
        if (props.onClick) {
          props.onClick(selectedRow);
          return;
        }

        const changeObj = makePayloadToParamsForRead(
          data,
          selectedRow,
          uniqKeyForParams,
          uniqKey,
        );

        props.setParams(changeObj);
      },
      [data, props.onClick, selectedRow, uniqKey, uniqKeyForParams, props.setParams, props.match.params, props.setDataInSearch, props.searchState, withoutWithSearch],
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
