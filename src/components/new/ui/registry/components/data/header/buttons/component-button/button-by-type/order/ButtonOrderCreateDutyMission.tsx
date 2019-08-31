import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { Order } from 'redux-main/reducers/modules/order/@types';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { isDisabledForCreateDutyMission } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/order/utils';
import { TypeCreateMissionByOrder } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/order/constant_data';
import { etsIsPermitted } from 'components/@next/ets_hoc/etsIsPermitted';
import dutyMissionPermissions from 'components/new/pages/missions/duty_mission/_config-data/permissions';

type OwnProps = {
  registryKey: string;
};
type Props = (
  OwnProps
) & WithSearchProps;

const ButtonOrderCreateDutyMission: React.FC<Props> = React.memo(
  (props) => {
    const selectedRow: Order = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.selectedRow);
    const isPemitted = etsIsPermitted(dutyMissionPermissions.create);

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

export default withSearch(ButtonOrderCreateDutyMission);
