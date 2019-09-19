import * as React from 'react';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';

import {
  registryChangeDataPaginatorCurrentPage,
} from 'components/new/ui/registry/module/actions-registy';
import { ButtonPaginatorWrap } from './styled';
import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

type PropsButtonFirst = {
  registryKey: string;
};

const ButtonFirst: React.FC<PropsButtonFirst> = React.memo(
  (props) => {
    const active = etsUseSelector((state) => getListData(state.registry, props.registryKey).paginator.currentPage === 0);
    const dispatch = etsUseDispatch();
    const handleClick = React.useCallback(
      () => {
        dispatch(
          registryChangeDataPaginatorCurrentPage(
            props.registryKey,
            0,
          ),
        );
      },
      [],
    );
    return (
      <ButtonPaginatorWrap
        themeName="paginator"
        disabled={active}
        onClick={handleClick}
      >
        Первая
      </ButtonPaginatorWrap>
    );
  },
);

export default ButtonFirst;
