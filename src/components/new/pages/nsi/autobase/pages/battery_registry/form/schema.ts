import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsBatteryRegistry } from 'components/new/pages/nsi/autobase/pages/battery_registry/form/@types/BatteryRegistryForm';
import { BatteryRegistry } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import memoizeOne from 'memoize-one';
import { diffDates, diffDatesByDays, createValidDate, isCrossDates, dateInPeriod } from 'components/@next/@utils/dates/dates';
import { get } from 'lodash';
import { Tire } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { FuelCard } from '../../../../../../../../redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import { isNullOrUndefined } from 'util';

export const validateDateInsideOther = (dates: Pick<ValuesOf<BatteryRegistry['battery_to_car']>, 'installed_at' | 'uninstalled_at'> & Record<string, any>, battery_to_car: Array<Pick<ValuesOf<BatteryRegistry['battery_to_car']>, 'installed_at' | 'uninstalled_at'> & Record<string, any>>) => {

  if (dates.installed_at && !dates.uninstalled_at) {
    return battery_to_car.some(
      ({ installed_at, uninstalled_at }) => {
        return dateInPeriod(installed_at, uninstalled_at, dates.installed_at, { excludeStart: false, excludeEnd: true, });
      },
    );
  }

  if (!dates.installed_at || !dates.uninstalled_at) {
    return false;
  }

  return battery_to_car.some(
    ({ installed_at, uninstalled_at }) => {
      return isCrossDates(dates.installed_at, dates.uninstalled_at, installed_at, uninstalled_at);
    },
  );
};

export const oldestInstalledDateIndex = (list_elem_to_car: BatteryRegistry['battery_to_car'] | Tire['tire_to_car'] | FuelCard['fuel_card_on_cars']) => {
  let olderIndex = 0;
  // Поиск индекса самой старой даты
  if (list_elem_to_car.length) {
    list_elem_to_car.forEach((elem, index) => {
      const firstData =  createValidDate(get(list_elem_to_car[olderIndex], 'installed_at', null ));
      const secondDate = createValidDate(get(elem, 'installed_at', null));
      if ( elem.installed_at && diffDates( firstData, secondDate ) < 0) {
        olderIndex = index;
      }
    });
  } else {
    return null;
  }
  return olderIndex;
};

export const requiredOneOfDateEnd = (list_elem_to_car: Array<any>) => {
  const resArr = list_elem_to_car.filter((elem) => isNullOrUndefined(elem.uninstalled_at));
  return Boolean(resArr.length > 1);
};

export const batteryRegistryFormSchema: SchemaType<BatteryRegistry, PropsBatteryRegistry> = {
  properties: {
    brand_id: {
      title: 'Марка аккумулятора',
      type: 'number',
      integer: true,
      required: true,
    },
    serial_number: {
      title: 'Серийный номер',
      type: 'string',
      required: true,
      maxLength: 128,
    },
    lifetime_months: {
      title: 'Срок службы, мес.',
      type: 'number',
      required: true,
      maxLength: 128,
      integer: true,
    },
    released_at: {
      title: 'Дата выпуска',
      type: 'date',
      required: true,
    },
    battery_to_car: {
      title: 'Транспортное средство, на котором установлен аккумулятор',
      type: 'any',
      dependencies: [
        memoizeOne(
          (battery_to_car) => {
            return battery_to_car.map(
              (d, index) => {
                const oldestDateIndex = oldestInstalledDateIndex(battery_to_car);
                const installed_at_oldest = createValidDate(get(battery_to_car[oldestDateIndex], 'installed_at', null ));
                const installed_at_current = createValidDate(get(d, 'installed_at', null ));
                return ({
                  car_id: (
                    !d.car_id
                      ? 'Поле "Рег. номер ТС" должно быть заполнено'
                      : ''
                  ),
                  installed_at: (
                    !d.installed_at
                      ? 'Поле "Дата монтажа" должно быть заполнено'
                      : (
                        validateDateInsideOther(d, [...battery_to_car.slice(0, index), ...battery_to_car.slice(index + 1)])
                          ? 'Поле "Дата монтажа" не должно пересекаться с другими записями'
                          : ''
                      )
                  ),
                  uninstalled_at: (
                    (!d.uninstalled_at && (installed_at_oldest !== installed_at_current || requiredOneOfDateEnd(battery_to_car)))
                      ? 'Поле "Дата демонтажа" должно быть заполнено'
                      : (
                        d.uninstalled_at
                          ? (
                            validateDateInsideOther(d, [...battery_to_car.slice(0, index), ...battery_to_car.slice(index + 1)])
                              ? 'Поле "Дата демонтажа" не должно пересекаться с другими записями'
                              : (
                                diffDatesByDays(d.installed_at, d.uninstalled_at) > 0
                                  ? 'Поле "Дата демонтажа" должна быть позже даты монтажа'
                                  : ''
                              )
                          )
                          : ''
                      )
                  ),
                });
              },
            );
          },
        ),
      ],
    },
  },
};
