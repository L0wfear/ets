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
	handleChangeElectricalReFill: (electrical_refill: any) => any;
	page: string;
	path?: string;
	CAR_HAS_ODOMETER: boolean;
	setTotalValueError: WaybillProps['setTotalValueError'];
	// transfer
	electrical_tax_data: any;
	tax_data: any;
	FUEL_TYPES: any;
	IS_KAMAZ: boolean;
	disableFieldWaybillCarRefill: boolean;
  use_pouring: boolean;
  handleChangeTaxes: (taxes: any, field?: string, index?: number ) => any;
  isFuelKind: boolean;
  isElectricalKind: boolean;
  showComponent: boolean;
  handleEquipmentFuel: (equipment_fuel: boolean, withConfirmDialog: boolean) => void;
  updateEngineKindsFields: () => any;
  isGasKind: boolean;
  electricalFuelCardsList: WaybillProps['electricalFuelCardsList'];
};

const ElectricalBodyContainer: React.FC<Props> = React.memo(
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
      handleChangeElectricalReFill,
      disableFieldWaybillCarRefill,
      CAR_HAS_ODOMETER,
      FUEL_TYPES,
      waybillFormState,
      waybillState,
      use_pouring,
      electrical_tax_data,
      tax_data,
    } = props;

    return <TabBodyContainerStyled showComponent={props.showComponent}>
      {/* <-- start  Tab Электричество */}
      <EtsBootstrap.Col md={12}>
        {/* <-- start  Электричество-fields */}
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={12}>
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={4}>
                <FuelType
                  modalKey={modalKey}
                  keyField="electrical_fuel_type"
                  value={waybillFormState.electrical_fuel_type}
                  error={errors.electrical_fuel_type}
                  disabled={true} // всегда установлен Электричество
                  options={FUEL_TYPES}
                  handleChange={props.handleMultipleChange}
                />
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={4}>
                {!(IS_DRAFT || IS_CREATING) && (
                  <ExtField
                    id="electrical-fuel-end"
                    type="number"
                    label="Возврат по таксировке, кВт"
                    error={errors.electrical_fuel_end}
                    value={waybillFormState.electrical_fuel_end}
                    format="toFixed3"
                    disabled
                  />
                )}
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={4}>
                <ExtField
                  id="electrical-tax-consumption"
                  type="number"
                  label="Расход по таксировке, кВт"
                  error={errors.electrical_tax_consumption}
                  value={waybillFormState.electrical_tax_consumption}
                  format="toFixed3"
                  hidden={!(IS_ACTIVE || IS_CLOSED)}
                  disabled
                />
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={4}>
                <ExtField
                  id="electrical_fuel_start"
                  type="number"
                  label="Выезд, кВт"
                  error={errors.electrical_fuel_start}
                  value={waybillFormState.electrical_fuel_start}
                  disabled={
                    IS_DELETE || (IS_ACTIVE && isNullOrUndefined(waybillFormState.electrical_fuel_type)) || IS_CLOSED || !isPermittedByKey.update
															|| Boolean(lastWaybill && !isNullOrUndefined(lastWaybill['electrical_fact_fuel_end']))
                  }
                  onChange={props.handleChange}
                  boundKeys="electrical_fuel_start"
                  format="toFixed3"
                />
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={4}>
                <ExtField
                  id="electrical-fact-fuel-end"
                  type="number"
                  modalKey={modalKey}
                  label="Возврат фактический, кВт"
                  error={errors.electrical_fact_fuel_end}
                  value={waybillFormState.electrical_fact_fuel_end}
                  hidden={!(IS_ACTIVE || IS_CLOSED)}
                  disabled={
                    IS_DELETE || !(IS_ACTIVE || waybillState.canEditIfClose)
															|| !isPermittedByKey.update
                  }
                  onChange={props.handleChange}
                  boundKeys="electrical_fact_fuel_end"
                  showRedBorder={
                    waybillFormState.electrical_fact_fuel_end <= (IS_KAMAZ ? 15 : 5)
                  }
                  format="toFixed3"
                />
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={4}>
                <ExtField
                  id="electrical-fact-consuption"
                  type="number"
                  modalKey={modalKey}
                  label="Расход фактический, кВт"
                  error={errors.electrical_fact_consumption}
                  value={waybillFormState.electrical_fact_consumption}
                  hidden={!(IS_ACTIVE || IS_CLOSED)}
                  disabled
                  onChange={props.handleChange}
                  boundKeys="electrical_fact_consumption"
                  format="toFixed3"
                />
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={4}>
                <ExtField
                  id="electrical-fuel-given"
                  type="number"
                  label="Выдано, кВт"
                  error={errors.electrical_fuel_given}
                  value={waybillFormState.electrical_fuel_given}
                  disabled
                />
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={4}>
                <ExtField
                  id="electrical-consuption-diff"
                  type="number"
                  modalKey={modalKey}
                  label="Расхождение в данных расхода, кВт"
                  error={errors.electrical_diff_consumption}
                  value={waybillFormState.electrical_diff_consumption}
                  hidden={!(IS_ACTIVE || IS_CLOSED)}
                  disabled
                  onChange={props.handleChange}
                  boundKeys="electrical_diff_consumption"
                  format="toFixed3"
                />
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        {/* <-- end  Электричество-fields */}
      </EtsBootstrap.Col>
      <EtsBootstrap.Col md={12} zIndex={2}>
        <EtsBootstrap.Col md={12}>
          <FieldWaybillCarRefill // <<< electrical
            id="electrical_refill"
            array={waybillFormState.electrical_refill}
            arrayOrigin={origFormState.electrical_refill}
            errors={get(
              errors,
              'electrical_refill',
              waybillFormState.electrical_refill.map(() => ({})),
            )} // временно
            title="Заправка ЭЭ"
            use_pouring={use_pouring}
            handleChange={handleChangeElectricalReFill}
            defaultHandleChange={props.handleChange}
            fuel_given={waybillFormState.electrical_fuel_given}
            structure_id={waybillFormState.structure_id}
            fuel_type={'ELECTRICAL'}
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
            is_refill={waybillFormState.is_electrical_refill}
            is_refill_error={errors.is_electrical_refill}
            boundKey={'electrical_refill'}
            fuelCardsList={props.electricalFuelCardsList}
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
                              && waybillFormState.electrical_tax_data
                              && waybillFormState.electrical_tax_data.length === 0
                              && !waybillState.canEditIfClose)
                            || (IS_CLOSED && !waybillFormState.electrical_tax_data && !waybillState.canEditIfClose)
            }
            readOnly={IS_DELETE || (!IS_ACTIVE && !waybillState.canEditIfClose) || !isPermittedByKey.update}
            IS_CLOSED={IS_CLOSED}
            title="Расчет ЭЭ по норме"
            noDataMessage="Для данного ТС нормы расхода ЭЭ не указаны"
            taxes={electrical_tax_data}
            sameTaxes={[...electrical_tax_data, ...tax_data]}
            operations={waybillState.electricalOperations}
            fuelRates={waybillState.electricalFuelRates}
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
            boundKey={'electrical_tax_data'}
            isElectricalKind={props.isElectricalKind}
            canEditIfClose={waybillState.canEditIfClose}
          />
          <ErrorsBlock error={errors.electrical_tax_data} />
        </EtsBootstrap.Col>
      </EtsBootstrap.Col>
                    
      {/* <-- end  Tab Электричество */}
    </TabBodyContainerStyled>;
  },
);

export default ElectricalBodyContainer;
