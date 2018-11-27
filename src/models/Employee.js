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
      key: 'personnel_number',
      title: 'Табельный номер',
      type: 'string',
      integer: false,
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
    {
      key: 'drivers_license_date_end',
      title: 'Срок действия водительского удостоверения',
      type: 'date',
    },
    {
      key: 'special_license_date_end',
      title: 'Срок действия специального удостоверения',
      type: 'date',
    },
  ],
  dependencies: {
    drivers_license: [
      {
        validator: (value, formData) => {
          if (formData.position_id === 15 || formData.position_id === 24 || formData.position_id === 46) {
            if (isEmpty(formData.special_license) && isEmpty(value)) {
              return 'Одно из полей "Специальное удостоверение", "Водительское удостоверение" должно быть заполнено';
            }
          }
          return undefined;
        },
      },
    ],
    special_license: [
      {
        validator: (value, formData) => {
          if (formData.position_id === 15 || formData.position_id === 24 || formData.position_id === 46) {
            if (isEmpty(formData.drivers_license) && isEmpty(value)) {
              return 'Одно из полей "Специальное удостоверение", "Водительское удостоверение" должно быть заполнено';
            }
          }
          return undefined;
        },
      },
    ],
    drivers_license_date_end: [
      {
        validator: (value, formData) => {
          if (!isEmpty(formData.drivers_license) && isEmpty(value)) {
            return 'Поле "Срок действия водительского удостоверения" должно быть заполнено';
          }
          return undefined;
        },
      },
    ],
    special_license_date_end: [
      {
        validator: (value, formData) => {
          if (!isEmpty(formData.special_license) && isEmpty(value)) {
            return 'Поле "Срок действия специального удостоверения" должно быть заполнено';
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
