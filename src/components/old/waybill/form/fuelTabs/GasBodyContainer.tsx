/* eslint-disable no-tabs */
import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import FuelType from 'components/old/waybill/form/FuelType';
import { WaybillProps, WaybillState } from 'components/old/waybill/WaybillForm';
import { isNullOrUndefined } from 'util';
import ExtField from 'components/@next/@ui/renderFields/Field';
import {
  // BorderDash,
  // FlexContainer,
  InfoBlock
} from 'global-styled/global-styled';
import { get } from 'lodash';

import FieldWaybillCarRefill from 'components/old/waybill/table_input/FieldWaybillCarRefill';
import Taxes from 'components/old/waybill/Taxes';
import ErrorsBlock from 'components/@next/@ui/renderFields/ErrorsBlock/ErrorsBlock';
import { TabBodyContainerStyled } from 'components/old/waybill/form/waybillFormTabConfig';

type Props = {
	modalKey: string;
	waybillFormState: WaybillProps['formState']; // state in render WaybillForm
	waybillState: WaybillState; // waybillState in render WaybillForm
	errors: WaybillProps['formErrors'];
	waybillStatus: {
		IS_CREATING: boolean;
		IS_ACTIVE: boolean;
		IS_DRAFT: boolean;
		IS_CLOSED: boolean;
		IS_DELETE: boolean;
	};
	handleMultipleChange: WaybillProps['handleMultipleChange'];
	isPermittedByKey: WaybillProps['isPermittedByKey'];
	lastWaybill: WaybillState['lastWaybill'];
	origFormState: WaybillState['origFormState'];
	handleChange: (field: string, e: any, index?: number) => any;
	handleChangeGasReFill: (gas_refill: any) => any;
	page: string;
	path?: string;
	CAR_HAS_ODOMETER: boolean;
	setTotalValueError: WaybillProps['setTotalValueError'];
	// transfer
	gasFuelCardsList: WaybillProps['gasFuelCardsList'];
	gas_tax_data: any;
	tax_data: any;
	FUEL_TYPES: any;
	IS_KAMAZ: boolean;
	disableFieldWaybillCarRefill: boolean;
  use_pouring: boolean;
  handleChangeTaxes: (taxes: any, field?: string, index?: number ) => any;
  isFuelKind: boolean;
  isElectricityKind: boolean;
  showComponent: boolean;
  handleEquipmentFuel: (equipment_fuel: boolean, withConfirmDialog: boolean) => void;
  updateEngineKindsFields: () => any;
};

/*
// <<< gas
0) Типы топлива, список +
1) fuelCards +- не удаляется ТК
2) Taxes +-
  2.1) Раскраска +
  2.2) error +
  2.3) autocompleteFactValue !!!
3) refill +
4) waybillForm +
5) waybillFormWrap +
6) validate +
*/

