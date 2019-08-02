import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/medical_stats/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData, actionChangeGlobalPaylaodInServiceData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { createValidDateTime, getToday0am, getToday2359 } from 'components/@next/@utils/dates/dates';

export type MedicalStatsListStateProps = {};
export type MedicalStatsListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
  actionChangeGlobalPaylaodInServiceData: HandleThunkActionCreator<typeof actionChangeGlobalPaylaodInServiceData>;
};
export type MedicalStatsListOwnProps = {};
export type MedicalStatsListMergedProps = (
  MedicalStatsListStateProps
  & MedicalStatsListDispatchProps
  & MedicalStatsListOwnProps
);
export type MedicalStatsListProps = (
  MedicalStatsListMergedProps
) & WithSearchProps;

const MedicalStatsList: React.FC<MedicalStatsListProps> = (props) => {
  const date_from: string = props.searchState.date_from;
  const date_to: string = props.searchState.date_to;

  React.useEffect(
    () => {
      props.registryAddInitialData(
        getToConfig(
          date_from || createValidDateTime(getToday0am()),
          date_to || createValidDateTime(getToday2359()),
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
      if (date_from && date_to) {
        const payload = {
          getRegistryData: {
            date_from,
            date_to,
          },
          getBlobData: {
            format: 'xls',
            date_from,
            date_to,
          },
        };

        props.actionChangeGlobalPaylaodInServiceData(registryKey, payload);
      }
    },
    [date_from, date_to],
  );

  return (
    <>
      <Registry registryKey={registryKey} />
    </>
  );
};

export default compose<MedicalStatsListProps, MedicalStatsListOwnProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<MedicalStatsListStateProps, MedicalStatsListDispatchProps, MedicalStatsListOwnProps, ReduxState>(
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
)(MedicalStatsList);
