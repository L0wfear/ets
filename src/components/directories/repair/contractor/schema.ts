import { IValidationSchema } from 'components/ui/form/@types/validation.h';

export const formValidationSchema: IValidationSchema = {
  properties: [
    {
      key: 'name',
      title: 'Наименование',
      type: 'string',
      required: true,
    },
    {
      key: 'inn',
      title: 'ИНН',
      type: 'number',
      integer: true,
    },
    {
      key: 'kpp',
      title: 'КПП',
      type: 'number',
      integer: true,
    },
    {
      key: 'ogrn',
      title: 'ОГРН',
      type: 'number',
      integer: true,
    },
    {
      key: 'okpo',
      title: 'ОКПО',
      type: 'number',
      integer: true,
    },
    {
      key: 'postal_address',
      title: 'Почтовый адрес',
      type: 'string',
    },
    {
      key: 'email',
      title: 'Электронный адрес',
      type: 'string',
    },
    {
      key: 'phone',
      title: 'Телефон',
      type: 'string',
    },
    {
      key: 'fax',
      title: 'Факс',
      type: 'string',
    },
    {
      key: 'bik',
      title: 'БИК',
      type: 'number',
      integer: true,
    },
  ],
};
