import * as React from 'react';
import Registry from 'components/new/ui/registry/components/Registry';
import FuelCardsFormLazy from 'components/new/pages/nsi/autobase/pages/fuel_cards/form';

import {
  registryKey,
  getToConfig,
} from 'components/new/pages/nsi/autobase/pages/fuel_cards/_config-data/registry-config';
import { compose } from 'recompose';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';

export type FuelCardsListStateProps = {};
export type FuelCardsListDispatchProps = {
  registryAddInitialData: HandleThunkActionCreator<typeof registryAddInitialData>;
  registryRemoveData: HandleThunkActionCreator<typeof registryRemoveData>;
};
export type FuelCardsListOwnProps = {};
export type FuelCardsListMergedProps = (
  FuelCardsListStateProps
  & FuelCardsListDispatchProps
  & FuelCardsListOwnProps
);
export type FuelCardsListProps = (
  FuelCardsListMergedProps
);

const FuelCardsList: React.FC<FuelCardsListProps> = (props) => {
  React.useEffect(
    () => {
      props.registryAddInitialData(getToConfig(true, 'Архив топливных карт'));
      return () => {
        props.registryRemoveData(registryKey);
      };
    },
    [],
  );

  return (
    <>
      <Registry registryKey={registryKey} />
      <FuelCardsFormLazy registryKey={registryKey} />
    </>
  );
};

export default compose<FuelCardsListProps, FuelCardsListOwnProps>(
  withPreloader({
    page: registryKey,
    typePreloader: 'mainpage',
  }),
  connect<FuelCardsListStateProps, FuelCardsListDispatchProps, FuelCardsListOwnProps, ReduxState>(
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
)(FuelCardsList);
