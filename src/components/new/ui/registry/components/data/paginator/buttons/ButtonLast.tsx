import * as React from 'react';
import { connect } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';

import {
  registryChangeDataPaginatorCurrentPage,
} from 'components/new/ui/registry/module/actions-registy';
import { ButtonPaginatorWrap } from './styled';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { ReduxState } from 'redux-main/@types/state';

type StateProps = {
  active: boolean;
  index: number;
};
type OwnProps = {
  registryKey: string;
};

type Props = StateProps & OwnProps;

const ButtonLast: React.FC<Props> = React.memo(
  (props) => {
    const { index } = props;

    const dispatch = etsUseDispatch();
    const handleClick = React.useCallback(
      () => {
        dispatch(
          registryChangeDataPaginatorCurrentPage(
            props.registryKey,
            index,
          ),
        );
      },
      [index],
    );

    return (
      <ButtonPaginatorWrap
        themeName="paginator"
        disabled={props.active}
        onClick={handleClick}
      >
        Последняя
      </ButtonPaginatorWrap>
    );
  },
);

export default connect<StateProps, {}, OwnProps, ReduxState>(
  (state, { registryKey }) => {
    const {
      processed: { total_count },
      paginator,
    } = getListData(state.registry, registryKey);

    const index = Math.ceil(total_count / paginator.perPage) - 1;

    return {
      active: index === paginator.currentPage,
      index,
    };
  },
)(ButtonLast);
