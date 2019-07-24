import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { PropsSparePart } from 'components/new/pages/nsi/autobase/pages/spare_part/form/@types/SparePartForm';
import { SparePart } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import memoizeOne from 'memoize-one';
import { diffDates } from 'utils/dates';

export const sparePartFormSchema: SchemaType<SparePart, PropsSparePart> = {
  properties: {
    number: {
      title: 'Номер поставки',
      type: 'string',
      maxLength: 128,
      required: true,
    },
    name: {
      title: 'Подгруппа',
      type: 'string',
      required: true,
      maxLength: 1024,
    },
    quantity: {
      title: 'Количество',
      type: 'number',
      required: true,
      maxLength: 128,
      min: 0,
      integer: true,
    },
    spare_part_group_id: {
      title: 'Группа',
      type: 'valueOfArray',
      required: true,
    },
    measure_unit_id: {
      title: 'Единица измерения',
      type: 'valueOfArray',
      required: true,
    },
    supplied_at: {
      title: 'Дата поставки',
      type: 'date',
    },
    spare_part_to_car: {
      title: 'Транспортные средства, на которые устанавливали запчасть',
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
                count_part: (
                  !d.count_part
                  ? 'Поле "Количество" должно быть заполнено'
                  : !Number.isInteger(Number(d.count_part))
                    ? '"Количество" должно быть целым числом'
                    : d.count_part < 1
                      ? '"Количество" должно быть больше 0'
                      : ''
                ),
                installed_at: (
                  !d.installed_at
                  ? 'Поле "Дата монтажа" должно быть заполнено'
                  : ''
                ),
                uninstalled_at: (
                  !d.uninstalled_at && index
                    ? (
                      diffDates(d.installed_at, d.uninstalled_at) > 0
                        ? 'Поле "Дата демонтажа" должна быть позже даты монтажа'
                        : ''
                    )
                    : ''
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
