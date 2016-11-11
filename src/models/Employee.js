import { isEmpty } from 'utils/functions';

export const schema = {
  properties: [
    {
      key: 'last_name',
      title: 'Фамилия',
      type: 'string',
      required: true,
    },
    {
      key: 'first_name',
      title: 'Имя',
      type: 'string',
      required: true,
    },
    {
      key: 'position_id',
      title: 'Должность',
      type: 'number',
      required: true,
    },
    {
      key: 'special_license',
      title: 'Специальное удостоверение',
      type: 'string',
    },
    {
      key: 'drivers_license',
      title: 'Водительское удостоверение',
      type: 'string',
    },
  ],
  dependencies: {
    'drivers_license': [
      {
        validator: (value, formData) => {
          if (formData.position_id === 15 || formData.position_id === 24) {
            if (isEmpty(formData.special_license) && isEmpty(value)) {
              return 'Одно из полей "Специальное удостоверение", "Водительское удостоверение" должно быть заполнено';
            }
          }
          return undefined;
        },
      },
    ],
    'special_license': [
      {
        validator: (value, formData) => {
          if (formData.position_id === 15 || formData.position_id === 24) {
            if (isEmpty(formData.drivers_license) && isEmpty(value)) {
              return 'Одно из полей "Специальное удостоверение", "Водительское удостоверение" должно быть заполнено';
            }
          }
          return undefined;
        },
      },
    ],
  },
};

export const defaultElement = {
  active: 1,
  is_common: 0,
};
