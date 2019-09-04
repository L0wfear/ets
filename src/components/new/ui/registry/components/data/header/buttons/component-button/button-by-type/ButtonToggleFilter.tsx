import * as React from 'react';

import {
  getListData,
} from 'components/new/ui/registry/module/selectors-registry';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import { registryToggleIsOpenFilter } from 'components/new/ui/registry/module/actions-registy';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';
import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

type Props = CommonTypesForButton & {};

const ButtonToggleFilter: React.FC<Props> = React.memo(
  (props) => {
    const { data } = props;

    const dispatch = etsUseDispatch();
    const hasFilters = etsUseSelector((state) => (
      Boolean(
        Object.values(
          getListData(state.registry, props.registryKey).processed.filterValues,
        ).length,
      )
    ));
    const handleClick = React.useMemo(
      () => (
        dispatch(
          registryToggleIsOpenFilter(props.registryKey),
        )
      ),
      [props.registryKey],
    );
    const glyph = React.useMemo(
      () => (
        data && data.glyph
      ),
      [props.data],
    );

    return React.useMemo(
      () => (
        <EtsBootstrap.Button
          id="show-options-filter"
          bsSize="small"
          active={hasFilters}
          onClick={handleClick}
        >
          <EtsBootstrap.Glyphicon glyph={glyph || 'filter'} />
        </EtsBootstrap.Button>
      ),
      [
        hasFilters,
        handleClick,
        glyph,
      ],
    );
  },
);

export default ButtonToggleFilter;
