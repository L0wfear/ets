import * as React from 'react';
import { BigPaddingButton } from 'components/new/pages/inspection/pgm_base/components/data/components/action_menu/styled/InspectionPgmBaseDataActionMenu';
import { ButtonCreateInspectPgmBaseProps, ButtonCreateInspectPgmBaseStateProps, ButtonCreateInspectPgmBaseDispatchProps, ButtonCreateInspectPgmBaseOwnProps } from './@types/ButtonCreateInspectPgmBase';
import { connect } from 'react-redux';
import inspectionActions from 'redux-main/reducers/modules/inspect/inspect_actions';
import { ReduxState } from 'redux-main/@types/state';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import { compose } from 'recompose';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import { INSPECT_PGM_BASE_TYPE_FORM } from 'components/new/pages/inspection/pgm_base/global_constants';
import inspectPgmBasePermissions from 'components/new/pages/inspection/pgm_base/_config_data/permissions';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

const ButtonCreateInspectPgmBase: React.FC<ButtonCreateInspectPgmBaseProps> = (props) => {
  const {
    loadingPage,
    searchState,
  } = props;

  const handleClickCreateInspectPgmBase = React.useCallback(
    async () => {
      const pgmBaseId = getNumberValueFromSerch(searchState.pgmBaseId);
      const companyId = getNumberValueFromSerch(searchState.companyId);

      const inspectPgmBase = await props.actionCreateInspectPgmBase(
        {
          pgmBaseId,
          companyId,
        },
        { page: loadingPage },
      );

      props.setParams({
        id: inspectPgmBase.id,
        type: INSPECT_PGM_BASE_TYPE_FORM.list,
      });
    },
    [props.match.url, props.location.search],
  );

  return (
    <BigPaddingButton onClick={handleClickCreateInspectPgmBase}>
      Открыть проверку и перейти к заполнению карточки
    </BigPaddingButton>
  );
};

export default compose<ButtonCreateInspectPgmBaseProps, ButtonCreateInspectPgmBaseOwnProps>(
  withRequirePermissionsNew({
    permissions: inspectPgmBasePermissions.create,
  }),
  connect<ButtonCreateInspectPgmBaseStateProps, ButtonCreateInspectPgmBaseDispatchProps, ButtonCreateInspectPgmBaseOwnProps, ReduxState>(
    null,
    (dispatch: any) => ({
      actionCreateInspectPgmBase: (...arg) => (
        dispatch(
          inspectionActions.actionCreateInspectPgmBase(...arg),
        )
      ),
    }),
    null,
    {
      pure: false,
    },
  ),
  withSearch,
)(ButtonCreateInspectPgmBase);
