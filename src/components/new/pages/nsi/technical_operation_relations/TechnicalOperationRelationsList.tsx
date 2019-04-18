import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import TechnicalOperationRelationsFormLazy from 'components/new/pages/nsi/technical_operation_relations/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/technical_operation_relations/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData, actionChangeGlobalPaylaodInServiceData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';

export type TechnicalOperationRelationsListStateProps = {};
export type TechnicalOperationRelationsListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
  actionChangeGlobalPaylaodInServiceData: HandleThunkActionCreator<typeof actionChangeGlobalPaylaodInServiceData>;
};
export type TechnicalOperationRelationsListOwnProps = {};
export type TechnicalOperationRelationsListMergedProps = (
  TechnicalOperationRelationsListStateProps
  & TechnicalOperationRelationsListDispatchProps
  & TechnicalOperationRelationsListOwnProps
);
export type TechnicalOperationRelationsListProps = (
  TechnicalOperationRelationsListMergedProps
) & WithSearchProps;

const TechnicalOperationRelationsList: React.FC<TechnicalOperationRelationsListProps> = (props) => {
  const technical_operation_id = getNumberValueFromSerch(props.searchState.technical_operation_id) || null;
  const municipal_facility_id = getNumberValueFromSerch(props.searchState.municipal_facility_id) || null;
  const route_types = props.searchState.route_types || null;
  const func_type_id = getNumberValueFromSerch(props.searchState.func_type_id) || null;

  React.useEffect(
    () => {
      props.registryAddInitialData(
        getToConfig(
          technical_operation_id,
          municipal_facility_id,
          route_types,
          func_type_id,
        ),
      );
      return () => {
        props.registryRemoveData(registryKey);
      };
    },
    [],
  );

  React.useEffect(
    () => {
      if (technical_operation_id && municipal_facility_id && route_types && func_type_id) {
        const payload = {
          getRegistryData: {
            technical_operation_id,
            municipal_facility_id,
            route_types,
            func_type_id,
          },
        };

        props.actionChangeGlobalPaylaodInServiceData(registryKey, payload);
      }
    },
    [technical_operation_id, municipal_facility_id, route_types, func_type_id],
  );

  return (
    <>
      <Registry registryKey={registryKey} />
      <TechnicalOperationRelationsFormLazy registryKey={registryKey} />
    </>
  );
};

export default compose<TechnicalOperationRelationsListProps, TechnicalOperationRelationsListOwnProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<TechnicalOperationRelationsListStateProps, TechnicalOperationRelationsListDispatchProps, TechnicalOperationRelationsListOwnProps, ReduxState>(
    null,
    (dispatch: any) => ({
      registryAddInitialData: (...any) => (
        dispatch(
          registryAddInitialData(...any),
        )
      ),
      registryRemoveData: (registryKeyTemp: string) => (
        dispatch(
          registryRemoveData(registryKeyTemp),
        )
      ),
      actionChangeGlobalPaylaodInServiceData: (...arg) => (
        dispatch(
          actionChangeGlobalPaylaodInServiceData(...arg),
        )
      ),
    }),
  ),
  withSearch,
)(TechnicalOperationRelationsList);
