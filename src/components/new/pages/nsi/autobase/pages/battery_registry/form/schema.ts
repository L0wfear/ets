import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsBatteryRegistry } from 'components/new/pages/nsi/autobase/pages/battery_registry/form/@types/BatteryRegistryForm';
import { BatteryRegistry } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import memoizeOne from 'memoize-one';
import { diffDates, diffDatesByDays, createValidDate } from 'components/@next/@utils/dates/dates';
import { get } from 'lodash';
import { Tire } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

const validateDateInsideOther = (date, battery_to_car: BatteryRegistry['battery_to_car'], type: 'start' | 'end') => {
  if (!date) {
    return false;
  }

  return battery_to_car.some(
    ({ installed_at, uninstalled_at }) => {

      if (type === 'start') {
        return (
          diffDates(date, installed_at) >= 0
          && diffDates(date, uninstalled_at) < 0
        );
      }

      return (
        diffDates(date, installed_at) > 0
        && diffDates(date, uninstalled_at) < 0
      );
    },
  );
};

export const oldestInstalledDateIndex = (list_elem_to_car: BatteryRegistry['battery_to_car'] | Tire['tire_to_car']) => {
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
                      validateDateInsideOther(d.installed_at, [...battery_to_car.slice(0, index), ...battery_to_car.slice(index + 1)], 'start')
                        ? 'Поле "Дата монтажа" не должно пересекаться с другими записями'
                        : ''
                    )
                  ),
                  uninstalled_at: (
                    !d.uninstalled_at && installed_at_oldest !== installed_at_current
                      ? 'Поле "Дата демонтажа" должно быть заполнено'
                      : (
                        d.uninstalled_at
                          ? (
                            validateDateInsideOther(d.uninstalled_at, [...battery_to_car.slice(0, index), ...battery_to_car.slice(index + 1)], 'end')
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
