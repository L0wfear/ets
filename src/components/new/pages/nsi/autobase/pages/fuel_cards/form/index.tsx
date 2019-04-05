import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

import { DivNone } from 'global-styled/global-styled';

import { PropsFuelCardsFormLazy } from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/@types/FuelCardsForm';
import withFormRegistrySearch from 'components/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

const FuelCardsFrom = React.lazy(() => (
  import(/* webpackChunkName: "fuel_cards_form" */ 'components/new/pages/nsi/autobase/pages/fuel_cards/form/FuelCardsForm')
));

const FuelCardsFormWrap: React.FC<PropsFuelCardsFormLazy> = React.memo(
  (props) => {
    const page = props.registryKey || props.page;
    const path = `${props.path ? `${props.path}-` : ''}spare-part-form`;

    return (
      props.element
        ? (
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
        : (
          <DivNone />
        )
    );
  },
);

export default withFormRegistrySearch({})(FuelCardsFormWrap);
