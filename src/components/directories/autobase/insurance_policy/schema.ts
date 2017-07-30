import { IValidationSchema } from 'components/ui/form/@types/validation.h';

export const formValidationSchema: IValidationSchema = {
  properties: [
    {
      key: 'car_id',
      title: 'Регистрационный номер',
      type: 'number',
      required: true,
    },
    {
      key: 'insurer',
      title: 'Страховая организация',
      type: 'string',
      required: true,
      maxLength: 256,
    },
    {
      key: 'insurance_name',
      title: 'Наименование страхования',
      type: 'string',
      required: true,
      maxLength: 256,
    },
    {
      key: 'insurance_type_id',
      title: 'Тип страхования',
      type: 'number',
      required: true,
    },
    {
      key: 'seria',
      title: 'Серия',
      type: 'string',
    },
    {
      key: 'number',
      title: 'Номер',
      type: 'number',
      maxLength: 128,
      required: true,
      min: 0,
    },
    {
      key: 'date_start',
      title: 'Дата начала действия',
      type: 'date',
      required: true,
    },
    {
      key: 'date_end',
      title: 'Дата окончания действия',
      type: 'date',
      required: true,
    },
    {
      key: 'price',
      title: 'Стоимость, руб.',
      type: 'number',
      maxLength: 128,
      required: true,
      min: 0,
    },
  ],
};

export default formValidationSchema;
