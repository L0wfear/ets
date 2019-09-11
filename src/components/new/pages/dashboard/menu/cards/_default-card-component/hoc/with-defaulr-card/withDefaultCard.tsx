import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { withRequirePermission, WithRequirePermissionProps, WithRequirePermissionAddProps } from 'components/@next/@common/hoc/require_permission/withRequirePermission';

import {
  CardTitleContainer,
  CardTitleContainerWrap,
  CardBodyContainer,
} from 'components/new/pages/dashboard/menu/cards/_default-card-component/hoc/with-defaulr-card/styled/styled';
import { getDashboardState } from 'redux-main/reducers/selectors';
import { etsUseSelector, etsUseDispatch, EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { InitialStateDashboard } from 'components/new/pages/dashboard/redux-main/modules/dashboard/@types/_dashboard.h';
import usePrevious from 'components/new/utils/hooks/usePrevious';

export type ConfigType = {
  path: keyof InitialStateDashboard;
  loadData: () => EtsAction<Promise<any>>;
  InfoComponent?: React.ComponentType<any>;
};

export type PropsToDefaultCard = {
  timeInterval?: number;
  timeDelay: number;
  page?: string;
} & WithRequirePermissionProps;

const withDefaultCard = <OwnProps extends PropsToDefaultCard>(config: ConfigType) => (Component: React.ComponentType<OwnProps & WithRequirePermissionAddProps>) => {
  const defaultCard: React.FC<OwnProps & WithRequirePermissionAddProps> = React.memo(
    (props) => {
      const [hasFirstLoad, setHasFirstLoad] = React.useState(false);

      const isLoading = etsUseSelector((state) => getDashboardState(state)[config.path].isLoading);
      const title = etsUseSelector((state) => getDashboardState(state)[config.path].data.title);
      const dateLoad = etsUseSelector((state) => getDashboardState(state)[config.path].dateLoad);

      const dispatch = etsUseDispatch();

      const loadData = React.useCallback(
        async () => {
          dispatch(
            config.loadData(),
          );
        },
        [],
      );

      React.useEffect(
        () => {
          const timer_id = setTimeout(
            async () => {
              await loadData();
              setHasFirstLoad(true);
            },
            props.timeDelay * 100 || 0,
          );

          return () => clearTimeout(timer_id);
        },
        [],
      );

      const dateLoadPrev = usePrevious(dateLoad);

      React.useEffect(
        () => {
          let timer_id = null;
          if (hasFirstLoad && !isLoading && dateLoadPrev !== dateLoad) {
            timer_id = setInterval(
              async () => {
                loadData();
              },
              60 * 1000,
            );
          }

          return () => clearInterval(timer_id);
        },
        [hasFirstLoad, isLoading, dateLoad, dateLoadPrev],
      );

      return (
        <EtsBootstrap.DashboardCard>
          <div>
            <CardTitleContainer>
              <CardTitleContainerWrap>
                <div>{title}</div>
                <div className="button_refresh">
                  <EtsBootstrap.Button onClick={loadData} disabled={isLoading}>
                    <EtsBootstrap.Glyphicon
                      isLoading={isLoading}
                      glyph="refresh"
                    />
                  </EtsBootstrap.Button>
                </div>
              </CardTitleContainerWrap>
            </CardTitleContainer>
            <CardBodyContainer isLoading={isLoading}>
              <Component {...props} />
            </CardBodyContainer>
          </div>
          <div>
            {
              Boolean(config.InfoComponent) && (
                <config.InfoComponent />
              )
            }
          </div>

        </EtsBootstrap.DashboardCard>
      );
    },
  );

  return withRequirePermission<OwnProps>({
    permissions: `dashboard.${config.path}`,
  })(defaultCard);
};

export default withDefaultCard;
