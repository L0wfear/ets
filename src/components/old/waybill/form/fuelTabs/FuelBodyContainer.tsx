/* eslint-disable no-tabs */
import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import FuelType from 'components/old/waybill/form/FuelType';
import { WaybillProps, WaybillState } from 'components/old/waybill/WaybillForm';
import { isNullOrUndefined } from 'util';
import ExtField from 'components/@next/@ui/renderFields/Field';
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
  warnings: WaybillProps['formWarnings'];
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
	handleChangeCarReFill: (car_refill: any) => any;
	page: string;
	path?: string;
	CAR_HAS_ODOMETER: boolean;
	setTotalValueError: WaybillProps['setTotalValueError'];
	// transfer
	fuelCardsList: WaybillProps['fuelCardsList'];
	tax_data: any;
	gas_tax_data: any;
	FUEL_TYPES: any; 
	IS_KAMAZ: boolean;
	disableFieldWaybillCarRefill: boolean;
  use_pouring: boolean;
  fuel_cards_creating?: boolean;
  handleChangeTaxes: (taxes: any, field?: string, index?: number ) => any;
  showComponent: boolean;
  isGasKind: boolean;
};

const FuelBodyContainer: React.FC<Props> = React.memo(
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
      handleChangeCarReFill,
      disableFieldWaybillCarRefill,
      tax_data,
      gas_tax_data,
      CAR_HAS_ODOMETER,
      FUEL_TYPES,
      waybillFormState,
      waybillState,
      warnings,
      use_pouring,
      fuel_cards_creating,
    } = props;

    const fuelTypesOption = React.useMemo(() => FUEL_TYPES.filter(
      (elem) => elem?.value !== 'GAS' && elem?.value !== 'ELECTRICITY'
    ), [FUEL_TYPES]);

    return <TabBodyContainerStyled showComponent={props.showComponent}>
      {/* <-- start  Tab Топливо */}
      <EtsBootstrap.Col md={12}>
        {/* <-- start  Топливо-fields */}
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={4}>
                <FuelType
                  modalKey={modalKey}
                  keyField="fuel_type"
                  value={waybillFormState.fuel_type}
                  error={errors.fuel_type}
                  disabled={
                    IS_DELETE || (IS_ACTIVE && isNullOrUndefined(waybillFormState.fuel_type)) || IS_CLOSED || !isPermittedByKey.update
															|| (lastWaybill && !!lastWaybill['fuel_type'])
                  }
                  options={fuelTypesOption}
                  handleChange={props.handleMultipleChange}
                />
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={4}>
                {!(IS_DRAFT || IS_CREATING) && (
                  <ExtField
                    id="fuel-end"
                    type="number"
                    label="Возврат по таксировке, л"
                    error={errors.fuel_end}
                    warning={warnings.fuel_end}
                    value={waybillFormState.fuel_end}
                    format="toFixed3"
                    disabled
                  />
                )}
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={4}>
                <ExtField
                  id="tax-consumption"
                  type="number"
                  label="Расход по таксировке, л"
                  error={errors.tax_consumption}
                  warning={warnings.tax_consumption}
                  value={waybillFormState.tax_consumption}
                  format="toFixed3"
                  hidden={!(IS_ACTIVE || IS_CLOSED)}
                  disabled
                />
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={4}>
                <ExtField
                  id="fuel_start"
                  type="number"
                  label="Выезд, л"
                  error={errors.fuel_start}
                  value={waybillFormState.fuel_start}
                  disabled={
                    IS_DELETE || (IS_ACTIVE && isNullOrUndefined(waybillFormState.fuel_type)) || IS_CLOSED || !isPermittedByKey.update
															|| Boolean(lastWaybill && !isNullOrUndefined(lastWaybill['fact_fuel_end']))
                  }
                  onChange={props.handleChange}
                  boundKeys="fuel_start"
                  format="toFixed3"
                />
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={4}>
                <ExtField
                  id="fact-fuel-end"
                  type="number"
                  modalKey={modalKey}
                  label="Возврат фактический, л"
                  error={errors.fact_fuel_end}
                  warning={warnings.fact_fuel_end}
                  value={waybillFormState.fact_fuel_end}
                  hidden={!(IS_ACTIVE || IS_CLOSED)}
                  disabled={
                    IS_DELETE || !(IS_ACTIVE || waybillState.canEditIfClose)
															|| !isPermittedByKey.update
                  }
                  onChange={props.handleChange}
                  boundKeys="fact_fuel_end"
                  showRedBorder={
                    waybillFormState.fact_fuel_end <= (IS_KAMAZ ? 15 : 5)
                  }
                  format="toFixed3"
                />
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={4}>
                <ExtField
                  id="fact-consuption"
                  type="number"
                  modalKey={modalKey}
                  label="Расход фактический, л"
                  error={errors.fact_consumption}
                  warning={warnings.fact_consumption}
                  value={waybillFormState.fact_consumption}
                  hidden={!(IS_ACTIVE || IS_CLOSED)}
                  disabled
                  onChange={props.handleChange}
                  boundKeys="fact_consumption"
                  format="toFixed3"
                />
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={4}>
                <ExtField
                  id="fuel-given"
                  type="number"
                  label="Выдано, л"
                  error={errors.fuel_given}
                  warning={warnings.fuel_given}
                  value={waybillFormState.fuel_given}
                  disabled
                />
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={4}>
                <ExtField
                  id="consuption-diff"
                  type="number"
                  modalKey={modalKey}
                  label="Расхождение в данных расхода, л"
                  error={errors.diff_consumption}
                  value={waybillFormState.diff_consumption}
                  hidden={!(IS_ACTIVE || IS_CLOSED)}
                  disabled
                  onChange={props.handleChange}
                  boundKeys="diff_consumption"
                  format="toFixed3"
                />
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        {/* <-- end  Топливо-fields */}
      </EtsBootstrap.Col>
      <EtsBootstrap.Col md={12} zIndex={4}>
        <EtsBootstrap.Col md={12}>
          <FieldWaybillCarRefill
            id="car_refill"
            array={waybillFormState.car_refill}
            arrayOrigin={origFormState.car_refill}
            errors={get(
              errors,
              'car_refill',
              waybillFormState.car_refill.map(() => ({})),
            )} // временно
            title="Заправка топлива"
            use_pouring={use_pouring}
            fuel_cards_creating={fuel_cards_creating}
            handleChange={handleChangeCarReFill}
            defaultHandleChange={props.handleChange}
            fuel_given={waybillFormState.fuel_given}
            structure_id={waybillFormState.structure_id}
            fuel_type={waybillFormState.fuel_type}
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
            is_refill={waybillFormState.is_no_fuel_refill}
            is_refill_error={errors.is_no_fuel_refill}
            disabled={disableFieldWaybillCarRefill}
            canEditIfClose={waybillState.canEditIfClose}
            page={props.page}
            path={props.path}
            boundKey={'car_refill'}
            fuelCardsList={props.fuelCardsList}
            waybill_status={waybillFormState.status}
            closed_editable={waybillFormState.closed_editable}
          />
        </EtsBootstrap.Col>
      </EtsBootstrap.Col>
      <EtsBootstrap.Col md={12} zIndex={3}>
        <EtsBootstrap.Col md={12}>
          <Taxes
            modalKey={modalKey}
            hidden={
              !(IS_CLOSED || IS_ACTIVE)
                            || IS_DRAFT
                            || (IS_CLOSED
                              && waybillFormState.tax_data
                              && waybillFormState.tax_data.length === 0
                              && !waybillState.canEditIfClose)
                            || (IS_CLOSED && !waybillFormState.tax_data && !waybillState.canEditIfClose)
            }
            readOnly={IS_DELETE || (!IS_ACTIVE && !waybillState.canEditIfClose) || !isPermittedByKey.update}
            IS_CLOSED={IS_CLOSED}
            title="Расчет топлива по норме"
            taxes={tax_data}
            sameTaxes={[...gas_tax_data, ...tax_data]}
            operations={waybillState.operations}
            fuelRates={waybillState.fuelRates}
            onChange={props.handleChangeTaxes}
            correctionRate={waybillState.fuel_correction_rate}
            baseFactValue={
              CAR_HAS_ODOMETER
                ? waybillFormState.odometr_diff
                : waybillFormState.motohours_diff
            }
            setTotalValueError={props.setTotalValueError} // <<< поправить, сделать валидацию через схему!!!
            type={CAR_HAS_ODOMETER ? 'odometr' : 'motohours'}
            errorsAll={errors}
            isGasKind={props.isGasKind}
            canEditIfClose={waybillState.canEditIfClose}
          />
          <ErrorsBlock error={errors.tax_data} />
        </EtsBootstrap.Col>
      </EtsBootstrap.Col>
                    
      {/* <-- end  Tab Топливо */}
    </TabBodyContainerStyled>;
  },
);

export default FuelBodyContainer;
