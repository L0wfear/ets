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
import { actionGetAndSetInStoreCompany } from 'redux-main/reducers/modules/company/actions';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getSessionState } from 'redux-main/reducers/selectors';

type ButtonFuelCardCreateStateProps = {
  uniqKeyForParams: OneRegistryData['list']['data']['uniqKeyForParams'];
  selectedRow: OneRegistryData['list']['data']['selectedRow'];
};
type ButtonFuelCardCreateDispatchProps = {
};
type ButtonFuelCardCreateOwnProps = CommonTypesForButton & {};
type ButtonFuelCardCreateMergeProps = {};

type ButtonFuelCardCreateProps = (
  ButtonFuelCardCreateStateProps
  & ButtonFuelCardCreateDispatchProps
  & ButtonFuelCardCreateOwnProps
  & ButtonFuelCardCreateMergeProps
  ) & WithSearchProps;

const ButtonFuelCardCreate: React.FC<ButtonFuelCardCreateProps> = (props) => {
  const dispatch = etsUseDispatch();
  const userCompanyId = etsUseSelector((stateRedux) => getSessionState(stateRedux).userData.company_id);
  const [canCreate, setCanCreate] = React.useState(false);

  const data = React.useMemo(
    () => (
      get(props, 'data', {}) as ButtonFuelCardCreateOwnProps['data']
    ),
    [props.data],
  );

  React.useEffect(() => {
    (async () => {
      await dispatch(
        actionGetAndSetInStoreCompany({},
          { page: 'main' },
        ),
      ).then(
        ({ data }) => (
          setCanCreate(
            data.find((company) => company.company_id === userCompanyId).fuel_cards_creating)
        ),
      );
    })();
  }, []);

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
    canCreate && (
      <EtsBootstrap.Button id={`${props.registryKey}.${data.id || 'open-create-form'}`} bsSize="small" onClick={handleClick}>
        <EtsBootstrap.Glyphicon glyph={data.glyph !== 'none' ? (data.glyph || 'plus') : null} />{data.title || 'Создать'}
      </EtsBootstrap.Button>
    )
  );
};

export default compose<ButtonFuelCardCreateProps, ButtonFuelCardCreateOwnProps>(
  withSearch,
  connect<{ permissions: OneRegistryData['list']['permissions']['create']; }, DispatchProp, { registryKey: string; }, ReduxState>(
    (state, { registryKey }) => ({
      permissions: getListData(state.registry, registryKey).permissions.create, //  прокидывается в следующий компонент
    }),
  ),
  withRequirePermission(),
  connect<ButtonFuelCardCreateStateProps, ButtonFuelCardCreateDispatchProps, ButtonFuelCardCreateOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      uniqKeyForParams: getListData(state.registry, registryKey).data.uniqKeyForParams,
      selectedRow: getListData(state.registry, registryKey).data.selectedRow,
    }),
  ),
)(ButtonFuelCardCreate);
