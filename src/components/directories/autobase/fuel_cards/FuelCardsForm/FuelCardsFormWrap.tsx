import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsFuelCardsFormWrap } from 'components/directories/autobase/fuel_cards/FuelCardsForm/@types/FuelCards.h';

const FuelCardsFrom = React.lazy(() => (
  import(/* webpackChunkName: "fuel_cards_form" */ 'components/directories/autobase/fuel_cards/FuelCardsForm/FuelCardsForm')
));

class FuelCardsFormWrap extends React.Component<PropsFuelCardsFormWrap, {}> {
  render() {
    const { showForm, ...props } = this.props;
    const page = props.loadingPageName || props.page;
    const path = `${props.path ? `${props.path}-` : ''}spare-part-form`;

    return showForm ?
      (
        <ErrorBoundaryForm>
          <React.Suspense fallback={<LoadingComponent />}>
            <FuelCardsFrom
              element={props.element}
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

export default FuelCardsFormWrap;