const GasBodyContainer: React.FC<Props> = React.memo(
  (props) => {

    const {
      isPermittedByKey,
      waybillStatus: {
        IS_CREATING,
        IS_ACTIVE,
        IS_DRAFT,
        IS_CLOSED,
        IS_DELETE,
      },
      lastWaybill,
      errors,
      IS_KAMAZ,
      modalKey,
      origFormState,
      handleChangeGasReFill,
      disableFieldWaybillCarRefill,
      CAR_HAS_ODOMETER,
      FUEL_TYPES,
      waybillFormState,
      waybillState,
      use_pouring,
      gas_tax_data,
      tax_data,
    } = props;

    return <TabBodyContainerStyled showComponent={props.showComponent}>
      {/* <-- start  Tab Газ */}
      <EtsBootstrap.Col md={12}>
        {/* <-- start  Газ-fields */}
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={4}>
                <FuelType
                  modalKey={modalKey}
                  keyField="gas_fuel_type"
                  value={waybillFormState.gas_fuel_type}
                  error={errors.gas_fuel_type}
                  disabled={true} // всегда установлен газ
                  options={FUEL_TYPES}
                  handleChange={props.handleMultipleChange}
                />
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={4}>
                {!(IS_DRAFT || IS_CREATING) && (
                  <ExtField
                    id="gas-fuel-end"
                    type="number"
                    label="Возврат по таксировке, л"
                    error={errors.gas_fuel_end}
                    value={waybillFormState.gas_fuel_end}
                    format="toFixed3"
                    disabled
                  />
                )}
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={4}>
                <ExtField
                  id="gas-tax-consumption"
                  type="number"
                  label="Расход по таксировке, л"
                  error={errors.gas_tax_consumption}
                  value={waybillFormState.gas_tax_consumption}
                  format="toFixed3"
                  hidden={!(IS_ACTIVE || IS_CLOSED)}
                  disabled
                />
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={4}>
                <ExtField
                  id="gas_fuel_start"
                  type="number"
                  label="Выезд, л"
                  error={errors.gas_fuel_start}
                  value={waybillFormState.gas_fuel_start}
                  disabled={
                    IS_DELETE || (IS_ACTIVE && isNullOrUndefined(waybillFormState.gas_fuel_type)) || IS_CLOSED || !isPermittedByKey.update
															|| Boolean(lastWaybill && !isNullOrUndefined(lastWaybill['gas_fact_fuel_end']))
                  }
                  onChange={props.handleChange}
                  boundKeys="gas_fuel_start"
                  format="toFixed3"
                />
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={4}>
                <ExtField
                  id="gas-fact-fuel-end"
                  type="number"
                  modalKey={modalKey}
                  label="Возврат фактический, л"
                  error={errors.gas_fact_fuel_end}
                  value={waybillFormState.gas_fact_fuel_end}
                  hidden={!(IS_ACTIVE || IS_CLOSED)}
                  disabled={
                    IS_DELETE || !(IS_ACTIVE || waybillState.canEditIfClose)
															|| !isPermittedByKey.update
                  }
                  onChange={props.handleChange}
                  boundKeys="gas_fact_fuel_end"
                  showRedBorder={
                    waybillFormState.gas_fact_fuel_end <= (IS_KAMAZ ? 15 : 5)
                  }
                  format="toFixed3"
                />
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={4}>
                <ExtField
                  id="gas-fact-consuption"
                  type="number"
                  modalKey={modalKey}
                  label="Расход фактический, л"
                  error={errors.gas_fact_consumption}
                  value={waybillFormState.gas_fact_consumption}
                  hidden={!(IS_ACTIVE || IS_CLOSED)}
                  disabled
                  onChange={props.handleChange}
                  boundKeys="gas_fact_consumption"
                  format="toFixed3"
                />
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={4}>
                <ExtField
                  id="gas-fuel-given"
                  type="number"
                  label="Выдано, л"
                  error={errors.gas_fuel_given}
                  value={waybillFormState.gas_fuel_given}
                  disabled
                />
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={4}>
                {
                  Boolean(IS_ACTIVE || IS_CLOSED)
                      && <InfoBlock>
                        Значение поля «Возврат фактический, л» обновляется при редактировании таксировки.
                      </InfoBlock>
                }
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={4}>
                <ExtField
                  id="gas-consuption-diff"
                  type="number"
                  modalKey={modalKey}
                  label="Расхождение в данных расхода, л"
                  error={errors.gas_diff_consumption}
                  value={waybillFormState.gas_diff_consumption}
                  hidden={!(IS_ACTIVE || IS_CLOSED)}
                  disabled
                  onChange={props.handleChange}
                  boundKeys="gas_diff_consumption"
                  format="toFixed3"
                />
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        {/* <-- end  Газ-fields */}
      </EtsBootstrap.Col>
      <EtsBootstrap.Col md={12} zIndex={2}>
        <EtsBootstrap.Col md={12}>
          <FieldWaybillCarRefill // <<< gas
            id="gas_refill"
            array={waybillFormState.gas_refill}
            arrayOrigin={origFormState.gas_refill}
            errors={get(
              errors,
              'gas_refill',
              waybillFormState.gas_refill.map(() => ({})),
            )} // временно
            title="Заправка газа"
            use_pouring={use_pouring}
            handleChange={handleChangeGasReFill}
            fuel_given={waybillFormState.gas_fuel_given}
            structure_id={waybillFormState.structure_id}
            fuel_type={waybillFormState.gas_fuel_type}
            car_id={waybillFormState.car_id}
            gov_number={waybillFormState.gov_number}
            date_for_valid={{
              fact_departure_date: waybillFormState.fact_departure_date,
              plan_departure_date: waybillFormState.plan_departure_date,
              plan_arrival_date: waybillFormState.plan_arrival_date,
              fact_arrival_date: waybillFormState.fact_arrival_date,
            }}
            IS_DRAFT_OR_ACTIVE={
              IS_CREATING || IS_DRAFT || IS_ACTIVE
            }
            disabled={disableFieldWaybillCarRefill}
            canEditIfClose={waybillState.canEditIfClose}
            page={props.page}
            path={props.path}
            boundKey={'gas_refill'}
            fuelCardsList={props.gasFuelCardsList}
          />
        </EtsBootstrap.Col>
      </EtsBootstrap.Col>
      <EtsBootstrap.Col md={12} zIndex={1}>
        <EtsBootstrap.Col md={12}>
          <Taxes
            modalKey={modalKey}
            hidden={
              !(IS_CLOSED || IS_ACTIVE)
                            || IS_DRAFT
                            || (IS_CLOSED
                              && waybillFormState.gas_tax_data
                              && waybillFormState.gas_tax_data.length === 0
                              && !waybillState.canEditIfClose)
                            || (IS_CLOSED && !waybillFormState.gas_tax_data && !waybillState.canEditIfClose)
            }
            readOnly={IS_DELETE || (!IS_ACTIVE && !waybillState.canEditIfClose) || !isPermittedByKey.update}
            IS_CLOSED={IS_CLOSED}
            title="Расчет газа по норме"
            taxes={gas_tax_data}
            sameTaxes={[...gas_tax_data, ...tax_data]}
            operations={waybillState.gasOperations}
            fuelRates={waybillState.gasFuelRates}
            onChange={props.handleChangeTaxes}
            correctionRate={waybillState.fuel_correction_rate}
            baseFactValue={
              CAR_HAS_ODOMETER
                ? waybillFormState.odometr_diff
                : waybillFormState.motohours_diff
            }
            setTotalValueError={props.setTotalValueError}
            type={CAR_HAS_ODOMETER ? 'odometr' : 'motohours'}
            errorsAll={errors}
            boundKey={'gas_tax_data'}
          />
          <ErrorsBlock error={errors.gas_tax_data} />
        </EtsBootstrap.Col>
      </EtsBootstrap.Col>
                    
      {/* <-- end  Tab Газ */}
    </TabBodyContainerStyled>;
  },
);

export default GasBodyContainer;
