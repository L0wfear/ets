import * as React from 'react';
import { BigPaddingButton } from 'components/new/pages/inspection/pgm_base/components/data/components/action_menu/styled/InspectionPgmBaseDataActionMenu';
import { ButtonCloseInspectPgmBaseProps, ButtonCloseInspectPgmBaseStateProps, ButtonCloseInspectPgmBaseDispatchProps, ButtonCloseInspectPgmBaseOwnProps } from './@types/ButtonCloseInspectPgmBase';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { compose } from 'recompose';
import { getInspectPgmBase } from 'redux-main/reducers/selectors';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import inspectPgmBasePermissions from 'components/new/pages/inspection/pgm_base/_config_data/permissions';
import { INSPECT_PGM_BASE_TYPE_FORM } from 'components/new/pages/inspection/pgm_base/global_constants';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';

const ButtonCloseInspectPgmBase: React.FC<ButtonCloseInspectPgmBaseProps> = (props) => {
  const { lastConductingInspect } = props;

  const handleClickCreateInspectPgmBase = React.useCallback(
    async () => {
      if (lastConductingInspect) {
        props.setParams({
          id: lastConductingInspect.id,
          type: INSPECT_PGM_BASE_TYPE_FORM.close,
        });
      }
    },
    [lastConductingInspect],
  );

  return (
    <BigPaddingButton onClick={handleClickCreateInspectPgmBase}>
      Завершить проверку
    </BigPaddingButton>
  );
};

export default compose<ButtonCloseInspectPgmBaseProps, ButtonCloseInspectPgmBaseOwnProps>(
  withRequirePermissionsNew({
    permissions: inspectPgmBasePermissions.update,
  }),
  connect<ButtonCloseInspectPgmBaseStateProps, ButtonCloseInspectPgmBaseDispatchProps, ButtonCloseInspectPgmBaseOwnProps, {}, ReduxState>(
    (state) => ({
      lastConductingInspect: getInspectPgmBase(state).lastConductingInspect,
    }),
    null,
    null,
    {
      pure: false,
    },
  ),
  withSearch,
)(ButtonCloseInspectPgmBase);
