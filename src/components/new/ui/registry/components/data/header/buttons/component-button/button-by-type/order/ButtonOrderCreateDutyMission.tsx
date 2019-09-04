import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { Order } from 'redux-main/reducers/modules/order/@types';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { isDisabledForCreateDutyMission } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/order/utils';
import { TypeCreateMissionByOrder } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/order/constant_data';
import { etsUseIsPermitted } from 'components/@next/ets_hoc/etsUseIsPermitted';
import dutyMissionPermissions from 'components/new/pages/missions/duty_mission/_config-data/permissions';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';

type OwnProps = CommonTypesForButton & {};
type Props = (
  OwnProps
) & WithSearchProps;

const ButtonOrderCreateDutyMission: React.FC<Props> = React.memo(
  (props) => {
    const selectedRow: Order = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.selectedRow);
    const isPemitted = etsUseIsPermitted(dutyMissionPermissions.create);

    const handleClick = React.useCallback(
      () => {
        props.setParams({
          type: TypeCreateMissionByOrder.duty_mission,
        });
      },
      [props.setParams],
    );

    const isDisabled = isDisabledForCreateDutyMission(selectedRow);

    return React.useMemo(
      () => isPemitted && (
        <EtsBootstrap.Button id="open-create-form" bsSize="small" disabled={isDisabled} onClick={handleClick}>
          Создать наряд-задание по шаблону
        </EtsBootstrap.Button>
      ),
      [
        isPemitted,
        isDisabled,
        handleClick,
      ],
    );
  },
);

export default withSearch<OwnProps>(ButtonOrderCreateDutyMission);
