import * as React from 'react';
import LoadingComponent from 'components/old/ui/PreloaderMainPage';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';
import CarsConditionTableDefectsFormLazy from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_table_form/table/form/index';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import ErrorBoundaryForm from 'components/new/ui/error_boundary_registry/ErrorBoundaryForm';

type Props = CommonTypesForButton & {};

const ButtonCarsConditionTableDefectsForm: React.FC<Props> = React.memo(
  (props) => {
    const [showForm, setShowForm] = React.useState(false);
    const selectedRow = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.selectedRow);

    const handleClick = React.useCallback(
      () => {
        setShowForm(true);
      },
      [props.registryKey],
    );
    const onFormHide = React.useCallback(
      () => {
        setShowForm(false);
      },
      [props.registryKey],
    );

    return (
      <React.Fragment>
        <EtsBootstrap.Button
          id="candition-defect-id-btn"
          bsSize="small"
          onClick={handleClick}
          disabled={!selectedRow}
        >
          <EtsBootstrap.Glyphicon glyph="search" />
          Детализация дефектов
        </EtsBootstrap.Button>
        {
          showForm && (
            <ErrorBoundaryForm>
              <React.Suspense fallback={<LoadingComponent />}>
                <CarsConditionTableDefectsFormLazy
                  element={null}
                  page={props.registryKey}
                  registryKey={props.registryKey}
                  onFormHide={onFormHide}
                />
              </React.Suspense>
            </ErrorBoundaryForm>
          )
        }
      </React.Fragment>
    );
  },
);

export default ButtonCarsConditionTableDefectsForm;
