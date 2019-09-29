import * as React from 'react';

import ExtField from 'components/@next/@ui/renderFields/Field';
import { RoadAccident } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { makeDriverFioLicenceLabel } from 'redux-main/reducers/modules/employee/driver/promise';
import { PropsRoadAccident } from '../../@types/RoadAccident';
import employeeActions from 'redux-main/reducers/modules/employee/actions-employee';

import { filterDriverAccident } from '../../../../../../utils';

import { createValidDate } from 'components/@next/@utils/dates/dates';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { actionGetLatestWaybillDriver } from 'redux-main/reducers/modules/waybill/waybill_actions';

type Props = {
  isPermitted: boolean;
  error_driver_id: string;
  handleChange: PropsRoadAccident['handleChange'];
  page: string;
  path: string;
} & Pick<RoadAccident, 'driver_id' | 'driver_fio' | 'employee_position_name' | 'special_license' | 'drivers_license' | 'accident_date' | 'car_id' | 'car_gov_number'>;

const FieldRoadAccidentDriverId: React.FC<Props> = React.memo(
  (props) => {
    const [optionData, setOptionData] = React.useState(() => ({ isLoading: false, isLoadingLastDriver: false, options: [] }));

    const {
      car_id,
      driver_id,
      accident_date,
      isPermitted,
      page,
      path,
      car_gov_number,
    } = props;

    const dispatch = etsUseDispatch();

    React.useEffect(
      () => {
        const loadData = async () => {
          setOptionData((oldState) => ({ ...oldState, isLoading: true }));

          let data = null;
          try {
            const employeeDriverGetSetDriverData = await dispatch(
              employeeActions.employeeDriverGetSetDriver(
                {},
                { page, path },
              ),
            );
            data = employeeDriverGetSetDriverData.data;
          } catch (error) {
            data = [];
          }

          setOptionData(
            (oldState) => ({
              ...oldState,
              isLoading: false,
              options: data.filter((driverOpt) => {
                return filterDriverAccident(
                  driverOpt,
                  car_gov_number,
                );
              })
              .map((driver) => ({
                value: driver.id,
                label: driver.fio_license,
                rowData: driver,
              })),
            }),
          );
        };

        loadData();
      },
      [isPermitted, car_gov_number],
    );

    React.useEffect(
      () => {
        const loadData = async () => {
          setOptionData((oldState) => ({ ...oldState, isLoadingLastDriver: true }));

          let lastDriverId = null;
          try {
            lastDriverId = await dispatch(
              actionGetLatestWaybillDriver(
                {
                  car_id,
                  road_accident_date: createValidDate(accident_date),
                },
                props,
              ),
            );
          } catch (error) {
            console.error(error); // tslint:disable-line
          }

          if (lastDriverId) {
            props.handleChange('driver_id', lastDriverId);
          }

          setOptionData((oldState) => ({ ...oldState, isLoadingLastDriver: false }));
        };

        if (accident_date) {
          loadData();
        }
      },
      [accident_date],
    );

    return isPermitted ? (
      <ExtField
        id="driver_id"
        type="select"
        label="Водитель"
        value={driver_id}
        error={props.error_driver_id}
        options={optionData.options}
        emptyValue={null}
        onChange={props.handleChange}
        boundKeys="driver_id"
        clearable={false}
        disabled={!isPermitted}
        modalKey={page}
        etsIsLoading={optionData.isLoading || optionData.isLoadingLastDriver}
      />
    )
    : (
      <ExtField
        id="driver_id"
        type="string"
        label="Водитель"
        value={makeDriverFioLicenceLabel(props.driver_fio, props.employee_position_name, props.drivers_license, props.special_license)}
        emptyValue={null}
        boundKeys="driver_id"
        disabled
        modalKey={page}
      />
    );
  },
);

export default FieldRoadAccidentDriverId;
