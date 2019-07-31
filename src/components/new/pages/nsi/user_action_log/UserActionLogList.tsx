import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/user_action_log/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData, actionChangeGlobalPaylaodInServiceData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { createValidDateTime, getToday0am, getToday2359 } from 'utils/dates';

export type UserActionLogListStateProps = {};
export type UserActionLogListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
  actionChangeGlobalPaylaodInServiceData: HandleThunkActionCreator<typeof actionChangeGlobalPaylaodInServiceData>;
};
export type UserActionLogListOwnProps = {};
export type UserActionLogListMergedProps = (
  UserActionLogListStateProps
  & UserActionLogListDispatchProps
  & UserActionLogListOwnProps
);
export type UserActionLogListProps = (
  UserActionLogListMergedProps
) & WithSearchProps;

const UserActionLogList: React.FC<UserActionLogListProps> = (props) => {
  const date_start: string = props.searchState.date_from;
  const date_end: string = props.searchState.date_to;

  React.useEffect(
    () => {
      props.registryAddInitialData(
        getToConfig(
          date_start || createValidDateTime(getToday0am()),
          date_end || createValidDateTime(getToday2359()),
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
      if (date_start && date_end) {
        const payload = {
          getRegistryData: {
            date_start,
            date_end,
          },
          getBlobData: {
            format: 'xls',
            date_start,
            date_end,
          },
        };

        props.actionChangeGlobalPaylaodInServiceData(registryKey, payload);
      }
    },
    [date_start, date_end],
  );

  return (
    <>
      <Registry registryKey={registryKey} />
    </>
  );
};

export default compose<UserActionLogListProps, UserActionLogListOwnProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<UserActionLogListStateProps, UserActionLogListDispatchProps, UserActionLogListOwnProps, ReduxState>(
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
)(UserActionLogList);
