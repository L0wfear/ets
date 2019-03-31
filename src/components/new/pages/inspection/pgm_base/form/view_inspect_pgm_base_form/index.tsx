import * as React from 'react';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import {
  ViewInspectPgmBaseWrapProps, ViewInspectPgmBaseWrapOwnProps,
} from './@types/ViewInspectPgmBase';
import { INSPECT_PGM_BASE_TYPE_FORM } from 'components/new/pages/inspection/pgm_base/global_constants';
import { isInspectPgmBaseIsConducting } from 'redux-main/reducers/modules/inspect/pgm_base/inspect_pgm_base_actions';
import { DivNone } from 'global-styled/global-styled';
import ViewInspectPgmBase from './ViewInspectPgmBase';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';
import inspectPgmBasePermissions from 'components/new/pages/inspection/pgm_base/_config_data/permissions';
import { compose } from 'recompose';

const ViewInspectPgmBaseWrap: React.FC<ViewInspectPgmBaseWrapProps> = (props) => {
  const inspectPgmBaseId = props.match.params.id;
  const inspectPgmBaseType = props.match.params.type;

  React.useEffect(() => {
    if (inspectPgmBaseId) {
      const tirregOnWrongType = (
        !inspectPgmBaseType
        || (
          inspectPgmBaseType !== INSPECT_PGM_BASE_TYPE_FORM.list
          && inspectPgmBaseType !== INSPECT_PGM_BASE_TYPE_FORM.close
          && inspectPgmBaseType !== INSPECT_PGM_BASE_TYPE_FORM.closed
        )
        || (
          inspectPgmBaseType === INSPECT_PGM_BASE_TYPE_FORM.closed
          && isInspectPgmBaseIsConducting(props.selectedInspectPgmBase)
        )
      );

      if (tirregOnWrongType) {
        props.setParams({
          type: INSPECT_PGM_BASE_TYPE_FORM.list,
        });
      }

      if (inspectPgmBaseType === INSPECT_PGM_BASE_TYPE_FORM.list || inspectPgmBaseType === INSPECT_PGM_BASE_TYPE_FORM.close) {
        if (!isInspectPgmBaseIsConducting(props.selectedInspectPgmBase)) {
          props.setParams({
            type: INSPECT_PGM_BASE_TYPE_FORM.closed,
          });
        }
      }
    }
  }, [inspectPgmBaseId, inspectPgmBaseType, props.selectedInspectPgmBase]);

  return (
    inspectPgmBaseType
      ? (
        <ViewInspectPgmBase
          selectedInspectPgmBase={props.selectedInspectPgmBase}
          type={inspectPgmBaseType}
          handleHide={props.onFormHide}
          isPermitted={props.isPermitted}
          pgmBaseList={props.pgmBaseList}
          page={props.loadingPage}
        />
      )
      : (
        <DivNone />
      )
  );
};

export default compose<ViewInspectPgmBaseWrapProps, ViewInspectPgmBaseWrapOwnProps>(
  withRequirePermissionsNew({
    permissions: inspectPgmBasePermissions.update,
    withIsPermittedProps: true,
  }),
  withSearch,
)(ViewInspectPgmBaseWrap);
