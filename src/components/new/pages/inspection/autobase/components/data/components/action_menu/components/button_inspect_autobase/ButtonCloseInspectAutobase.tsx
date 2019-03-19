import * as React from 'react';
import { BigPaddingButton } from 'components/new/pages/inspection/autobase/components/data/components/action_menu/styled/InspectionAutobaseDataActionMenu';
import { ButtonCloseInspectAutobaseProps, ButtonCloseInspectAutobaseStateProps, ButtonCloseInspectAutobaseDispatchProps, ButtonCloseInspectAutobaseOwnProps } from './@types/ButtonCloseInspectAutobase';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { compose } from 'recompose';
import { getInspectAutobse } from 'redux-main/reducers/selectors';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import inspectAutobasePermissions from 'components/new/pages/inspection/autobase/_config_data/permissions';
import { INSPECT_AUTOBASE_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';

const ButtonCloseInspectAutobase: React.FC<ButtonCloseInspectAutobaseProps> = (props) => {
  const { lastConductingInspect } = props;

  const handleClickCreateInspectAutobase = React.useCallback(
    async () => {
      if (lastConductingInspect) {
        props.setParams({
          id: lastConductingInspect.id,
          type: INSPECT_AUTOBASE_TYPE_FORM.close,
        });
      }
    },
    [lastConductingInspect],
  );

  return (
    <BigPaddingButton onClick={handleClickCreateInspectAutobase}>
      Завершить проверку
    </BigPaddingButton>
  );
};

export default compose<ButtonCloseInspectAutobaseProps, ButtonCloseInspectAutobaseOwnProps>(
  withRequirePermissionsNew({
    permissions: inspectAutobasePermissions.update,
  }),
  connect<ButtonCloseInspectAutobaseStateProps, ButtonCloseInspectAutobaseDispatchProps, ButtonCloseInspectAutobaseOwnProps, {}, ReduxState>(
    (state) => ({
      lastConductingInspect: getInspectAutobse(state).lastConductingInspect,
    }),
    null,
    null,
    {
      pure: false,
    },
  ),
  withSearch,
)(ButtonCloseInspectAutobase);
