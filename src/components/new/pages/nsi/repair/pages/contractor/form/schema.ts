import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { PropsContractor } from './@types/ContractorForm';
import { Contractor } from 'redux-main/reducers/modules/repair/contractor/@types/contractor';

export const contractorFormSchema: SchemaType<Contractor, PropsContractor> = {
  properties: {
    name: {
      title: 'Наименование',
      type: 'string',
      required: true,
      minLength: 3,
      maxLength: 255,
    },
    inn: {
      title: 'ИНН',
      type: 'string',
      required: true,
      minLength: 12,
      maxLength: 12,
    },
    kpp: {
      title: 'КПП',
      type: 'string',
      required: true,
      minLength: 9,
      maxLength: 9,
    },
    ogrn: {
      title: 'ОГРН',
      type: 'string',
      required: true,
      minLength: 15,
      maxLength: 15,
    },
    okpo: {
      title: 'ОКПО',
      type: 'string',
      required: true,
      minLength: 10,
      maxLength: 10,
    },
    postal_address: {
      title: 'Почтовый адрес',
      type: 'string',
      required: true,
      minLength: 5,
      maxLength: 500,
    },
    email: {
      title: 'Электронный адрес',
      type: 'string',
      required: true,
      minLength: 5,
      maxLength: 200,
    },
    phone: {
      title: 'Телефон',
      type: 'string',
      required: true,
      minLength: 5,
      maxLength: 20,
    },
    fax: {
      title: 'Факс',
      type: 'string',
      required: true,
      minLength: 5,
      maxLength: 20,
    },
    bik: {
      title: 'БИК',
      type: 'string',
      required: true,
      minLength: 20,
      maxLength: 20,
    },
  },
};
