import * as React from 'react';
import { Route } from 'react-router';

import Registry from 'components/new/ui/registry/components/Registry';

import {
  orderRegistryKey,
  getToConfig,
} from 'components/new/pages/nsi/order/_config-data/registry-config';
import { getToConfig as getOrderToConfig } from 'components/new/pages/nsi/order/order_technical_operation/_config-data/registry-config';

import { registryAddInitialData, registryRemoveData, actionChangeGlobalPaylaodInServiceData } from 'components/new/ui/registry/module/actions-registy';

import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { createValidDateTime, getToday0am, getToday2359 } from 'components/@next/@utils/dates/dates';
import OrderTechnicalOperationList from 'components/new/pages/nsi/order/order_technical_operation/OrderTechnicalOperationList';
import MissionByTemplateFormWrap from 'components/new/pages/nsi/order/form';
import OrderHistoryList from 'components/new/pages/nsi/order/order_history/OrderHistoryList';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

type OwnProps = {};
type Props = (
  OwnProps
) & WithSearchProps;

const uniqFieldParams = getOrderToConfig(null, null).list.data.uniqKeyForParams;

const OrderList: React.FC<Props> = React.memo(
  (props) => {

    const date_start: string = props.searchState.date_from;
    const date_end: string = props.searchState.date_to;

    const dispatch = etsUseDispatch();

    React.useEffect(
      () => {
        dispatch(
          registryAddInitialData(
            getToConfig(),
          ),
        );
        return () => {
          dispatch(
            registryRemoveData(orderRegistryKey),
          );
        };
      },
      [],
    );

    React.useEffect(
      () => {
        if (!date_start || !date_end) {
          props.setDataInSearch({
            date_from: date_start || createValidDateTime(getToday0am()),
            date_to:date_end || createValidDateTime(getToday2359()),
          });
        }
      },
      [],
    );

    React.useEffect(
      () => {
        if (date_start && date_end) {
          const payload = {
            getRegistryData: {
              date_start,
              date_end,
            },
          };

          dispatch(
            actionChangeGlobalPaylaodInServiceData(orderRegistryKey, payload),
          );
        }

      },
      [date_start, date_end],
    );

    return (
      <Registry registryKey={orderRegistryKey}>
        <MissionByTemplateFormWrap />
        <Route path={`${props.match.path}/:${uniqFieldParams}?/:type_to?`} component={OrderTechnicalOperationList} />
        <OrderHistoryList />
      </Registry>
    );
  },
);

export default withSearch<OwnProps>(OrderList);
