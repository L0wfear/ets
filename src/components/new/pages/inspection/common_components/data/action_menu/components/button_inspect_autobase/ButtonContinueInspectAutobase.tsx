import * as React from 'react';
import { ButtonContinueInspectAutobaseProps, ButtonContinueInspectAutobaseStateProps, ButtonContinueInspectAutobaseDispatchProps, ButtonContinueInspectAutobaseOwnProps } from './@types/ButtonContinueInspectAutobase';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import { compose } from 'recompose';
import { getRegistryState } from 'redux-main/reducers/selectors';
import { INSPECT_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { BigPaddingButton } from '../../styled/InspectionAutobaseDataActionMenu';
import { getLastConductingInspect } from 'components/new/pages/inspection/autobase/@selectors';

const ButtonContinueInspectAutobase: React.FC<ButtonContinueInspectAutobaseProps> = (props) => {
  const {
    lastConductingInspect,
  } = props;

  const handleClickCreateInspectAutobase = React.useCallback(
    async () => {
      if (lastConductingInspect) {
        props.setParams({
          id: lastConductingInspect.id,
          type: INSPECT_TYPE_FORM.list,
        });
      }
    },
    [lastConductingInspect, props.match.params, props.match.url, props.location.search],
  );

  return (
    <BigPaddingButton onClick={handleClickCreateInspectAutobase}>
      Продолжить проверку
    </BigPaddingButton>
  );
};

export default compose<ButtonContinueInspectAutobaseProps, ButtonContinueInspectAutobaseOwnProps>(
  connect<ButtonContinueInspectAutobaseStateProps, ButtonContinueInspectAutobaseDispatchProps, ButtonContinueInspectAutobaseOwnProps, ReduxState>(
    (state, { loadingPage }) => ({
      permissions: getListData(getRegistryState(state), loadingPage).permissions.update, //  прокидывается в следующий компонент
      lastConductingInspect: getLastConductingInspect(getListData(getRegistryState(state), loadingPage)),
    }),
  ),
  withRequirePermissionsNew(),
  withSearch,
)(ButtonContinueInspectAutobase);
