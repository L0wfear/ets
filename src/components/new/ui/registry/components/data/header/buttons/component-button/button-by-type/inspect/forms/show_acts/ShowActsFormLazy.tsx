import * as React from 'react';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';
import { inspect_types } from '../../constant';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';

const ShowActsForm = React.lazy(() => (
  import(/* webpackChunkName: "show_acts_form" */ 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/inspect/forms/show_acts/ShowActsForm')
));

type OwnProps = {};
type Props = OwnProps & WithSearchProps;

const ShowActsFormLazy: React.FC<Props> = React.memo(
  (props) => {
    const idFormSearch = getNumberValueFromSerch(props.searchState[inspect_types.inspect_show_acts]);
    const idFormParams = getNumberValueFromSerch(props.match.params[inspect_types.inspect_show_acts]);

    const element = React.useMemo(
      () => {
        if (idFormSearch || idFormParams) {
          return {
            id: idFormSearch || idFormParams,
          };
        }

        return null;
      },
      [idFormSearch || idFormParams || null],
    );

    const onFormHide = React.useCallback(
      () => {
        if (idFormSearch) {
          props.setDataInSearch({
            [inspect_types.inspect_show_acts]: null,
          });
        }

        if (idFormParams) {
          props.setParams({
            [inspect_types.inspect_show_acts]: null,
          });
        }
      },
      [idFormSearch || idFormParams, props.searchState, props.match.params, props.setDataInSearch, props.setParams],
    );

    return element && (
      <ErrorBoundaryForm>
        <React.Suspense fallback={<LoadingComponent />}>
          <ShowActsForm
            element={element}
            handleHide={onFormHide}

            page="main"
            path="main-inspect_show_acts"
          />
        </React.Suspense>
      </ErrorBoundaryForm>
    );
  },
);

export default withSearch<OwnProps>(ShowActsFormLazy);
