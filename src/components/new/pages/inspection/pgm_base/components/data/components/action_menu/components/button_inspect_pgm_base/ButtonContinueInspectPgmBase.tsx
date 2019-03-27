import * as React from 'react';
import { BigPaddingButton } from 'components/new/pages/inspection/pgm_base/components/data/components/action_menu/styled/InspectionPgmBaseDataActionMenu';
import { ButtonContinueInspectPgmBaseProps, ButtonContinueInspectPgmBaseStateProps, ButtonContinueInspectPgmBaseDispatchProps, ButtonContinueInspectPgmBaseOwnProps, ButtonContinueInspectPgmBaseMergedProps } from './@types/ButtonContinueInspectPgmBase';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import { compose } from 'recompose';
import { getInspectPgmBase } from 'redux-main/reducers/selectors';
import { INSPECT_PGM_BASE_TYPE_FORM } from 'components/new/pages/inspection/pgm_base/global_constants';
import inspectPgmBasePermissions from 'components/new/pages/inspection/pgm_base/_config_data/permissions';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

const ButtonContinueInspectPgmBase: React.FC<ButtonContinueInspectPgmBaseProps> = (props) => {
  const {
    lastConductingInspect,
  } = props;

  const handleClickCreateInspectPgmBase = React.useCallback(
    async () => {
      if (lastConductingInspect) {
        props.setParams({
          id: lastConductingInspect.id,
          type: INSPECT_PGM_BASE_TYPE_FORM.list,
        });
      }
    },
    [lastConductingInspect, props.match.params, props.match.url, props.location.search],
  );

  return (
    <BigPaddingButton onClick={handleClickCreateInspectPgmBase}>
      Продолжить заполнение карточки
    </BigPaddingButton>
  );
};

export default compose<ButtonContinueInspectPgmBaseProps, ButtonContinueInspectPgmBaseOwnProps>(
  withRequirePermissionsNew({
    permissions: inspectPgmBasePermissions.update,
  }),
  connect<ButtonContinueInspectPgmBaseStateProps, ButtonContinueInspectPgmBaseDispatchProps, ButtonContinueInspectPgmBaseOwnProps, ButtonContinueInspectPgmBaseMergedProps, ReduxState>(
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
)(ButtonContinueInspectPgmBase);
