import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { PropsTire } from 'components/new/pages/nsi/autobase/pages/tire/form/@types/TireForm';
import { Tire } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import memoizeOne from 'memoize-one';
import { diffDates } from 'utils/dates';

const validateDateInsideOther = (date, tire_to_car: Tire['tire_to_car']) => {
  if (!date) {
    return false;
  }

  return tire_to_car.some(
    ({ installed_at, uninstalled_at }) => {

      return (
        diffDates(date, installed_at) > 0
        && diffDates(date, uninstalled_at) < 0
      );
    },
  );
};

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
                    validateDateInsideOther(d.installed_at, tire_to_car)
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
                          validateDateInsideOther(d.uninstalled_at, tire_to_car)
                            ? 'Поле "Дата демонтажа" не должно пересекаться с другими записями'
                            : (
                              diffDates(d.installed_at, d.uninstalled_at) > 0
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
