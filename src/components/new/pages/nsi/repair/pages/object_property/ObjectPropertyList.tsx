import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/repair/pages/object_property/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData, actionChangeGlobalPaylaodInServiceData } from 'components/new/ui/registry/module/actions-registy';
import { ObjectProperty } from 'redux-main/reducers/modules/repair/object_property/@types/objectProperty';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

export type ObjectPropertyListStateProps = {};
export type ObjectPropertyListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
  actionChangeGlobalPaylaodInServiceData: HandleThunkActionCreator<typeof actionChangeGlobalPaylaodInServiceData>;
};
export type ObjectPropertyListOwnProps = {};
export type ObjectPropertyListMergedProps = (
  ObjectPropertyListStateProps
  & ObjectPropertyListDispatchProps
  & ObjectPropertyListOwnProps
);
export type ObjectPropertyListProps = (
  ObjectPropertyListMergedProps
) & WithSearchProps;

const ObjectPropertyList: React.FC<ObjectPropertyListProps> = (props) => {
  const selected_odh_dt_value: ObjectProperty['type_slug'] = props.match.params.selected_odh_dt_value;

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
            object_type: selected_odh_dt_value,
          },
          getBlobData: {
            format: 'xls',
            object_type: selected_odh_dt_value,
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
    </>
  );
};

export default compose<ObjectPropertyListProps, ObjectPropertyListOwnProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<ObjectPropertyListStateProps, ObjectPropertyListDispatchProps, ObjectPropertyListOwnProps, ReduxState>(
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
)(ObjectPropertyList);
