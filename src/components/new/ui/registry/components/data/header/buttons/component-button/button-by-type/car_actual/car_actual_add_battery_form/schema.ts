import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { BatteryRegistry } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import memoizeOne from 'memoize-one';
import { diffDates, diffDatesByDays } from 'utils/dates';
import { CarActualAddBatteryFormProps } from './CarActualAddBatteryForm';

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

export const carActualAddBatteryFormSchema: SchemaType<BatteryRegistry, CarActualAddBatteryFormProps> = {
  properties: {
    battery_to_car: {
      title: 'Транспортное средство, на котором установлен аккумулятор',
      type: 'any',
      dependencies: [
        memoizeOne(
          (battery_to_car) => {
            return battery_to_car.map(
              (d, index) => {
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
                    !d.uninstalled_at && index
                      ? 'Поле "Дата демонтажа" должно быть заполнено'
                      : (
                        d.uninstalled_at
                          ? (
                            validateDateInsideOther(d.uninstalled_at, [...battery_to_car.slice(0, index), ...battery_to_car.slice(index + 1)], 'end')
                              ? 'Поле "Дата демонтажа" не должно пересекаться с другими записями'
                              : (
                                diffDatesByDays(d.installed_at, d.uninstalled_at) >= 0
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
