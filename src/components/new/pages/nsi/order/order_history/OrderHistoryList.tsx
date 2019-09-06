import * as React from 'react';
import { get } from 'lodash';

import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import Registry from 'components/new/ui/registry/components/Registry';
import { Order } from 'redux-main/reducers/modules/order/@types';
import { orderHistroyRegistryKey, getToConfig } from 'components/new/pages/nsi/order/order_history/_config-data/registry-config';
import { registryAddInitialData, registryRemoveData } from 'components/new/ui/registry/module/actions-registy';
import { orderRegistryKey, getToConfig as orderGetToConfig } from 'components/new/pages/nsi/order/_config-data/registry-config';
import { actionLoadOrderHistory } from 'redux-main/reducers/modules/order/action-order';
import { getFormattedDateTime } from 'components/@next/@utils/dates/dates';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import { EtsHeaderTitle } from 'components/new/ui/registry/components/data/header/title/styled/styled';
import { EtsHeaderContainerWrap } from 'components/new/ui/registry/components/data/header/styled/styled';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import { FlexContainer, Flex } from 'global-styled/global-styled';
import ErrorsBlock from 'components/@next/@ui/renderFields/ErrorsBlock/ErrorsBlock';

type OwnProps = {};
type Props = OwnProps & WithSearchProps;

const defaultState = { list: null, currentIndex: 1, isOpen: false };

const OrderHistoryList: React.FC<Props> = React.memo(
  (props) => {
    const [orderHistroyData, setOrderHistoryData] = React.useState<{ list: Order[], currentIndex: number, isOpen: boolean }>(defaultState);
    const order_id = getNumberValueFromSerch(props.match.params[orderGetToConfig(null, null).list.data.uniqKeyForParams]);
    const dispatch = etsUseDispatch();

    const selectedOrderHistroyTo: Order = React.useMemo(
      () => {
        return get(orderHistroyData.list, `${orderHistroyData.currentIndex - 1}`);
      },
      [orderHistroyData.currentIndex, orderHistroyData.list],
    );

    React.useEffect(
      () => {
        if (selectedOrderHistroyTo) {
          dispatch(
            registryAddInitialData(
              getToConfig(
                selectedOrderHistroyTo.technical_operations,
                selectedOrderHistroyTo.order_info,
              ),
            ),
          );
        }
        return () => {
          dispatch(
            registryRemoveData(orderHistroyRegistryKey),
          );
        };
      },
      [selectedOrderHistroyTo],
    );

    React.useEffect(
      () => {
        const loadData = async () => {
          if (order_id) {
            const result = await dispatch(
              actionLoadOrderHistory(
                order_id,
                {
                  page: orderRegistryKey,
                },
              ),
            );

            setOrderHistoryData(
              (oldState) => ({
                ...oldState,
                list: result,
                currentIndex: 1,
                isOpen: false,
              }),
            );
          } else {
            setOrderHistoryData(defaultState);
          }
        };

        loadData();
      },
      [order_id],
    );

    const VERSION_OPTIONS = React.useMemo(
      () => {
        if (orderHistroyData.list) {
          return orderHistroyData.list.map((d, i) => ({
            value: i + 1,
            label: `Версия ${getFormattedDateTime(d.synced_timestamp)}`,
          }));
        }

        return [];
      },
      [orderHistroyData],
    );

    const toggleHistoryTable = React.useCallback(
      () => {
        setOrderHistoryData(
          (oldState) => ({
            ...oldState,
            isOpen: !oldState.isOpen,
          }),
        );
      },
      [],
    );

    const handleChangeVersion = React.useCallback(
      (index) => {
        setOrderHistoryData(
          (oldState) => ({
            ...oldState,
            currentIndex: index,
          }),
        );
      },
      [],
    );

    return Boolean(order_id && orderHistroyData.list) && (
      <React.Fragment>
        <EtsBootstrap.Panel>
          <EtsBootstrap.Col md={12} onClick={toggleHistoryTable}>
            <EtsBootstrap.Row>
              <EtsHeaderContainerWrap className="pointer">
                <EtsHeaderTitle>
                  <span>Версионность централизованного задания</span>
                  <EtsBootstrap.Glyphicon
                    glyph={orderHistroyData.isOpen ? 'menu-up' : 'menu-down'}
                  />
                </EtsHeaderTitle>
              </EtsHeaderContainerWrap>
            </EtsBootstrap.Row>
          </EtsBootstrap.Col>
          {
            orderHistroyData.isOpen && (
              <React.Fragment>
                <EtsBootstrap.Col md={12}>
                  <FlexContainer>
                    <div>Версия централизованного задания</div>
                    <div>&nbsp;</div>
                    <Flex basis={300}>
                      <ExtField
                        type="select"
                        label={false}
                        error={false}
                        options={VERSION_OPTIONS}
                        value={orderHistroyData.currentIndex}
                        clearable={false}
                        onChange={handleChangeVersion}
                        disabled={!selectedOrderHistroyTo}
                      />
                    </Flex>
                  </FlexContainer>
                </EtsBootstrap.Col>
                <EtsBootstrap.Col md={12}>
                  <EtsBootstrap.Row>
                    {
                      Boolean(selectedOrderHistroyTo) && (
                        <Registry registryKey={orderHistroyRegistryKey} />
                      )
                    }
                    <EtsBootstrap.Col md={12}>
                      <ErrorsBlock
                        showError={!selectedOrderHistroyTo}
                        hidden={false}
                        error="Для выбранного централизованного задания предыдущих версий"
                      />
                    </EtsBootstrap.Col>
                  </EtsBootstrap.Row>
                </EtsBootstrap.Col>
              </React.Fragment>
            )
          }
        </EtsBootstrap.Panel>
      </React.Fragment>
    );
  },
);

export default withSearch<OwnProps>(OrderHistoryList);
