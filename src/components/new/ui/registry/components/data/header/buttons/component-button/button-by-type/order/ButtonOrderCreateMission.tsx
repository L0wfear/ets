import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { Order } from 'redux-main/reducers/modules/order/@types';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { isDisabledForCreateMission } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/order/utils';
import { TypeCreateMissionByOrder } from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/order/constant_data';
import { etsUseIsPermitted } from 'components/@next/ets_hoc/etsUseIsPermitted';
import missionPermissions from 'components/new/pages/missions/mission/_config-data/permissions';

type OwnProps = {
  registryKey: string;
};
type Props = (
  OwnProps
) & WithSearchProps;

const ButtonOrderCreateMission: React.FC<Props> = React.memo(
  (props) => {
    const selectedRow: Order = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.selectedRow);
    const isPemitted = etsUseIsPermitted(missionPermissions.create);

    const handleClick = React.useCallback(
      () => {
        props.setParams({
          type: TypeCreateMissionByOrder.mission,
        });
      },
      [props.setParams],
    );

    const isDisabled = isDisabledForCreateMission(selectedRow);

    return React.useMemo(
      () => (
        isPemitted && (
          <EtsBootstrap.Button id="open-create-form" bsSize="small" disabled={isDisabled} onClick={handleClick}>
            Создать задание по шаблону
          </EtsBootstrap.Button>
        )
      ),
      [
        isDisabled,
        handleClick,
        isPemitted,
      ],
    );
  },
);

export default withSearch(ButtonOrderCreateMission);
