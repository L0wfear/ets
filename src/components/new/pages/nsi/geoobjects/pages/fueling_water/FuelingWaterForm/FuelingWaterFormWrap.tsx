import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsFuelingWaterFormWrap } from 'components/new/pages/nsi/geoobjects/pages/fueling_water/FuelingWaterForm/@types/FuelingWaterForm.h';
import withFormRegistrySearch from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const FuelingWaterFrom = React.lazy(() => (
  import(/* webpackChunkName: "FuelingWater_form" */ 'components/new/pages/nsi/geoobjects/pages/fueling_water/FuelingWaterForm/FuelingWaterForm')
));

class FuelingWaterFormWrap extends React.Component<PropsFuelingWaterFormWrap, {}> {
  render() {
    const { element, ...props } = this.props;
    const page = props.registryKey;
    const path = `${props.path ? `${props.path}-` : ''}FuelingWater-form`;

    return element ?
      (
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <FuelingWaterFrom
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

export default withFormRegistrySearch({})(FuelingWaterFormWrap);
