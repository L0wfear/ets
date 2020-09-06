import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsPenalty } from 'components/new/pages/nsi/autobase/pages/penalties/form/@types/PenaltyForm';
import { Penalty } from 'redux-main/reducers/modules/autobase/actions_by_type/penalties/@types';

export const penaltyFormSchema: SchemaType<Penalty, PropsPenalty> = {
  properties: {
    violation_document_number: {
      title: 'Модель шины',
      type: 'number',
      integer: true,
    },
  },
};
