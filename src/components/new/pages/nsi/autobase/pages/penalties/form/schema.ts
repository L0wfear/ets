import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsPenalty } from 'components/new/pages/nsi/autobase/pages/penalties/form/@types/PenaltyForm';
import { Penalty } from 'redux-main/reducers/modules/autobase/actions_by_type/penalties/@types';

export const penaltyFormSchema: SchemaType<Penalty, PropsPenalty> = {
  properties: {
    okrug_name: {
      title: 'Округ',
      type: 'string',
    },
    company_name: {
      title: 'Организация',
      type: 'string',
    },
    ruling_number: {
      title: 'Номер постановления',
      type: 'string',
    },
    ruling_date: {
      title: 'Дата постановления',
      type: 'string',
    },
    odps_name: {
      title: 'Подразделение',
      type: 'string',
    },
    odps_code: {
      title: 'Номер подразделения',
      type: 'string',
    },
    violation_document_type: {
      title: 'Тип документа нарушителя',
      type: 'string',
    },
    violation_document_number: {
      title: 'Номер документа нарушителя',
      type: 'string',
    },
    driver_fio: {
      title: 'Водитель',
      type: 'string',
    },
    waybills_text: {
      title: 'Номер путевого листа',
      type: 'string',
    },
    missions_text: {
      title: 'Номер задания',
      type: 'string',
    },
    violation_datetime: {
      title: 'Дата и время правонарушения',
      type: 'string',
    },
    violation_place: {
      title: 'Место правонарушения',
      type: 'string',
    },
    sum_to_pay: {
      title: 'Размер штрафа',
      type: 'string',
    },
    is_paid: {
      title: 'Оплачен/не оплачен',
      type: 'boolean',
    },
    article_koap: {
      title: 'Статья КОАП или закона субъекта РФ, состав правонарушения',
      type: 'string',
    },
    is_appealed: {
      title: 'Обжалованный штраф',
      type: 'valueOfArray',
    },
    files: {
      title: 'Файл',
      type: 'valueOfArray',
    },
  },
};
