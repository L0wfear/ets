import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsTachograph } from 'components/new/pages/nsi/autobase/pages/tachograph/form/@types/TachographForm';
import { TachographListWithOuterProps } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_registry/@types';
import memoizeOne from 'memoize-one';
import { createValidDate, diffDates, createValidDateDots, dateInPeriod } from 'components/@next/@utils/dates/dates';

export const tachographFormSchema: SchemaType<TachographListWithOuterProps, PropsTachograph> = {
  properties: {
    tachograph_brand_id: {
      title: 'Марка',
      type: 'valueOfArray',
      required: true,
    },
    factory_number: {
      title: 'Заводской номер',
      type: 'string',
      required: true,
    },
    company_structure_id: {
      title: 'Подразделение',
      type: 'number',
    },
    tachograph_on_car: {
      title: 'Транспортное средство, на котором установлен тахограф',
      type: 'any',
      dependencies: [
        memoizeOne(
          (tachograph_on_car, {current_date}) => {
            return tachograph_on_car.map((el, index, arr) => {
              const installed_at_date = createValidDate(el.installed_at);
              const activated_at_date = createValidDate(el.activated_at);
              const uninstalled_at_date = createValidDate(el.uninstalled_at);
              const IS_NEW_EL = index === 0;
              const prevElUninstalledDate = arr[index + 1] ? createValidDate(arr[index + 1].uninstalled_at) : '';
              return ({
                car_id: (
                  !el.car_id
                    ? 'Поле "Рег. номер ТС" должно быть заполнено'
                    : ''
                ),
                install_company_name: (
                  !el.install_company_name
                    ? 'Поле "Фирма-установщик" должно быть заполнено'
                    : ''
                ),
                installed_at: (
                  !el.installed_at
                    ? 'Поле "Дата монтажа" должно быть заполнено'
                    : current_date && diffDates(installed_at_date, current_date) > 0
                      ? 'Дата монтажа не может быть больше текущей'
                      : !!arr[index + 1] && diffDates(installed_at_date, prevElUninstalledDate) < 0
                        ? `Тахограф уже установлен на транспортное средство ${arr[index + 1].gov_number || ''} на данную дату монтажа ${createValidDateDots(el.installed_at)}`
                        : ''
                ),
                activated_at: (
                  !el.activated_at
                    ? 'Поле "Дата активации" должно быть заполнено'
                    : current_date && diffDates(activated_at_date, current_date) > 0
                      ? 'Дата активации не может быть больше текущей'
                      : installed_at_date && diffDates(activated_at_date, installed_at_date) < 0
                        ? 'Дата активации не может быть раньше даты монтажа'
                        : ''
                ),
                uninstalled_at: ( 
                  !IS_NEW_EL && !el.uninstalled_at
                    ? 'Поле "Дата демонтажа" должно быть заполнено'
                    : activated_at_date && diffDates(uninstalled_at_date, activated_at_date) < 0
                      ? 'Дата демонтажа не может быть раньше даты активации'
                      : current_date && diffDates(uninstalled_at_date, current_date) > 0
                        ? 'Дата демонтажа не может быть больше текущей'
                        : ''
                )
              });
            },
            );
          },
        ),
      ],
    },
    tachograph_data_reading: {
      title: 'Считывание данных',
      type: 'any',
      dependencies: [
        memoizeOne(
          (tachograph_data_reading) => {
            return tachograph_data_reading.map((el) => {
              return ({
                reading_fact_date: (
                  !el.reading_fact_date
                    ? 'Поле "Дата считывания данных (факт)" должно быть заполнено'
                    : ''
                ),
              });
            },
            );
          },
        ),
      ],
    },
    tachograph_replacement_skzi: {
      title: 'Замена блока СКЗИ',
      type: 'any',
      dependencies: [
        memoizeOne(
          (tachograph_replacement_skzi, {current_date, tachograph_on_car}) => {
            return tachograph_replacement_skzi.map((el) => {
              const valid_replacement_date = createValidDate(el.replacement_date);
              const isReplacmentDateInValidPeriod
              = tachograph_on_car.some(
                (el) => dateInPeriod(el.installed_at, el.uninstalled_at || valid_replacement_date, valid_replacement_date, {excludeEnd: false, excludeStart: false})
              ); 
              return ({
                replacement_date: (
                  !el.replacement_date
                    ? 'Поле "Дата замены" должно быть заполнено'
                    : !isReplacmentDateInValidPeriod
                      ? 'Дата замены блока СКЗИ должна попадать в период установки тахографа на ТС'
                      : current_date && diffDates(valid_replacement_date, current_date) > 0
                        ? 'Дата установки блока СКЗИ не может быть больше текущей'
                        : ''
                ),
                replacement_reason_id: (
                  !el.replacement_reason_id
                    ? 'Поле "Причина замены" должно быть заполнено'
                    : ''
                ),
              });
            },
            );
          },
        ),
      ],
    }
  },
};
