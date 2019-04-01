import * as React from 'react';
import { ButtonCreateInspectAutobaseProps, ButtonCreateInspectAutobaseStateProps, ButtonCreateInspectAutobaseDispatchProps, ButtonCreateInspectAutobaseOwnProps } from './@types/ButtonCreateInspectAutobase';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import { compose } from 'recompose';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import { INSPECT_AUTOBASE_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';
import inspectAutobasePermissions from 'components/new/pages/inspection/autobase/_config_data/permissions';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import inspectionAutobaseActions from 'redux-main/reducers/modules/inspect/autobase/inspect_autobase_actions';
import { BigPaddingButton } from '../../styled/InspectionAutobaseDataActionMenu';

const ButtonCreateInspectAutobase: React.FC<ButtonCreateInspectAutobaseProps> = (props) => {
  const {
    loadingPage,
    searchState,
  } = props;

  const handleClickCreateInspectAutobase = React.useCallback(
    async () => {
      const carpoolId = getNumberValueFromSerch(searchState.carpoolId);
      const companyId = getNumberValueFromSerch(searchState.companyId);
      try {
        const inspectAutobase = await props.actionCreateInspectAutobase(
          {
            carpoolId,
            companyId,
          },
          { page: loadingPage },
        );
        await props.loadRegistryData();

        props.setParams({
          id: inspectAutobase.id,
          type: INSPECT_AUTOBASE_TYPE_FORM.list,
        });
      } catch (error) {
        await props.loadRegistryData();
      }
    },
    [props.match.url, props.location.search],
  );

  return (
    <BigPaddingButton onClick={handleClickCreateInspectAutobase}>
      Открыть проверку и перейти к заполнению карточки
    </BigPaddingButton>
  );
};

export default compose<ButtonCreateInspectAutobaseProps, ButtonCreateInspectAutobaseOwnProps>(
  withRequirePermissionsNew({
    permissions: inspectAutobasePermissions.create,
  }),
  connect<ButtonCreateInspectAutobaseStateProps, ButtonCreateInspectAutobaseDispatchProps, ButtonCreateInspectAutobaseOwnProps, ReduxState>(
    null,
    (dispatch: any) => ({
      actionCreateInspectAutobase: (...arg) => (
        dispatch(
          inspectionAutobaseActions.actionCreateInspectAutobase(...arg),
        )
      ),
    }),
    null,
    {
      pure: false,
    },
  ),
  withSearch,
)(ButtonCreateInspectAutobase);
