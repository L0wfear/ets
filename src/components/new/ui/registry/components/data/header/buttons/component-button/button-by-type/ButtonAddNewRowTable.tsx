import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { defaultCarsConditionCar } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/car_info/utils';
import { registryAddNewRow } from 'components/new/ui/registry/module/actions-registy';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { get } from 'lodash';

type Props = CommonTypesForButton
& {} &  WithSearchProps;

const ButtonAddNewRowTable: React.FC<Props> = React.memo(
  (props) => {
    const dispatch = etsUseDispatch();

    const handleClick = React.useCallback(
      () => {
        dispatch(
          registryAddNewRow(props.registryKey, {defaultRowValue: defaultCarsConditionCar}),
        );
      },
      [props.registryKey],
    );

    const showCreateBtn =  get(props, 'searchState.showCreateBtn', null);

    return showCreateBtn && (
      <React.Fragment>
        <EtsBootstrap.Button
          id="add-new-row-btn"
          bsSize="small"
          onClick={handleClick}
        >
          <EtsBootstrap.Glyphicon glyph="plus" />
          Добавить новое ТС
        </EtsBootstrap.Button>
      </React.Fragment>
    );
  },
);

export default withSearch(ButtonAddNewRowTable);
