/* eslint-disable no-tabs */
import * as React from 'react';

import { CarWrap } from 'components/new/pages/nsi/autobase/pages/car_actual/form/@types/CarForm';
import ExtField from 'components/@next/@ui/renderFields/Field';
import { FormWithHandleChange } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import UseEngineKindsList from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/main_tabs/info/inside_fields/engine_data/useEngineKindsList';
import { changeEngineTypeIdsNotyfication, changeEngineGasTypeNotyfication } from 'utils/notifications';
import { YES_NO_SELECT_OPTIONS_BOOL } from 'constants/dictionary';

type Props = {
  onChange: FormWithHandleChange<CarWrap>;
  isPermitted: boolean;
  page: string;
	path: string;
	formErrors: any;
  engine_kind_ids: CarWrap['engine_kind_ids'];
  car_id: CarWrap['asuods_id'];
  is_main: boolean;
};

export const GAS_ENGINE_TYPE_ID = 2;
export const FUEL_ENGINE_TYPE_ID = 1;
export const ELECTRICAL_ENGINE_TYPE_ID = 3;

const FieldSelectEngine: React.FC<Props> = React.memo(
  (props) => {
    const {
      formErrors: errors,
      is_main,
      page,
      path,
    } = props;

    const [is_gas_type, set_is_gas_type] = React.useState(false);

    const engineKindIdsWithoutGas = React.useMemo( // список значений, без газа
      () => props.engine_kind_ids.filter((el) => el !== GAS_ENGINE_TYPE_ID)
      ,[props.engine_kind_ids]
    );
    // в engine_kind_ids храниться массив значений, с учетом газа (id===2); для селекта, нужно 1но значение
    // проверяем что мы можем вытащить значение из engineKindIdsWithoutGas
    const engineKindFieldVal = React.useMemo(() => // Значения в филде
      engineKindIdsWithoutGas
        && Array.isArray(engineKindIdsWithoutGas)
        && engineKindIdsWithoutGas.length
        ? engineKindIdsWithoutGas[0]
        : null
    ,[engineKindIdsWithoutGas]);

    React.useEffect( // initial form
      () => {
        set_is_gas_type(props.engine_kind_ids.includes(GAS_ENGINE_TYPE_ID)); // gas
      },[props.engine_kind_ids]
    );

    const engineKindsOptions = UseEngineKindsList(is_main, {page, path}, 'carForm' );

    const handleChangeEngineKind = React.useCallback(
      (key, value) => {
        const is_gas_type_val = Boolean(key === 'is_gas_type' && value);
        // gas -- id === GAS_ENGINE_TYPE_ID
        
        const newVal = props.engine_kind_ids.reduce((newArr, currentVal) => {
          if(is_gas_type_val && !newArr.includes(GAS_ENGINE_TYPE_ID)){
            newArr.push(GAS_ENGINE_TYPE_ID);
          } else if (!is_gas_type_val && newArr.includes(GAS_ENGINE_TYPE_ID)){
            return newArr.filter((el) => el !== GAS_ENGINE_TYPE_ID);
          }

          return newArr;
        }, key !== 'is_gas_type'
          ? [value]
          : [...props.engine_kind_ids]
        );

        if(key === 'engine_kind_ids'){
          global.NOTIFICATION_SYSTEM.notify(changeEngineTypeIdsNotyfication);
        }
        if(key === 'is_gas_type'){
          global.NOTIFICATION_SYSTEM.notify(changeEngineGasTypeNotyfication);
        }

        set_is_gas_type(is_gas_type_val);
        props.onChange({ 
          engine_kind_ids: newVal,
        });
      },
      [props.onChange, props.engine_kind_ids],
    );

    return (
      <React.Fragment>
        <EtsBootstrap.Col md={6}>
          <ExtField
            id="engine_kind_ids"
            type="select"
            label="Тип двигателя"
            options={engineKindsOptions} // use some hooks
            value={engineKindFieldVal}
            onChange={handleChangeEngineKind}
            boundKeys="engine_kind_ids"
            disabled={!props.isPermitted}
            error={errors.engine_kind_ids}
            clearable={false}
          />
          {
            engineKindFieldVal === FUEL_ENGINE_TYPE_ID
            && <ExtField
              id={'is_gas_type'}
              type="select"
              clearable={false}
              label="На ТС установлено газовое оборудование"
              value={is_gas_type}
              options={YES_NO_SELECT_OPTIONS_BOOL}
              onChange={handleChangeEngineKind}
              disabled={!props.isPermitted}

              boundKeys="is_gas_type"
            />
          }
        </EtsBootstrap.Col>
      </React.Fragment>
    );
  },
);

export default FieldSelectEngine;
