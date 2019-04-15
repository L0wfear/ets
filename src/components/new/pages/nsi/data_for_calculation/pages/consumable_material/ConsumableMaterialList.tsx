import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import ConsumableMaterialFormLazy from 'components/new/pages/nsi/data_for_calculation/pages/consumable_material/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/data_for_calculation/pages/consumable_material/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/ui/new/preloader/hoc/with-preloader/withPreloader';

export type ConsumableMaterialListStateProps = {};
export type ConsumableMaterialListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type ConsumableMaterialListOwnProps = {};
export type ConsumableMaterialListMergedProps = (
  ConsumableMaterialListStateProps
  & ConsumableMaterialListDispatchProps
  & ConsumableMaterialListOwnProps
);
export type ConsumableMaterialListProps = (
  ConsumableMaterialListMergedProps
);

const ConsumableMaterialList: React.FC<ConsumableMaterialListProps> = (props) => {
  React.useEffect(
    () => {
      props.registryAddInitialData(getToConfig());
      return () => {
        props.registryRemoveData(registryKey);
      };
    },
    [],
  );

  return (
    <>
      <Registry registryKey={registryKey} />
      <ConsumableMaterialFormLazy registryKey={registryKey} />
    </>
  );
};

export default compose<ConsumableMaterialListProps, ConsumableMaterialListOwnProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<ConsumableMaterialListStateProps, ConsumableMaterialListDispatchProps, ConsumableMaterialListOwnProps, ReduxState>(
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
)(ConsumableMaterialList);
