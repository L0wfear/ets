import * as React from 'react';
import { connect } from 'react-redux';
import * as ClickOutHandler from 'react-onclickout';
import * as cx from 'classnames';

import { makeOptions } from 'components/old/monitor/tool-bar/car-data/car-filters/car-filter-by-select/utils';

import {
  PropsCarFilterByText,
  StateCarFilterByText,
} from 'components/old/monitor/tool-bar/car-data/car-filters/car-filter-by-select/CarFilterBySelect.h';
import DefaultInput from 'components/old/monitor/tool-bar/car-data/car-filters/car-filter-by-select/default-input/DefaultInput';

import { DivNone } from 'global-styled/global-styled';
import { ReduxState } from 'redux-main/@types/state';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { employeeDriverGetSetDriver } from 'redux-main/reducers/modules/employee/driver/actions';
import { Driver } from 'redux-main/reducers/modules/employee/@types/employee.h';

const placeholder = {
  carFilterMultyGpsCode: 'БНСО',
  carFilterMultyType: 'Тип техники',
  carFilterMultyStructure: 'Подразделение',
  carFilterMultyOwner: 'Организация',
  carFilterMultyTechCondition: 'Техническое состояние',
  carFilterMultyModel: 'Марка шасси',
  levelSensors: 'ДУТ',
  carFilterMultyOkrug: 'Округ',
  carFilterMultyDrivers: 'Водитель',
  withoutMissions: 'Без заданий',
  withoutWaybills: 'Без ПЛ',
};

const initialFilterFields: StateCarFilterByText['filterFields'] = [
  { key: 'carFilterMultyGpsCode', type: 'multi' },
  { key: 'carFilterMultyType', type: 'multi' },
  { key: 'carFilterMultyTechCondition', type: 'multi' },
  { key: 'carFilterMultyModel', type: 'multi' },
  { key: 'carFilterMultyStructure', type: 'multi' },
  { key: 'carFilterMultyOkrug', type: 'multi' },
  { key: 'carFilterMultyOwner', type: 'multi' },
  { key: 'carFilterMultyDrivers', type: 'multi' },
  { key: 'levelSensors', type: 'select' },
  { key: 'withoutMissions', type: 'checkbox' },
  { key: 'withoutWaybills', type: 'checkbox' },
];

const CarFilterByText: React.FC<PropsCarFilterByText> = React.memo(
  ({ carActualGpsNumberIndex, isOkrug, company_id, active }) => {
    const [hidden, setHidden] = React.useState(true);
    const [
      carFilterMultyDriversOptions,
      setCarFilterMultyDriversOptions,
    ] = React.useState<Array<Driver>>([]);
    const dispatch = etsUseDispatch();

    React.useEffect(() => {
      dispatch(employeeDriverGetSetDriver({}, { page: '' })).then(
        ({ data }) => {
          setCarFilterMultyDriversOptions(
            data
              .filter((el) => el.active)
              .map((el) => ({
                value: el.id,
                label: `${el.last_name} ${el.first_name} ${el.middle_name}`,
              }))
          );
        }
      );
    }, []);
    const calcData = React.useMemo(() => {
      return makeOptions(carActualGpsNumberIndex);
    }, [carActualGpsNumberIndex]);

    const optionsArr = React.useMemo(() => {
      return {
        carFilterMultyGpsCodeOptions: calcData.carFilterMultyGpsCodeOptions.arr,
        carFilterMultyTypeOptions: calcData.carFilterMultyTypeOptions.arr,
        carFilterMultyTechConditionOptions:
          calcData.carFilterMultyTechConditionOptions.arr,
        carFilterMultyModelOptions: calcData.carFilterMultyModelOptions.arr,
        carFilterMultyStructureOptions:
          calcData.carFilterMultyStructureOptions.arr,
        carFilterMultyOwnerOptions: calcData.carFilterMultyOwnerOptions.arr,
        carFilterMultyOkrugOptions: calcData.carFilterMultyOkrugOptions.arr,
        levelSensorsOptions: [
          { value: 1, label: 'C ДУТ' },
          { value: 2, label: 'Без ДУТ' },
        ],
        carFilterMultyDriversOptions,
      };
    }, [calcData, carFilterMultyDriversOptions]);

    const filterFields = React.useMemo(() => {
      return initialFilterFields.filter((el) => {
        if (el.key === 'carFilterMultyOkrug') {
          return !isOkrug && !company_id;
        }
        if (el.key === 'carFilterMultyOwner') {
          return isOkrug || !company_id;
        }
        return true;
      });
    }, [isOkrug, company_id]);

    const toggleHidden = React.useCallback(() => {
      setHidden(!hidden);
    }, [hidden]);

    const handleClickOut = React.useCallback(() => {
      if (!hidden) {
        setHidden(true);
      }
    }, [hidden]);

    return (
      <span>
        <ClickOutHandler onClickOut={handleClickOut}>
          <div className={cx('tool_bar-block', { active })}>
            <div className='default_cube flex-row map-car-filter multi'>
              <div className='button-toggle' onClick={toggleHidden}>
                <EtsBootstrap.Glyphicon glyph='filter' />
              </div>
              {hidden ? (
                <DivNone />
              ) : (
                <div className='car_text_filter-container multi'>
                  <div>
                    {filterFields.map((keyField) => (
                      <DefaultInput
                        key={keyField.key}
                        keyField={keyField.key}
                        OPTIONS={
                          (keyField.type === 'multi'
                            || keyField.type === 'select')
                          && optionsArr[`${keyField.key}Options`]
                        }
                        placeholder={placeholder[keyField.key]}
                        type={keyField.type}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </ClickOutHandler>
      </span>
    );
  }
);

export default connect<any, any, any, ReduxState>((state) => ({
  isOkrug: state.session.userData.isOkrug,
  company_id: state.session.userData.company_id,
  carActualGpsNumberIndex: state.monitorPage.carActualGpsNumberIndex,
  geoobjectsFilter: state.monitorPage.geoobjectsFilter,
  active: initialFilterFields.some(
    (el) =>
      state.monitorPage.filters.data[el.key]?.length || state.monitorPage.filters.data[el.key] > 0
  ),
}))(CarFilterByText);
