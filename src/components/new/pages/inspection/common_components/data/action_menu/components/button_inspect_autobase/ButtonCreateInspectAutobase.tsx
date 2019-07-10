import * as React from 'react';
import { ButtonCreateInspectAutobaseProps, ButtonCreateInspectAutobaseStateProps, ButtonCreateInspectAutobaseDispatchProps, ButtonCreateInspectAutobaseOwnProps } from './@types/ButtonCreateInspectAutobase';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import { compose } from 'recompose';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import { INSPECT_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import { BigPaddingButton } from '../../styled/InspectionAutobaseDataActionMenu';
import inspectionActions from 'redux-main/reducers/modules/inspect/inspect_actions';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { getRegistryState } from 'redux-main/reducers/selectors';

const ButtonCreateInspectAutobase: React.FC<ButtonCreateInspectAutobaseProps> = (props) => {
  const {
    loadingPage,
    searchState,
    triggerKey,
  } = props;

  const handleClickCreateInspectAutobase = React.useCallback(
    async () => {
      const triggerKeyValue = getNumberValueFromSerch(searchState[triggerKey]);
      const companyId = getNumberValueFromSerch(searchState.companyId);

      let payload: any = {
        base_id: triggerKeyValue,
      };

      if (props.makePayloadToCreateInspect) {
        payload = props.makePayloadToCreateInspect(searchState);
      }

      try {
        const inspectAutobase = await props.actionCreateInspect(
          payload,
          companyId,
          props.type,
          { page: loadingPage },
        );
        await props.loadRegistryData();

        props.setParams({
          id: inspectAutobase.id,
          type: INSPECT_TYPE_FORM.list,
        });
      } catch (error) {
        await props.loadRegistryData();
      }
    },
    [triggerKey, props.match.url, props.location.search],
  );

  return (
    <BigPaddingButton onClick={handleClickCreateInspectAutobase}>
      Открыть проверку
    </BigPaddingButton>
  );
};

export default compose<ButtonCreateInspectAutobaseProps, ButtonCreateInspectAutobaseOwnProps>(
  connect<ButtonCreateInspectAutobaseStateProps, ButtonCreateInspectAutobaseDispatchProps, ButtonCreateInspectAutobaseOwnProps, ReduxState>(
    (state, { loadingPage }) => ({
      permissions: getListData(getRegistryState(state), loadingPage).permissions.create, //  прокидывается в следующий компонент
    }),
    (dispatch: any) => ({
      actionCreateInspect: (...arg) => (
        dispatch(
          inspectionActions.actionCreateInspect(...arg),
        )
      ),
    }),
  ),
  withRequirePermissionsNew(),
  withSearch,
)(ButtonCreateInspectAutobase);
