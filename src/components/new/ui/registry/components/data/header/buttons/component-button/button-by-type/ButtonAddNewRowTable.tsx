import * as React from 'react';
import { get } from 'lodash';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { defaultCarsConditionCar } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/car_info/utils';
import { registryAddNewRow } from 'components/new/ui/registry/module/actions-registy';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { getRegistryState } from 'redux-main/reducers/selectors';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { etsUseIsPermitted } from 'components/@next/ets_hoc/etsUseIsPermitted';
import inspectCarsConditionPermissions from 'components/new/pages/inspection/cars_condition/_config_data/permissions';
import { canCreateCarInConditionGlobal } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/utils';

type OwnProps = CommonTypesForButton;
type Props = OwnProps & {} & WithSearchProps;

const ButtonAddNewRowTable: React.FC<Props> = React.memo(
  (props) => {
    const dispatch = etsUseDispatch();

    const objectExtra = etsUseSelector((state) => getListData(getRegistryState(state), props.registryKey).data.objectExtra);
    const inspect_data: InspectCarsCondition = get(objectExtra, 'inspect_data');
    const isPermittedToUpdateClose = etsUseIsPermitted(inspectCarsConditionPermissions.update_closed);

    const handleClick = React.useCallback(
      () => {
        dispatch(
          registryAddNewRow(props.registryKey, {defaultRowValue: defaultCarsConditionCar}),
        );
      },
      [props.registryKey],
    );

    const isPermitted = canCreateCarInConditionGlobal(inspect_data, isPermittedToUpdateClose);

    return isPermitted && (
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

export default withSearch<OwnProps>(ButtonAddNewRowTable);
