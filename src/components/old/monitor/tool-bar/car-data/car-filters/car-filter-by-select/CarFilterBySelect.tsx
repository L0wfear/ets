import * as React from 'react';
import { connect } from 'react-redux';
import * as ClickOutHandler from 'react-onclickout';
import * as cx from 'classnames';
import styled from 'styled-components';

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
import { employeeEmployeeGetSetEmployee } from 'redux-main/reducers/modules/employee/employee/actions';
import { actionLoadTimeMoscow } from 'redux-main/reducers/modules/some_uniq/time_moscow/actions';
import {
  createValidDateTime,
  diffDates,
  getStartOfServerToday,
} from 'components/@next/@utils/dates/dates';
import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { actionGetNorms } from 'redux-main/reducers/modules/some_uniq/norm_registry/actions';
import { Norm } from 'redux-main/reducers/modules/some_uniq/norm_registry/@types';
import { makeObjArrayUniqByKey } from 'utils/functions';
import { getAndSetInStoreCarsForExclude, getAndSetInStoreGeoobjsFilterByElem } from 'components/old/monitor/redux-main/models/actions-monitor-page';

const StyledFilter = styled.div`
    max-height: 532px;
    overflow-y: scroll;
    overflow-x: hidden;
    width: 100%;
    height: 100%;
`;

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
  carFilterMultyElement: 'Элементы',
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
  { key: 'carFilterMultyElement', type: 'multi' },
];

