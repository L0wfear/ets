import * as React from 'react';

import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import Registry from 'components/new/ui/registry/components/Registry';
import { Order } from 'redux-main/reducers/modules/order/@types';
import { orderTechnicaOperationRegistryKey, getToConfig } from 'components/new/pages/nsi/order/order_technical_operation/_config-data/registry-config';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';
import { orderRegistryKey } from 'components/new/pages/nsi/order/_config-data/registry-config';
import OrderMissionFormWrap from 'components/new/pages/nsi/order/order_technical_operation/form';

type OwnProps = {};
type Props = OwnProps & {
} & WithSearchProps;

const OrderTechnicalOperationList: React.FC<Props> = React.memo(
  (props) => {
    const selectedRow: Order = etsUseSelector((state) => getListData(state.registry, orderRegistryKey).data.selectedRow);
    const dispatch = etsUseDispatch();

    React.useEffect(
      () => {
        if (selectedRow) {
          dispatch(
            registryAddInitialData(
              getToConfig(
                selectedRow.technical_operations,
                selectedRow.instruction,
              ),
            ),
          );
        }
        return () => {
          dispatch(
            registryRemoveData(orderTechnicaOperationRegistryKey),
          );
        };
      },
      [selectedRow],
    );

    return Boolean(selectedRow) && (
      <React.Fragment>
        <Registry registryKey={orderTechnicaOperationRegistryKey} />
        <OrderMissionFormWrap registryKey={orderTechnicaOperationRegistryKey} />
      </React.Fragment>
    );
  },
);

export default withSearch<OwnProps>(OrderTechnicalOperationList);
