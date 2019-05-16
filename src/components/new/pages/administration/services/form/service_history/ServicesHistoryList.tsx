import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  getConfig,
} from 'components/new/pages/administration/services/form/service_history/_config-data/registry-config';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData, actionChangeGlobalPaylaodInServiceData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

import { HandleThunkActionCreator } from "react-redux";
import { Service } from 'redux-main/reducers/modules/services/@types/services';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { createValidDateTime, getToday0am, getToday2359, diffDates } from 'utils/dates';

export type ServicesHistoryListStateProps = {};
export type ServicesHistoryListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
  actionChangeGlobalPaylaodInServiceData: HandleThunkActionCreator<typeof actionChangeGlobalPaylaodInServiceData>;
};
export type ServicesHistoryListOwnProps = {
  service_id: Service['id'];
  service_name: Service['name'];
};
export type ServicesHistoryListMergedProps = (
  ServicesHistoryListStateProps
  & ServicesHistoryListDispatchProps
  & ServicesHistoryListOwnProps
) & WithSearchProps;
export type ServicesHistoryListProps = (
  ServicesHistoryListMergedProps
);

const ServicesHistoryList: React.FC<ServicesHistoryListProps> = (props) => {
  const date_start: string = props.searchState.date_from;
  const date_end: string = props.searchState.date_to;

  React.useEffect(
    () => {
      props.registryAddInitialData(
        getConfig(
          props.service_id,
          props.service_name,
          date_start || createValidDateTime(getToday0am()),
          date_end || createValidDateTime(getToday2359()),
        ),
      );
      return () => {
        props.registryRemoveData(registryKey);
      };
    },
    [props.service_id, props.service_name],
  );

  React.useEffect(
    () => {
      if (date_start && date_end) {
        const date_start_value = date_start || createValidDateTime(getToday0am());
        const date_end_value = date_end || createValidDateTime(getToday2359());

        if (diffDates(date_end_value, date_start_value) > 0) {
          const payload = {
            getRegistryData: {
              date_start: date_start_value,
              date_end: date_end_value,
            },
            getBlobData: {
              format: 'xls',
              date_start: date_start_value,
              date_end: date_end_value,
            },
          };

          props.actionChangeGlobalPaylaodInServiceData(registryKey, payload);
        }
      }
    },
    [date_start, date_end],
  );

  return (
    <Registry registryKey={registryKey} />
  );
};

export default compose<ServicesHistoryListProps, ServicesHistoryListOwnProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<ServicesHistoryListStateProps, ServicesHistoryListDispatchProps, ServicesHistoryListOwnProps, ReduxState>(
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
)(ServicesHistoryList);
