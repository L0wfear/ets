import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { withRequirePermission } from 'components/@next/@common/hoc/require_permission/withRequirePermission';
import { ReduxState } from 'redux-main/@types/state';
import {
  getListData,
} from 'components/new/ui/registry/module/selectors-registry';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { compose } from 'recompose';
import { get } from 'lodash';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';

type ButtonCreateStateProps = {
  uniqKeyForParams: OneRegistryData['list']['data']['uniqKeyForParams'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
};
type ButtonCreateDispatchProps = {
};
type ButtonCreateOwnProps = CommonTypesForButton & {};
type ButtonCreateMergeProps = {};

type ButtonCreateProps = (
  ButtonCreateStateProps
  & ButtonCreateDispatchProps
  & ButtonCreateOwnProps
  & ButtonCreateMergeProps
) & WithSearchProps;

const ButtonCreate: React.FC<ButtonCreateProps> = (props) => {
  const data = React.useMemo(
    () => (
      get(props, 'data', {}) as ButtonCreateOwnProps['data']
    ),
    [props.data],
  );

  const handleClick = React.useCallback(
    () => {
      const uniqKeyForParams = get(data, 'other_params.uniqKeyForParams.key') || props.uniqKeyForParams;
      const path = get(data, 'other_params.uniqKeyForParams.path');
      const paramsValue = path ? get(props.selectedRow, path) : buttonsTypes.create;

      props.setParams({
        [uniqKeyForParams]: paramsValue,
        type: get(data, 'other_params.type', null),
      });
    },
    [data, props.setParams, props.match.params, props.setDataInSearch, props.searchState],
  );

  return (
    <EtsBootstrap.Button id={`${props.registryKey}.${data.id || 'open-create-form'}`} bsSize="small" onClick={handleClick}>
      <EtsBootstrap.Glyphicon glyph={data.glyph !== 'none' ? (data.glyph || 'plus') : null} />{data.title || 'Создать'}
    </EtsBootstrap.Button>
  );
};

export default compose<ButtonCreateProps, ButtonCreateOwnProps>(
  withSearch,
  connect<{ permissions: OneRegistryData['list']['permissions']['create'] }, DispatchProp, { registryKey: string }, ReduxState>(
    (state, { registryKey }) => ({
      permissions: getListData(state.registry, registryKey).permissions.create, //  прокидывается в следующий компонент
    }),
  ),
  withRequirePermission(),
  connect<ButtonCreateStateProps, ButtonCreateDispatchProps, ButtonCreateOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKeyForParams: getListData(state.registry, registryKey).data.uniqKeyForParams,
      selectedRow: getListData(state.registry, registryKey).data.selectedRow,
    }),
  ),
)(ButtonCreate);
