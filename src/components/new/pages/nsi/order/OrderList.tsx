import * as React from 'react';
import { compose } from 'recompose';
import { useDispatch } from 'react-redux';
import { Route } from 'react-router';

import Registry from 'components/new/ui/registry/components/Registry';

import {
  orderRegistryKey,
  getToConfig,
} from 'components/new/pages/nsi/order/_config-data/registry-config';
import { getToConfig as getOrderToConfig } from 'components/new/pages/nsi/order/order_technical_operation/_config-data/registry-config';

import { registryAddInitialData, registryRemoveData, actionChangeGlobalPaylaodInServiceData } from 'components/new/ui/registry/module/actions-registy';

import withPreloader from 'components/old/ui/new/preloader/hoc/with-preloader/withPreloader';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { createValidDateTime, getToday0am, getToday2359 } from 'components/@next/@utils/dates/dates';
import OrderTechnicalOperationList from 'components/new/pages/nsi/order/order_technical_operation/OrderTechnicalOperationList';
import MissionByTemplateFormWrap from 'components/new/pages/nsi/order/form';
import OrderHistoryList from 'components/new/pages/nsi/order/order_history/OrderHistoryList';
import { getSessionState } from 'redux-main/reducers/selectors';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

export type Props = (
  {}
) & WithSearchProps;

const uniqFieldParams = getOrderToConfig(null, null).list.data.uniqKeyForParams;

const OrderList: React.FC<Props> = (props) => {
  const configDateStart = etsUseSelector((state) => getSessionState(state).appConfig.shift.shift_start);
  const configDateEnd = etsUseSelector((state) => getSessionState(state).appConfig.shift.shift_end);

  const date_start: string = props.searchState.date_from;
  const date_end: string = props.searchState.date_to;

  const dispatch = useDispatch();

  React.useEffect(
    () => {
      dispatch(
        registryAddInitialData(
          getToConfig(
            date_start || createValidDateTime(getToday0am()),
            date_end || createValidDateTime(getToday2359()),
          ),
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

  React.useEffect(
    () => {
      if (!date_start || !date_end) {
        props.setDataInSearch({
          date_from: createValidDateTime(date_start || configDateStart),
          date_to: createValidDateTime(date_end || configDateEnd),
        });
      }
    },
    [date_start, date_end],
  );

  return React.useMemo(
    () => (
      <>
        <Registry registryKey={orderRegistryKey} />
        <MissionByTemplateFormWrap registryKey={orderRegistryKey} />
        <Route path={`${props.match.path}/:${uniqFieldParams}?/:type_to?`} component={OrderTechnicalOperationList} />
        <OrderHistoryList />
      </>
    ),
    [
      props.match,
    ],
  );
};

export default compose<Props, {}>(
  withPreloader({
    page: orderRegistryKey,
    typePreloader: 'mainpage',
  }),
  withSearch,
)(OrderList);
