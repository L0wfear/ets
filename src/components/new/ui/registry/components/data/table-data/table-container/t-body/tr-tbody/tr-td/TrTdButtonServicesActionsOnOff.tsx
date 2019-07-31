import * as React from 'react';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { EtsTbodyTrTd, ButtonGreenActive, ButtonRedActive } from 'components/new/ui/registry/components/data/table-data/table-container/t-body/tr-tbody/tr-td/styled/styled';
import { ReduxState } from 'redux-main/@types/state';
import { registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import withRequirePermissionsNew from 'components/old/util/RequirePermissionsNewRedux';
import { compose } from 'recompose';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { Service } from 'redux-main/reducers/modules/services/@types/services';
import { ButtonGroupWrapperMargin } from 'global-styled/global-styled';
import { actionChangeServiceActiveStatus } from 'redux-main/reducers/modules/services/services_actions';

type TrTdButtonServicesActionsOnOffStateProps = {
  permissions: string | boolean;
};
type TrTdButtonServicesActionsOnOffDispatchProps = {
  registryLoadDataByKey: HandleThunkActionCreator<typeof registryLoadDataByKey>;
  actionChangeServiceActiveStatus: HandleThunkActionCreator<typeof actionChangeServiceActiveStatus>;
};
type TrTdButtonServicesActionsOnOffOwnProps = {
  registryKey: string;
  rowData: Service;
};
type TrTdButtonServicesActionsOnOffMergedProps = (
  TrTdButtonServicesActionsOnOffStateProps
  & TrTdButtonServicesActionsOnOffDispatchProps
  & TrTdButtonServicesActionsOnOffOwnProps
) & WithSearchProps & {
  isPermitted: boolean;
};

type TrTdButtonServicesActionsOnOffProps = TrTdButtonServicesActionsOnOffMergedProps;

const TrTdButtonServicesActionsOnOff: React.FC<TrTdButtonServicesActionsOnOffProps> = React.memo(
  (props) => {
    const { rowData } = props;

    const handleClickOn = React.useCallback(
      async () => {
        if (!props.rowData.is_active && props.isPermitted) {
          try {
            await props.actionChangeServiceActiveStatus(
              props.rowData.slug,
              true,
              {
                page: props.registryKey,
              },
            );
          } catch (error) {
            console.error('error'); // tslint:disable-line
          }

          props.registryLoadDataByKey(props.registryKey);
        }
      },
      [rowData, props.isPermitted],
    );
    const handleClickOff = React.useCallback(
      async () => {
        if (props.rowData.is_active && props.isPermitted) {
          try {
            await props.actionChangeServiceActiveStatus(
              props.rowData.slug,
              false,
              {
                page: props.registryKey,
              },
            );
          } catch (error) {
            console.error('error'); // tslint:disable-line
          }
          props.registryLoadDataByKey(props.registryKey);
        }
      },
      [rowData, props.isPermitted],
    );

    return (
      <EtsTbodyTrTd>
        <ButtonGroupWrapperMargin>
          <ButtonGreenActive active={props.rowData.is_active} onClick={handleClickOn}>Вкл</ButtonGreenActive>
          <ButtonRedActive active={!props.rowData.is_active} onClick={handleClickOff}>Выкл</ButtonRedActive>
        </ButtonGroupWrapperMargin>
      </EtsTbodyTrTd>
    );
  },
);

export default compose<TrTdButtonServicesActionsOnOffProps, TrTdButtonServicesActionsOnOffOwnProps>(
  connect<TrTdButtonServicesActionsOnOffStateProps, TrTdButtonServicesActionsOnOffDispatchProps, TrTdButtonServicesActionsOnOffOwnProps, ReduxState>(
    (state, { registryKey }) => ({
      permissions: getListData(state.registry, registryKey).permissions.update, //  прокидывается в следующий компонент
    }),
    (dispatch: any) => ({
      registryLoadDataByKey: (...arg) => (
        dispatch(
          registryLoadDataByKey(...arg),
        )
      ),
      actionChangeServiceActiveStatus: (...arg) => (
        dispatch(
          actionChangeServiceActiveStatus(...arg),
        )
      ),
    }),
  ),
  withRequirePermissionsNew({
    withIsPermittedProps: true,
  }),
)(TrTdButtonServicesActionsOnOff);
