import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsFuelCards } from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/@types/FuelCardsForm';
import { FuelCard } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import { getRequiredFieldMessage, getRequiredFieldDateMoreThen } from 'components/@next/@utils/getErrorString/getErrorString';
import { diffDates, createValidDate, diffDatesByDays, dateInPeriod, createValidDateTimeDots } from 'components/@next/@utils/dates/dates';
import memoizeOne from 'memoize-one';
import { oldestInstalledDateIndex, validateDateInsideOther } from '../../battery_registry/form/schema';
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
          (battery_to_car, { released_at, date_end, }) => {
            return battery_to_car.map(
              (d, index) => {
                const oldestDateIndex = oldestInstalledDateIndex(battery_to_car);
                const installed_at_oldest = createValidDate(get(battery_to_car[oldestDateIndex], 'installed_at', null ));
                const installed_at_current = createValidDate(get(d, 'installed_at', null ));
                return ({
                  installed_at: (
                    !d.installed_at
                      ? 'Поле "Дата с" должно быть заполнено'
                      : (
                        validateDateInsideOther(d, [...battery_to_car.slice(0, index), ...battery_to_car.slice(index + 1)])
                          ? 'Поле "Дата с" не должно пересекаться с другими записями'
                          : (
                            !dateInPeriod(released_at, date_end, d.installed_at)
                              ? `"Дата с" должна входить в период с ${createValidDateTimeDots(released_at)} по ${createValidDateTimeDots(date_end)}`
                              : ''
                          )
                      )
                  ),
                  uninstalled_at: (
                    !d.uninstalled_at && installed_at_oldest !== installed_at_current
                      ? 'Поле "Дата по" должно быть заполнено'
                      : (
                        d.uninstalled_at
                          ? (
                            validateDateInsideOther(d, [...battery_to_car.slice(0, index), ...battery_to_car.slice(index + 1)])
                              ? 'Поле "Дата по" не должно пересекаться с другими записями'
                              : (
                                diffDatesByDays(d.installed_at, d.uninstalled_at) > 0
                                  ? 'Поле "Дата по" должна быть позже "Дата по"'
                                  : (
                                    !dateInPeriod(released_at, date_end, d.uninstalled_at)
                                      ? `"Дата с" должна входить в период с ${createValidDateTimeDots(released_at)} по ${createValidDateTimeDots(date_end)}`
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
