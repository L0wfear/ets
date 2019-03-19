import * as React from 'react';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import {
  ViewInspectAutobaseWrapProps, ViewInspectAutobaseWrapOwnProps,
} from './@types/ViewInspectAutobase';
import { INSPECT_AUTOBASE_TYPE_FORM } from 'components/new/pages/inspection/autobase/global_constants';
import { isInspectAutobaseIsConducting } from 'redux-main/reducers/modules/inspect/autobase/inspect_autobase_actions';
import { DivNone } from 'global-styled/global-styled';
import ViewInspectAutobase from './ViewInspectAutobase';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import inspectAutobasePermissions from 'components/new/pages/inspection/autobase/_config_data/permissions';
import { compose } from 'recompose';

const ViewInspectAutobaseWrap: React.FC<ViewInspectAutobaseWrapProps> = (props) => {
  const inspectAutobaseId = props.match.params.id;
  const inspectAutobaseType = props.match.params.type;

  React.useEffect(() => {
    if (inspectAutobaseId) {
      const tirregOnWrongType = (
        !inspectAutobaseType
        || (
          inspectAutobaseType !== INSPECT_AUTOBASE_TYPE_FORM.list
          && inspectAutobaseType !== INSPECT_AUTOBASE_TYPE_FORM.close
          && inspectAutobaseType !== INSPECT_AUTOBASE_TYPE_FORM.closed
        )
        || (
          inspectAutobaseType === INSPECT_AUTOBASE_TYPE_FORM.closed
          && isInspectAutobaseIsConducting(props.selectedInspectAutobase)
        )
      );

      if (tirregOnWrongType) {
        props.setParams({
          type: INSPECT_AUTOBASE_TYPE_FORM.list,
        });
      }

      if (inspectAutobaseType === INSPECT_AUTOBASE_TYPE_FORM.list || inspectAutobaseType === INSPECT_AUTOBASE_TYPE_FORM.close) {
        if (!isInspectAutobaseIsConducting(props.selectedInspectAutobase)) {
          props.setParams({
            type: INSPECT_AUTOBASE_TYPE_FORM.closed,
          });
        }
      }
    }
  }, [inspectAutobaseId, inspectAutobaseType, props.selectedInspectAutobase]);

  return (
    inspectAutobaseType
      ? (
        <ViewInspectAutobase
          selectedInspectAutobase={props.selectedInspectAutobase}
          type={inspectAutobaseType}
          handleHide={props.onFormHide}
          isPermitted={props.isPermitted}

          page={props.loadingPage}
        />
      )
      : (
        <DivNone />
      )
  );
};

export default compose<ViewInspectAutobaseWrapProps, ViewInspectAutobaseWrapOwnProps>(
  withRequirePermissionsNew({
    permissions: inspectAutobasePermissions.update,
    withIsPermittedProps: true,
  }),
  withSearch,
)(ViewInspectAutobaseWrap);
