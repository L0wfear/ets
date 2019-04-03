import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import RepairFormLazy from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/repair/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/local_registry/repair/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';

export type RepairListStateProps = {};
export type RepairListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type RepairListOwnProps = {};
export type RepairListMergedProps = (
  RepairListStateProps
  & RepairListDispatchProps
  & RepairListOwnProps
);
export type RepairListProps = (
  RepairListMergedProps
) & WithSearchProps;

const RepairList: React.FC<RepairListProps> = (props) => {
  const car_id = getNumberValueFromSerch(props.match.params.car_actual_asuods_id);

  React.useEffect(
    () => {
      props.registryAddInitialData(getToConfig(car_id));
      return () => {
        props.registryRemoveData(registryKey);
      };
    },
    [car_id],
  );

  return (
    <>
      <Registry registryKey={registryKey} />
      <RepairFormLazy registryKey={registryKey} />
    </>
  );
};

export default compose<RepairListProps, RepairListOwnProps>(
  withSearch,
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<RepairListStateProps, RepairListDispatchProps, RepairListOwnProps, ReduxState>(
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
    }),
  ),
)(RepairList);
