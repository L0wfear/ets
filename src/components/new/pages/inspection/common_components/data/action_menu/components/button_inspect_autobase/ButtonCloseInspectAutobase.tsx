import * as React from 'react';
import { ButtonCloseInspectAutobaseProps, ButtonCloseInspectAutobaseStateProps, ButtonCloseInspectAutobaseDispatchProps, ButtonCloseInspectAutobaseOwnProps } from './@types/ButtonCloseInspectAutobase';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { compose } from 'recompose';
import { getRegistryState } from 'redux-main/reducers/selectors';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import inspectAutobasePermissions from 'components/new/pages/inspection/autobase/_config_data/permissions';
import { INSPECT_AUTOBASE_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import { getLastConductingInspectAutobase } from 'components/new/pages/inspection/autobase/@selectors';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { BigPaddingButton } from '../../styled/InspectionAutobaseDataActionMenu';

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
  withSearch,
  withRequirePermissionsNew({
    permissions: inspectAutobasePermissions.update,
  }),
  connect<ButtonCloseInspectAutobaseStateProps, ButtonCloseInspectAutobaseDispatchProps, ButtonCloseInspectAutobaseOwnProps, ReduxState>(
    (state, { loadingPage }) => ({
      lastConductingInspect: getLastConductingInspectAutobase(getListData(getRegistryState(state), loadingPage)),
    }),
  ),
)(ButtonCloseInspectAutobase);
