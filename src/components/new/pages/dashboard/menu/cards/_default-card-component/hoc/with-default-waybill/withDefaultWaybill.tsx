import * as React from 'react';

import withDefaultCard, { PropsToDefaultCard, ConfigType } from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/withDefaultCard';

import { getDashboardState } from 'redux-main/reducers/selectors';
import { WithRequirePermissionAddProps } from 'components/@next/@common/hoc/require_permission/withRequirePermission';
import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

type TypeConfigWithDefaultWaybill = ConfigType & {
  setInfoData: any;
  setInfoDataPropsMake: any;
  ListComponent: any;
};

const withDefaultWaybill = <OwnProps extends PropsToDefaultCard>(config: TypeConfigWithDefaultWaybill) => (Component: React.ComponentType<{}>) => {
  const defaultWaybillCard: React.FC<OwnProps & WithRequirePermissionAddProps> = React.memo(
    (props) => {
      const dispatch = etsUseDispatch();
      const items = etsUseSelector((state) => getDashboardState(state)[config.path].data.items);

      const handleClick = React.useCallback(
        ({ currentTarget: { dataset: { path } } }) => {
          dispatch(
            config.setInfoData(
              config.setInfoDataPropsMake(
                items,
                path,
              ),
            ),
          );
        },
        [props, items],
      );

      return (
        <div>
          <config.ListComponent
            items={items}
            handleClick={handleClick}
          />
          <Component />
        </div>
      );
    },
  );

  return withDefaultCard<OwnProps>({
    path: config.path,
    loadData: config.loadData,
    InfoComponent: config.InfoComponent,
  })(defaultWaybillCard);
};

export default withDefaultWaybill;
