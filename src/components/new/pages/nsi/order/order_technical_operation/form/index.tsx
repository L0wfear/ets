import * as React from 'react';
import { get } from 'lodash';

import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { orderRegistryKey } from 'components/new/pages/nsi/order/_config-data/registry-config';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { Order } from 'redux-main/reducers/modules/order/@types';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { TypeCreateMissionByOrderTo, TypeCreateMissionByOrder } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/order/constant_data';
import DutyMissionFormLazy from 'components/new/pages/missions/duty_mission/form/main';
import MissionFormLazy from 'components/new/pages/missions/mission/form/main';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';

type OwnProps = {
  registryKey: string;
};
type Props = OwnProps & WithSearchProps;

const MissionFormWrap: React.FC<Props> = React.memo(
  (props) => {
    const array = etsUseSelector((state) => getListData(state.registry, orderRegistryKey).data.array);
    const order_mission_source_id = etsUseSelector((state) => getSomeUniqState(state).missionSource.order_mission_source_id);
    const order_id = getNumberValueFromSerch(props.match.params.order_id);
    const order_operation_id = getNumberValueFromSerch(props.match.params.order_operation_id);
    const type = props.match.params.type;
    const type_to = props.match.params.type_to;

    const selectedOrderRow = React.useMemo(
      (): Order => {
        if (order_id) {
          return array.find(({ id }) => id === order_id);
        }

        return null;
      },
      [array, order_id],
    );
    const selectedOrderTORow = React.useMemo(
      (): ValuesOf<Order['technical_operations']> => {
        return (get(selectedOrderRow, 'technical_operations') || []).find((toData) => toData.order_operation_id === order_operation_id);
      },
      [selectedOrderRow, order_operation_id],
    );

    const handleHide = React.useCallback(
      () => {
        props.setParams({
          type: null,
        });
      },
      [props.setParams],
    );

    const partialMission = React.useMemo(
      (): Partial<Mission> => {
        return {
          faxogramm_id: get(selectedOrderRow, 'id'),
          order_id: get(selectedOrderRow, 'id'),
          norm_id: get(selectedOrderTORow, 'norm_id'),
          norm_ids: [get(selectedOrderTORow, 'norm_id')],
          date_start: get(selectedOrderTORow, 'date_from') || get(selectedOrderRow, 'order_date'),
          date_end: get(selectedOrderTORow, 'date_to') || get(selectedOrderRow, 'order_date_to'),
          technical_operation_id: get(selectedOrderTORow, 'id'),
          technical_operation_name: get(selectedOrderTORow, 'tk_operation_name'),
          municipal_facility_id: get(selectedOrderTORow, 'municipal_facility_id'),
          municipal_facility_name: get(selectedOrderTORow, 'elem'),
          order_operation_id: get(selectedOrderTORow, 'order_operation_id'),
          order_number: get(selectedOrderRow, 'order_number'),
          order_status: get(selectedOrderRow, 'status'),
          mission_source_id: order_mission_source_id,

        };
      },
      [selectedOrderRow, selectedOrderTORow, order_mission_source_id],
    );

    const partialDutyMission = React.useMemo(
      (): Partial<DutyMission> => {
        return {
          faxogramm_id: get(selectedOrderRow, 'id'),
          norm_id: get(selectedOrderTORow, 'norm_id'),
          plan_date_start: get(selectedOrderTORow, 'date_from') || get(selectedOrderRow, 'order_date'),
          plan_date_end: get(selectedOrderTORow, 'date_to') || get(selectedOrderRow, 'order_date_to'),
          technical_operation_id: get(selectedOrderTORow, 'id'),
          technical_operation_name: get(selectedOrderTORow, 'tk_operation_name'),
          municipal_facility_id: get(selectedOrderTORow, 'municipal_facility_id'),
          municipal_facility_name: get(selectedOrderTORow, 'elem'),
          order_operation_id: get(selectedOrderTORow, 'order_operation_id'),
          order_number: get(selectedOrderRow, 'order_number'),
          order_status: get(selectedOrderRow, 'status'),
          mission_source_id: order_mission_source_id,
        };
      },
      [selectedOrderRow, selectedOrderTORow, order_mission_source_id],
    );

    return Boolean(selectedOrderRow && selectedOrderTORow) && (type === TypeCreateMissionByOrder.by_to) && (
      <React.Fragment>
        {
          type_to === TypeCreateMissionByOrderTo.mission && (
            <MissionFormLazy
              showForm
              handleHide={handleHide}
              element={partialMission}

              type={null}

              registryKey="mainpage"
              page="order"
              path="mission"
            />
          )
        }
        { type_to === TypeCreateMissionByOrderTo.duty_mission &&
          (
            <DutyMissionFormLazy
              showForm
              handleHide={handleHide}
              element={partialDutyMission}
              type={null}
              registryKey="duty_mission"
              page="duty_mission"
              path="duty_mission_form"
            />
          )
        }
      </React.Fragment>
    );
  },
);

export default withSearch<OwnProps>(MissionFormWrap);