const CarFilterByText: React.FC<PropsCarFilterByText> = React.memo(
  ({ carActualGpsNumberIndex, isOkrug, company_id, active, carFilters, geoobjectsFilter, getAndSetInStoreCarsForExclude, getAndSetInStoreGeoobjsFilterByElem, geoobjsFilterByElem }) => {
    const [hidden, setHidden] = React.useState(true);
    const [employeeData, setEmployeeData] = React.useState<Array<Employee>>([]);
    const [moscowTime, setMoscowTime] = React.useState(null);
    const [elements, setElements] = React.useState<Array<Norm>>([]);
    const [refreshCheckBoxFilter, setRefreshCheckBoxFilter] = React.useState(true);
    const [geoobjsFilteredByElemArrLength, setGeoobjsFilteredByElemArrLength] = React.useState(0);
    const dispatch = etsUseDispatch();

    React.useEffect(() => {
      (async () => {
        const employeeData = await (
          await dispatch(employeeEmployeeGetSetEmployee({}, { page: '' }))
        ).data;
        const moscowTime = await dispatch(
          actionLoadTimeMoscow({}, { page: 'mainpage' })
        );
        setEmployeeData(employeeData);
        setMoscowTime(moscowTime);
      })();
    }, []);

    React.useEffect(() => {
      (async () => {
        const elements = await dispatch(
          actionGetNorms({ page: '' })
        );
        setElements(elements.filter((el) => el.elements_text !== 'Отсутствует элемент'));
      })();
    }, []);

    React.useEffect(() => {
      const {
        withoutMissions,
        withoutWaybills,
      } = carFilters;
      if((withoutMissions || withoutWaybills) && refreshCheckBoxFilter) {
        const requestOptions = {
          without_waybill: withoutWaybills,
          without_mission: withoutMissions,
        };
        getAndSetInStoreCarsForExclude(requestOptions);
        setRefreshCheckBoxFilter(false);
      }
    }, [
      getAndSetInStoreCarsForExclude,
      carFilters.withoutMissions,
      carFilters.withoutWaybills,
      refreshCheckBoxFilter,
    ]);

    React.useEffect(() => {
      const { carFilterMultyElement } = carFilters;
      const lastElemIndex = carFilterMultyElement.length - 1;
      if (
        carFilterMultyElement.length
        && carFilterMultyElement.length > geoobjsFilteredByElemArrLength
        && !~geoobjsFilterByElem.findIndex(
          (el) => el[carFilterMultyElement[lastElemIndex]]
        )
      ) {
        getAndSetInStoreGeoobjsFilterByElem({
          municipal_facility_id: carFilterMultyElement[lastElemIndex],
          object_type_id: geoobjectsFilter === 'dt' ? 2 : 1,
        });
      }
      setGeoobjsFilteredByElemArrLength(carFilterMultyElement.length);
    }, [
      carFilters.carFilterMultyElement,
      geoobjectsFilter,
      geoobjsFilterByElem,
      geoobjsFilteredByElemArrLength,
    ]);

    const calcData = React.useMemo(() => {
      return makeOptions(carActualGpsNumberIndex);
    }, [carActualGpsNumberIndex]);

    const carFilterMultyElementOptions = React.useMemo(() => {
      if (geoobjectsFilter === 'dt') {
        const filteredElements = elements
          .filter((el, i, arr) => arr.indexOf(el) === i && el.objects_text === 'ДТ')
          .map((el) => ({
            value: el.municipal_facility_ids[0],
            label: el.elements_text,
          }));
        return makeObjArrayUniqByKey(filteredElements, 'label');
      }
      if (geoobjectsFilter === 'odh') {
        const filteredElements = elements
          .filter((el) => el.objects_text === 'ОДХ')
          .map((el) => ({
            value: el.municipal_facility_ids[0],
            label: el.elements_text,
          }));
        return makeObjArrayUniqByKey(filteredElements, 'label');
      }
      return [];
    }, [geoobjectsFilter]);

    const carFilterMultyDriversOptions = React.useMemo(() => {
      return employeeData.length && moscowTime
        ? employeeData
          .filter((el) => {
            const defaultParams
                = el.drivers_license
                && el.active
                && el.special_license
                && diffDates(
                  createValidDateTime(el.drivers_license_date_end),
                  getStartOfServerToday(createValidDateTime(moscowTime.date))
                ) > 0
                && diffDates(
                  createValidDateTime(el.special_license_date_end),
                  getStartOfServerToday(createValidDateTime(moscowTime.date))
                ) > 0;
            if (defaultParams && carFilters.carFilterMultyOwner.length) {
              return carFilters.carFilterMultyOwner.includes(el.company_id);
            }
            if (defaultParams && carFilters.carFilterMultyOkrug.length) {
              return carFilters.carFilterMultyOkrug.includes(el.okrug_id);
            }
            return defaultParams;
          })
          .map((el) => ({
            value: {id: el.id, cars: el.prefer_car ? el.secondary_car.concat(el.prefer_car) : el.secondary_car},
            label: `${el.last_name} ${el.first_name} ${el.middle_name ? el.middle_name : ''}`,
          }))
        : [];
    }, [employeeData, moscowTime, carFilters.carFilterMultyOwner, carFilters.carFilterMultyOkrug]);

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
        carFilterMultyElementOptions,
      };
    }, [calcData, carFilterMultyDriversOptions, carFilterMultyElementOptions]);

    const filterFields = React.useMemo(() => {
      return initialFilterFields.filter((el) => {
        if (el.key === 'carFilterMultyElement') {
          return geoobjectsFilter === 'dt' || geoobjectsFilter === 'odh';
        }
        if (el.key === 'carFilterMultyOkrug') {
          return !isOkrug && !company_id;
        }
        if (el.key === 'carFilterMultyOwner') {
          return isOkrug || !company_id;
        }
        if (geoobjectsFilter !== 'cars') {
          return false;
        }
        return true;
      });
    }, [isOkrug, company_id, geoobjectsFilter]);

    const toggleHidden = React.useCallback(() => {
      setHidden(!hidden);
    }, [hidden]);

    const handleClickOut = React.useCallback(() => {
      if (!hidden) {
        setHidden(true);
      }
    }, [hidden]);

    if(!filterFields.length) {
      return <DivNone />;
    }
    return (
      <span>
        <ClickOutHandler onClickOut={handleClickOut}>
          <div className={cx('tool_bar-block', { active })}>
            <StyledFilter className="default_cube flex-row map-car-filter multi">
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
                        setRefreshCheckBoxFilter={setRefreshCheckBoxFilter}
                      />
                    ))}
                  </div>
                </div>
              )}
            </StyledFilter>
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
  carFilters: state.monitorPage.filters.data,
  geoobjsFilterByElem: state.monitorPage.filters.geoobjsFilterByElem,
  active: initialFilterFields.some(
    (el) =>
      state.monitorPage.filters.data[el.key]?.length
      || state.monitorPage.filters.data[el.key] > 0
  ),
}), {getAndSetInStoreCarsForExclude, getAndSetInStoreGeoobjsFilterByElem})(CarFilterByText);
