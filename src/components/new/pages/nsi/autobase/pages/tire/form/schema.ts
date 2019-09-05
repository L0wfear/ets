import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsTire } from 'components/new/pages/nsi/autobase/pages/tire/form/@types/TireForm';
import { Tire } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import memoizeOne from 'memoize-one';
import { diffDatesByDays } from 'components/@next/@utils/dates/dates';
import { validateDateInsideOther } from 'components/new/pages/nsi/autobase/pages/battery_registry/form/schema';

export const tireFormSchema: SchemaType<Tire, PropsTire> = {
  properties: {
    tire_model_id: {
      title: 'Модель шины',
      type: 'number',
      integer: true,
      required: true,
    },
    tire_size_id: {
      title: 'Размер',
      type: 'number',
      integer: true,
      required: true,
    },
    comment: {
      title: 'Комментарий',
      type: 'string',
      maxLength: 4000,
      required: false,
    },
    initial_mileage: {
      title: 'Первоначальный пробег, км',
      type: 'number',
      min: 0,
      required: true,
    },
    tire_to_car: {
      title: 'Транспортное средство, на котором установлена шина',
      type: 'any',
      dependencies: [
        memoizeOne(
          (tire_to_car) => {
            return tire_to_car.map((d, index) => {
              const oldestDateIndex = oldestInstalledDateIndex(tire_to_car);
              const installed_at_oldest = createValidDate(get(tire_to_car[oldestDateIndex], 'installed_at', null ));
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
                      validateDateInsideOther(d, [...tire_to_car.slice(0, index), ...tire_to_car.slice(index + 1)])
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
                          validateDateInsideOther(d, [...tire_to_car.slice(0, index), ...tire_to_car.slice(index + 1)])
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
