import * as React from 'react';
import { get } from 'lodash';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { Order } from 'redux-main/reducers/modules/order/@types';
import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { isDisabledForCreateMissionByTO } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/order/utils';
import { orderRegistryKey } from 'components/new/pages/nsi/order/_config-data/registry-config';
import { TypeCreateMissionByOrderTo, TypeCreateMissionByOrder } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/order/constant_data';
import missionActions from 'redux-main/reducers/modules/missions/mission/actions';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import { etsUseIsPermitted } from 'components/@next/ets_hoc/etsUseIsPermitted';
import missionPermissions from 'components/new/pages/missions/mission/_config-data/permissions';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';

type OwnProps = CommonTypesForButton & {};
type Props = (
  OwnProps
) & WithSearchProps;

const ButtonOrderToCreateMission: React.FC<Props> = React.memo(
  (props) => {
    const selectedOrderTORow: ValuesOf<Order['technical_operations']> = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.selectedRow);

    const array = etsUseSelector((state) => getListData(state.registry, orderRegistryKey).data.array);
    const order_id = getNumberValueFromSerch(props.match.params.order_id);
    const order_operation_id = getNumberValueFromSerch(props.match.params.order_operation_id);
    const isPemitted = etsUseIsPermitted(missionPermissions.create);

    const selectedOrderRow = React.useMemo(
      (): Order => {
        if (order_id) {
          return array.find((rowData) => rowData.id === order_id);
        }

        return null;
      },
      [array, order_id],
    );
    const selectedOrderTORowBYParams = React.useMemo(
      (): ValuesOf<Order['technical_operations']> => {
        return (get(selectedOrderRow, 'technical_operations') || []).find((toData) => toData.order_operation_id === order_operation_id);
      },
      [selectedOrderRow, order_operation_id],
    );
    const dispatch = etsUseDispatch();
    const uniqKeyForParams = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.uniqKeyForParams);
    const uniqKey = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.uniqKey);

    const id = get(selectedOrderTORow, uniqKey);

    const handleClick = React.useCallback(
      () => {
        props.setParams({
          type: TypeCreateMissionByOrder.by_to,
          [uniqKeyForParams]: selectedOrderTORow[uniqKey],
          type_to: TypeCreateMissionByOrderTo.mission,
        });
      },
      [
        uniqKeyForParams,
        id,
        props.setParams,
      ],
    );

    React.useEffect(
      () => {
        dispatch(
          missionActions.actionSetDependenceOrderDataForMission(
            selectedOrderRow,
            selectedOrderTORowBYParams,
          ),
        );
      },
      [selectedOrderRow, selectedOrderTORowBYParams],
    );

    const isDisabled = isDisabledForCreateMissionByTO(selectedOrderRow, selectedOrderTORow);

    return isPemitted && (
      <EtsBootstrap.Button id="open-create-form" bsSize="small" disabled={isDisabled} onClick={handleClick}>
        Создать задание
      </EtsBootstrap.Button>
    );
  },
);

export default withSearch<OwnProps>(ButtonOrderToCreateMission);
