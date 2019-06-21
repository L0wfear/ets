import * as React from 'react';
import { BlockCarInfoProps } from '../../../@types/BlockCarInfo';
import { ExtField } from 'components/ui/new/field/ExtField';
import { factStatusOptions, statusAtCheckOptions } from '../options';
import { DivNone } from 'global-styled/global-styled';
import { get } from 'lodash';
import { isNullOrUndefined } from 'util';

type FieldCarsConditionsCarSelectFactStatusProps = (
  {
    isPermitted: boolean;
  }
) & Pick<BlockCarInfoProps, 'formState' | 'formErrors' | 'handleChange'>;

const FieldCarsConditionsCarSelectFactStatus: React.FC<FieldCarsConditionsCarSelectFactStatusProps> = React.memo(
  (props) => {
    const {
      formState: state,
      formErrors: errors,
      isPermitted,
    } = props;

    const handleChangeData = React.useCallback(
      (key, event) => {
        props.handleChange({
          data: {
            ...state.data,
            [key]: get(event, 'target.value', event),
          },
        });
      },
      [state.data, props.handleChange],
    );

    React.useEffect(() => {
      const fact_status = getFactStatusByCheckStatus(state.status_at_check);
      if (!isNullOrUndefined(fact_status)) {
        const newObj = {
          fact_status,
          data: {
            ...state.data,
          },
        };
        props.handleChange(newObj);
      }
    }, []);

    const getFactStatusByCheckStatus = React.useCallback(
      (statusAtCheck) => {
        let fact_status = null;
        if (
          statusAtCheck === 'on_line'
          || statusAtCheck === 'not_passed_maintenance'
          || statusAtCheck === 'off_osago'
          || statusAtCheck === 'not_reregistered'
        ) {
          fact_status = 'on_line';
        } else if (
          statusAtCheck === 'maintenance'
          || statusAtCheck === 'storage'
          || statusAtCheck === 'transmitted'
          || statusAtCheck === 'used_third_parties'
          || statusAtCheck === 'off_driver_mechanic'
          || statusAtCheck === 'off_mission'
          || statusAtCheck === 'not_used'
          || statusAtCheck === 'not_retooled'
          || statusAtCheck === 'write_off'
        ) {
          fact_status = 'not_used';
        } else if ( statusAtCheck === 'repair' ) {
          fact_status = 'repair';
        } else if ( statusAtCheck === 'not_submitted' ) {
          fact_status = '';
        }
        return fact_status;
      }, [state],
    );

    const handleChangeStatusAtCheck = React.useCallback(
      (key, event) => {

        const statusAtCheck = get(event, 'target.value', event);

        const fact_status = getFactStatusByCheckStatus(statusAtCheck);

        let newObj = {};
        if (!isNullOrUndefined(fact_status)) {
          newObj = {
            fact_status,
            [key]: get(event, 'target.value', event),
            data: {
              ...state.data,
            },
          };
        } else {
          newObj = {
            [key]: get(event, 'target.value', event),
            data: {
              ...state.data,
            },
          };
        }
        props.handleChange(newObj);
      },
      [props.handleChange, state],
    );

    const handleChangeDataBoolean = React.useCallback(
      (key, event) => {
        handleChangeData(key, get(event, 'target.checked', false));
      },
      [handleChangeData],
    );
    return (
      <React.Fragment>
        <ExtField
          id="status_at_check"
          type="select"
          label="Нахождение ТС на момент проверки:"
          clearable={false}
          value={state.status_at_check}
          error={errors.status_at_check}
          options={statusAtCheckOptions}
          onChange={handleChangeStatusAtCheck}
          boundKeys="status_at_check"
          disabled={!isPermitted}
        />
        <ExtField
          id="fact_status"
          type="select"
          label="Фактический статус ТС:"
          clearable={false}
          value={state.fact_status}
          error={errors.fact_status}
          options={factStatusOptions}
          onChange={props.handleChange}
          boundKeys="fact_status"
          disabled={!isPermitted}
        />
        {
          state.fact_status === 'on_line'
            ? (
              <React.Fragment>
                <ExtField
                  id="waybill_number"
                  type="number"
                  label="Выдан ПЛ номер:"
                  value={state.data.waybill_number}
                  error={errors.data.waybill_number}
                  disabled
                />
                <ExtField
                  id="mission_numbers"
                  type="number"
                  label="Активное задание:"
                  value={state.data.mission_numbers}
                  error={errors.data.mission_numbers}
                  disabled
                />
                <ExtField
                  id="data-not_passed_verification_glonass"
                  type="boolean"
                  label="Не пройдена проверка фактической работы техники с использованием ГЛОНАСС"
                  value={state.data.not_passed_verification_glonass}
                  error={errors.data.not_passed_verification_glonass}
                  onChange={handleChangeDataBoolean}
                  boundKeys="not_passed_verification_glonass"
                  className="checkbox-input flex-reverse"
                  disabled={!props.isPermitted}
                />
              </React.Fragment>
            )
            : (
              state.fact_status === 'repair'
                ? (
                  <ExtField
                    id="reason_repair"
                    type="string"
                    label="Причина ремонта:"
                    value={state.data.reason_repair}
                    error={errors.data.reason_repair}
                    disabled={!isPermitted}
                    onChange={handleChangeData}
                    boundKeys="reason_repair"
                  />
                )
                : (
                  <DivNone />
                )
            )
        }
      </React.Fragment>
    );
  },
);

export default FieldCarsConditionsCarSelectFactStatus;
