import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import CleaningRateFormLazy from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_rate/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/data_for_calculation/pages/cleaning_rate/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData, actionChangeGlobalPaylaodInServiceData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { CleaningRate } from 'redux-main/reducers/modules/cleaning_rate/@types/cleaningRate';

export type CleaningRateListStateProps = {};
export type CleaningRateListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
  actionChangeGlobalPaylaodInServiceData: HandleThunkActionCreator<typeof actionChangeGlobalPaylaodInServiceData>;
};
export type CleaningRateListOwnProps = {};
export type CleaningRateListMergedProps = (
  CleaningRateListStateProps
  & CleaningRateListDispatchProps
  & CleaningRateListOwnProps
);
export type CleaningRateListProps = (
  CleaningRateListMergedProps
) & WithSearchProps;

const CleaningRateList: React.FC<CleaningRateListProps> = (props) => {
  const selected_odh_dt_value: CleaningRate['type'] = props.match.params.selected_odh_dt_value;

  React.useEffect(
    () => {
      props.registryAddInitialData(getToConfig(selected_odh_dt_value));
      return () => {
        props.registryRemoveData(registryKey);
      };
    },
    [],
  );

  React.useEffect(
    () => {
      if (selected_odh_dt_value && (selected_odh_dt_value === 'odh' || selected_odh_dt_value === 'dt')) {
        const payload = {
          getRegistryData: {
            type: selected_odh_dt_value,
          },
          getBlobData: {
            format: 'xls',
            type: selected_odh_dt_value,
          },
        };

        props.actionChangeGlobalPaylaodInServiceData(registryKey, payload);
      }
    },
    [selected_odh_dt_value],
  );

  return (
    <>
      <Registry registryKey={registryKey} />
      <CleaningRateFormLazy registryKey={registryKey} />
    </>
  );
};

export default compose<CleaningRateListProps, CleaningRateListOwnProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<CleaningRateListStateProps, CleaningRateListDispatchProps, CleaningRateListOwnProps, ReduxState>(
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
)(CleaningRateList);
