import * as React from 'react';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import { registryChangeDataPaginatorCurrentPage } from 'components/new/ui/registry/module/actions-registy';
import { ReduxState } from 'redux-main/@types/state';
import { compose } from 'recompose';

type NumberButtonsStateProps = {
  active: boolean;
};
type NumberButtonsDispatchProps = {
  registryChangeDataPaginatorCurrentPage: HandleThunkActionCreator<typeof registryChangeDataPaginatorCurrentPage>;
};
type NumberButtonsOwnProps = {
  number: number;
  registryKey: string;
};
type NumberButtonsProps = (
  NumberButtonsStateProps
  & NumberButtonsDispatchProps
  & NumberButtonsOwnProps
);

const NumberButtons: React.FC<NumberButtonsProps> = React.memo(
  (props) => {
    const handleClick = React.useCallback(
      () => {
        props.registryChangeDataPaginatorCurrentPage(
          props.registryKey,
          props.number,
        );
      },
      [props.registryChangeDataPaginatorCurrentPage, props.number, props.registryKey],
    );
    return (
      <EtsBootstrap.Button
        active={props.active}
        onClick={handleClick}
      >
        {props.number + 1}
      </EtsBootstrap.Button>
    );
  },
);

export default compose<NumberButtonsProps, NumberButtonsOwnProps>(
  connect<NumberButtonsStateProps, NumberButtonsDispatchProps, NumberButtonsOwnProps, ReduxState>(
    (state, { registryKey, number }) => ({
      active: getListData(state.registry, registryKey).paginator.currentPage === number,
    }),
    (dispatch: any) => ({
      registryChangeDataPaginatorCurrentPage: (...arg) => (
        dispatch(
          registryChangeDataPaginatorCurrentPage(
            ...arg,
          ),
        )
      ),
    }),
  ),
)(NumberButtons);
