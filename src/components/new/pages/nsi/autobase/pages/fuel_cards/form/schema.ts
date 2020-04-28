import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsFuelCards } from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/@types/FuelCardsForm';
import { FuelCard } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import { getRequiredFieldMessage, getRequiredFieldDateMoreThen } from 'components/@next/@utils/getErrorString/getErrorString';
import { diffDates, createValidDate, diffDatesByDays, dateInPeriod, createValidDateDots } from 'components/@next/@utils/dates/dates';
import memoizeOne from 'memoize-one';
import { oldestInstalledDateIndex, validateDateInsideOther, requiredOneOfDateEnd } from '../../battery_registry/form/schema';
import { get } from 'lodash';

export const fuelCardsFormSchema: SchemaType<FuelCard, PropsFuelCards> = {
  properties: {
    number: {
      title: 'Номер',
      type: 'string',
      required: true,
      maxLength: 1024,
    },
    fuel_type: {
      title: 'Тип топлива',
      type: 'valueOfArray',
      required: true,
    },
    company_id: {
      title: 'Организация',
      type: 'valueOfArray',
      required: true,
    },
    released_at: {
      title: 'Дата выпуска',
      type: 'datetime',
      required: true,
    },
    date_end: {
      title: 'Дата окончания срока действия',
      type: 'datetime',
      dependencies: [
        (value, { date_end, released_at, }) => {
          if (!value) {
            return getRequiredFieldMessage('Дата окончания срока действия');
          }
          if (diffDates(date_end, released_at) <= 0) {
            return getRequiredFieldDateMoreThen('Дата окончания срока действия', 'даты выпуска');
          }
          return '';
        },
      ],
    },
    fuel_card_on_cars: {
      title: 'Привязанные транспортные средства',
      type: 'any',
      dependencies: [
        memoizeOne(
          (fuel_card_on_cars, { released_at, date_end, }) => {
            return fuel_card_on_cars.map(
              (d, index) => {
                const oldestDateIndex = oldestInstalledDateIndex(fuel_card_on_cars);
                const installed_at_oldest = createValidDate(get(fuel_card_on_cars[oldestDateIndex], 'installed_at', null ));
                const installed_at_current = createValidDate(get(d, 'installed_at', null ));
                const released_at_date = createValidDateDots(released_at);
                const date_end_date = createValidDateDots(date_end);
                const validDateEnd = createValidDate(date_end);
                const validDateReleasedAt = createValidDate(released_at);

                return ({
                  car_id: (
                    !d.car_id
                      ? 'Поле "Рег. номер ТС" должно быть заполнено'
                      : ''
                  ),
                  installed_at: (
                    !d.installed_at
                      ? 'Поле "Дата с" должно быть заполнено'
                      : (
                        validateDateInsideOther(d, [...fuel_card_on_cars.slice(0, index), ...fuel_card_on_cars.slice(index + 1)])
                          ? 'Поле "Дата с" не должно пересекаться с другими записями'
                          : (
                            !dateInPeriod(validDateReleasedAt, validDateEnd, d.installed_at, { excludeStart: false, excludeEnd: false, })
                              ? (!released_at_date || !date_end_date)
                                ? '«Дата с» должна входить в период действия карты'
                                : `"Дата с" должна входить в период с ${released_at_date} по ${date_end_date}`
                              : ''
                          )
                      )
                  ),
                  uninstalled_at: (
                    (!d.uninstalled_at && (installed_at_oldest !== installed_at_current || requiredOneOfDateEnd(fuel_card_on_cars)))
                      ? 'Поле "Дата по" должно быть заполнено'
                      : (
                        d.uninstalled_at
                          ? (
                            validateDateInsideOther(d, [...fuel_card_on_cars.slice(0, index), ...fuel_card_on_cars.slice(index + 1)])
                              ? 'Поле "Дата по" не должно пересекаться с другими записями'
                              : (
                                diffDatesByDays(d.installed_at, d.uninstalled_at) > 0
                                  ? 'Поле "Дата по" должна быть позже "Дата c"'
                                  : (
                                    !dateInPeriod(validDateReleasedAt, validDateEnd, d.uninstalled_at, { excludeStart: false, excludeEnd: false, })
                                      ? (!released_at_date || !date_end_date)
                                        ? '«Дата по» должна входить в период действия карты'  
                                        : `"Дата по" должна входить в период с ${released_at_date} по ${date_end_date}`
                                      : ''
                                  )
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
