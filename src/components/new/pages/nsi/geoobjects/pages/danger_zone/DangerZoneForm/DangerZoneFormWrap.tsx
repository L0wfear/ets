import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsDangerZoneFormWrap } from 'components/new/pages/nsi/geoobjects/pages/danger_zone/DangerZoneForm/@types/DangerZoneForm.h';
import withFormRegistrySearch from 'components/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const DangerZoneFrom = React.lazy(() => (
  import(/* webpackChunkName: "DangerZone_form" */ 'components/new/pages/nsi/geoobjects/pages/danger_zone/DangerZoneForm/DangerZoneForm')
));

class DangerZoneFormWrap extends React.Component<PropsDangerZoneFormWrap, {}> {
  render() {
    const { element, ...props } = this.props;
    const page = props.registryKey;
    const path = `${props.path ? `${props.path}-` : ''}DangerZone-form`;

    return element ?
      (
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <DangerZoneFrom
              element={element}
              handleHide={props.onFormHide}

              page={page}
              path={path}
            />
          </React.Suspense>
        </ErrorBoundaryForm>
      )
      :
      (
        <DivNone />
      );
  }
}

export default withFormRegistrySearch({})(DangerZoneFormWrap);
