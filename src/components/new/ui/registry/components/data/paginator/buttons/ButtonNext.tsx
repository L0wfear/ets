import * as React from 'react';
import { connect } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';

import {
  registryChangeDataPaginatorCurrentPage,
} from 'components/new/ui/registry/module/actions-registy';
import { ButtonPaginatorWrap } from './styled';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { ReduxState } from 'redux-main/@types/state';

type StateProps = {
  show: boolean;
  currentPage: number;
};
type OwnProps = {
  registryKey: string;
};

type Props = StateProps & OwnProps;

const ButtonNext: React.FC<Props> = React.memo(
  (props) => {
    const dispatch = etsUseDispatch();
    const handleClick = React.useCallback(
      () => {
        dispatch(
          registryChangeDataPaginatorCurrentPage(
            props.registryKey,
            props.currentPage + 1,
          ),
        );
      },
      [props.currentPage],
    );

    return (
      <ButtonPaginatorWrap themeName="paginator" disabled={!props.show} onClick={handleClick} className="pagination-control">
        <EtsBootstrap.Glyphicon glyph="chevron-right" />
      </ButtonPaginatorWrap>
    );
  },
);

export default connect<StateProps, {}, OwnProps, ReduxState>(
  (state, { registryKey }) => {
    const {
      data: { total_count },
      paginator,
    } = getListData(state.registry, registryKey);

    const { currentPage } = paginator;
    const maxIndex = (Math.ceil(total_count / paginator.perPage) - 1);

    return {
      show: maxIndex !== currentPage,
      currentPage,
    };
  },
)(ButtonNext);
