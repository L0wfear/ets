import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { CommonTypesForButton } from 'components/new/ui/registry/components/data/header/buttons/component-button/@types/common';
import CarsConditionTableDefectsFormLazy from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_table_form/table/form/index';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';

type Props = CommonTypesForButton & {};

const ButtonCarsConditionTableDefectsForm: React.FC<Props> = React.memo(
  (props) => {

    const [showForm, setShowForm] = React.useState(false);

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

    const selectedRow = etsUseSelector((state) => getListData(state.registry, props.registryKey).data.selectedRow);

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
        showForm &&
          <CarsConditionTableDefectsFormLazy registryKey={props.registryKey} onFormHide={onFormHide} />
      }
      </React.Fragment>
    );
  },
);

export default ButtonCarsConditionTableDefectsForm;
