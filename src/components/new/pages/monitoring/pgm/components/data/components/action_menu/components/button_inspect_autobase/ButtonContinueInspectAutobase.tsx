import * as React from 'react';
import { BigPaddingButton } from 'components/new/pages/inspection/autobase/components/data/components/action_menu/styled/InspectionAutobaseDataActionMenu';
import { ButtonContinueInspectAutobaseProps, ButtonContinueInspectAutobaseStateProps, ButtonContinueInspectAutobaseDispatchProps, ButtonContinueInspectAutobaseOwnProps, ButtonContinueInspectAutobaseMergedProps } from './@types/ButtonContinueInspectAutobase';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import { compose } from 'recompose';
import { getInspectAutobase } from 'redux-main/reducers/selectors';
import { INSPECT_AUTOBASE_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';
import inspectAutobasePermissions from 'components/new/pages/inspection/autobase/_config_data/permissions';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

const ButtonContinueInspectAutobase: React.FC<ButtonContinueInspectAutobaseProps> = (props) => {
  const {
    lastConductingInspect,
  } = props;

  const handleClickCreateInspectAutobase = React.useCallback(
    async () => {
      if (lastConductingInspect) {
        props.setParams({
          id: lastConductingInspect.id,
          type: INSPECT_AUTOBASE_TYPE_FORM.list,
        });
      }
    },
    [lastConductingInspect, props.match.params, props.match.url, props.location.search],
  );

  return (
    <BigPaddingButton onClick={handleClickCreateInspectAutobase}>
      Продолжить заполнение карточки
    </BigPaddingButton>
  );
};

export default compose<ButtonContinueInspectAutobaseProps, ButtonContinueInspectAutobaseOwnProps>(
  withRequirePermissionsNew({
    permissions: inspectAutobasePermissions.update,
  }),
  connect<ButtonContinueInspectAutobaseStateProps, ButtonContinueInspectAutobaseDispatchProps, ButtonContinueInspectAutobaseOwnProps, ButtonContinueInspectAutobaseMergedProps, ReduxState>(
    (state) => ({
      lastConductingInspect: getInspectAutobase(state).lastConductingInspect,
    }),
    null,
    null,
    {
      pure: false,
    },
  ),
  withSearch,
)(ButtonContinueInspectAutobase);
