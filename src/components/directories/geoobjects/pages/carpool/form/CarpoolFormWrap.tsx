import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';
import withRequirePermissionsNew from 'components/util/RequirePermissionsNewRedux';

import { PropsCarpoolFormWrap } from 'components/directories/geoobjects/pages/carpool/form/@types/CarpoolForm.h';

const CarpoolModal = React.lazy(() => (
  import(/* webpackChunkName: "carpool_form" */ 'components/directories/geoobjects/pages/carpool/form/CarpoolForm')
));

class CarpoolModalWrap extends React.PureComponent<PropsCarpoolFormWrap, {}> {
  render() {
    const { showForm, selectField, ...props } = this.props;
    const page = props.loadingPageName || props.page;

    return (
      showForm ?
      (
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <CarpoolModal
              element={props.element}
              handleHide={props.onFormHide}
              refreshList={props.refreshList}

              page={page}
              path={`${props.path ? `${props.path}-` : ''}carpool-form-${props.element[selectField]}`}

              meta={props.meta}
              entity={props.entity}
            />
          </React.Suspense>
        </ErrorBoundaryForm>
      )
      :
      ( <DivNone /> )
    );
  }
}

export default withRequirePermissionsNew({
  byEntity: true,
  type: 'read',
})(CarpoolModalWrap);
