import * as React from 'react';
import { get } from 'lodash';

import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { orderRegistryKey } from 'components/new/pages/nsi/order/_config-data/registry-config';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { Order } from 'redux-main/reducers/modules/order/@types';
import { typeTemplate } from 'components/old/directories/order/forms/utils/constant';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import OrderMissionTemplateList from 'components/old/directories/order/forms/OrderMissionTemplate/OrderMissionTemplateList';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { TypeCreateMissionByOrder } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/order/constant_data';

type OwnProps = {};
type Props = OwnProps & WithSearchProps;

const MissionByTemplateFormWrap: React.FC<Props> = React.memo(
  (props) => {
    const selectedRow: Order = etsUseSelector((state) => getListData(state.registry, orderRegistryKey).data.selectedRow);
    const order_mission_source_id = etsUseSelector((state) => getSomeUniqState(state).missionSource.order_mission_source_id);
    const type = props.match.params.type;

    const technical_operations = React.useMemo(
      () => {
        return get(selectedRow, 'technical_operations') || [];
      },
      [selectedRow],
    );

    const orderDates = React.useMemo(
      () => {
        return {
          order_date: get(selectedRow, 'order_date'),
          order_date_to: get(selectedRow, 'order_date_to'),
          faxogramm_id: get(selectedRow, 'id'),
          status: get(selectedRow, 'status'),
        };
      },
      [selectedRow],
    );

    const handleHide = React.useCallback(
      () => {
        props.setParams({
          type: null,
        });
      },
      [props.setParams],
    );

    return Boolean(orderDates.faxogramm_id && (type === TypeCreateMissionByOrder.mission || type === TypeCreateMissionByOrder.duty_mission)) && (
      <OrderMissionTemplateList
        showForm
        onFormHide={handleHide}
        technical_operations={technical_operations}
        orderDates={orderDates}
        typeClick={type === TypeCreateMissionByOrder.mission ? typeTemplate.missionTemplate : typeTemplate.missionDutyTemplate}
        mission_source_id={order_mission_source_id}
      />
    );
  },
);

export default withSearch<OwnProps>(MissionByTemplateFormWrap);
