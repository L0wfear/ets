import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import { ExtFieldType } from 'components/@next/@ui/renderFields/@types';
import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { registryChangeRenderSelectedRow } from 'components/new/ui/registry/module/actions-registy';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { validate, validateDisable } from 'components/old/ui/form/new/validate';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { isBoolean } from 'util';
import { createValidDate, createValidDateTime } from 'components/@next/@utils/dates/dates';
import TdContainer, { TdContainerProps } from 'components/new/ui/registry/components/data/table-data/table-container/@new/tbody/td/inside_button/TdContainer';
import { etsUseIsPermitted } from 'components/@next/ets_hoc/etsUseIsPermitted';
import { isPermittedUpdateCarContidion } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/utils';
import { CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { defaultCarsConditionCar } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/car_info/utils';
import {handleChangeBooleanWithSavedFields} from 'utils/functions';

type OwnProps = {
  renderParams: ExtFieldType | any;
  registryKey: string;
  metaKey: string;
  indexRow: number;
  tdContainerProps: TdContainerProps;
};
type Props = OwnProps & {};

const getValueFromEvent = (valueEvent, renderParams) => {
  switch (renderParams.type) {
    case 'boolean': return get(valueEvent, 'target.checked', null);
    case 'number':
    case 'text':
    case 'string': return get(valueEvent, 'target.value', valueEvent) || null;
    case 'select': return valueEvent;
    case 'date': {
      if (valueEvent) {
        return isBoolean(renderParams.time) && !renderParams.time ? createValidDate(valueEvent) : createValidDateTime(valueEvent);
      }
      return valueEvent;
    }
    default:
      return null;
  }
};

const inspectionFields: Array<keyof CarsConditionCars> = ['diagnostic_card', 'diagnostic_card_finished_at'];
const osagoFields: Array<keyof CarsConditionCars> = ['osago', 'osago_finished_at'];

const ExtFieldTd: React.FC<Props> = React.memo(
  (props) => {
    const [error, setError] = React.useState(null);
    const [disabled, setDisabled] = React.useState(null);
    const [optionsRenderRow, setOptionsRenderRow] = React.useState(null);
    const { renderParams } = props;
    const valuesRenderRow = etsUseSelector((state) => get(getListData(state.registry, props.registryKey), `rendersFields.values`, null));
    const renderFieldsSchema = etsUseSelector((state) => getListData(state.registry, props.registryKey).meta.renderFieldsSchema);

    const registryPermissions = etsUseSelector((state) => getListData(state.registry, props.registryKey).permissions);
    let isPermittedToUpdate = etsUseIsPermitted(registryPermissions.update);
    let isPermittedToUpdateClose = false;
    const value = get(valuesRenderRow, props.metaKey, null);
    const dispatch = etsUseDispatch();
    const [techInpectionSavedFields, setTechInpectionSavedFields] = React.useState<Partial<CarsConditionCars>>(null);
    const [osagoSavedFields, setOsagoSavedFields] = React.useState<Partial<CarsConditionCars>>(null);
    React.useEffect(
      () => {
        if (valuesRenderRow) {
          const formErrors = validate(renderFieldsSchema, valuesRenderRow, {...valuesRenderRow, ...props}, valuesRenderRow);
          const formDisabled = validateDisable(renderFieldsSchema, valuesRenderRow, {...valuesRenderRow, ...props}, valuesRenderRow);
          setError(get(formErrors, props.metaKey, null));
          setDisabled(get(formDisabled, props.metaKey, null));
        }
      }, [valuesRenderRow],
    );

    const handleChangeTechInpectionOrOsagoFields = React.useCallback(
      (changeObj: Partial<CarsConditionCars>): void => {
        for (const key in changeObj) {
          dispatch(
            registryChangeRenderSelectedRow(
              props.registryKey,
              {
                key,
                value: changeObj[key],
              },
            ),
          );
        }
      }, []);

    const handleChange = React.useCallback(
      (fieldValue) => {
        // OMG
        const value = getValueFromEvent(fieldValue, props.renderParams);
        if (props.registryKey === 'InspectCarsConditionsCarsExtendedRegistry' && props.metaKey === 'osago_not_required') {
          handleChangeBooleanWithSavedFields<CarsConditionCars>(
            !value, 
            osagoFields, 
            valuesRenderRow, 
            defaultCarsConditionCar,
            osagoSavedFields, 
            setOsagoSavedFields,
            handleChangeTechInpectionOrOsagoFields
          );
        }
        if (props.registryKey === 'InspectCarsConditionsCarsExtendedRegistry' && props.metaKey === 'tech_inspection_not_required') {
          handleChangeBooleanWithSavedFields<CarsConditionCars>(
            !value, 
            inspectionFields, 
            valuesRenderRow, 
            defaultCarsConditionCar,
            techInpectionSavedFields, 
            setTechInpectionSavedFields,
            handleChangeTechInpectionOrOsagoFields
          );
        }

        dispatch(
          registryChangeRenderSelectedRow(
            props.registryKey,
            {
              key: props.metaKey,
              value,
            },
          ),
        );
      },
      [props.metaKey, props.renderParams, props.registryKey, valuesRenderRow],
    );

    if (props.registryKey === 'InspectCarsConditionsCarsExtendedRegistry') {
      const inspectionConfig = etsUseSelector((reduxState) => get( getSomeUniqState(reduxState), `inspectionConfig`, null));

      React.useEffect(() => {
        setOptionsRenderRow(inspectionConfig);
      }, [inspectionConfig]);

      const isPermittedUpdateInsp = isPermittedUpdateCarContidion(props.registryKey);
      isPermittedToUpdate = isPermittedUpdateInsp.isPermittedToUpdate;
      isPermittedToUpdateClose = isPermittedUpdateInsp.isPermittedToUpdateClose;
    }
    // const isReadOnly = (renderParams.type === 'string' && (!isPermittedToUpdate || disabled)) || renderParams.readOnly;
    const isReadOnly = !isPermittedToUpdate || disabled || renderParams.readOnly;

    const isDisabled = !isPermittedToUpdate || disabled;

    return (
      <EtsBootstrap.Grid.GridBootstrapTbody.Td isSelected={props.tdContainerProps.isSelected} isHorizontalSticky={props.tdContainerProps.isHorizontalSticky}>
        {
          !isDisabled && isPermittedToUpdate && isPermittedToUpdateClose
            ? (
              <ExtField
                id={`${props.registryKey}.${props.indexRow}.${props.metaKey}`}
                type={renderParams.type}
                multi={renderParams.multi}
                time={renderParams.time}
                label={renderParams.label}
                value={value}
                onChange={handleChange}
                className={renderParams.className}
                options={get(optionsRenderRow, props.metaKey, [])} // Опции для инспекций задаются тут actionInspectionConfigGetAndSetInStore, храняться в some_unique
                disabled={isDisabled}
                error={error}
                readOnly={isReadOnly}
                inline={renderParams.inline}
              />
            )
            : (
              <TdContainer {...props.tdContainerProps} />
            )
        }

      </EtsBootstrap.Grid.GridBootstrapTbody.Td>
    );
  },
);

export default ExtFieldTd;
