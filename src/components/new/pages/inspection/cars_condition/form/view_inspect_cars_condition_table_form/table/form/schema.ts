import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
// import { PropsCarsConditionTableDefects } from 'components/new/pages/nsi/autobase/pages/cars_condition_table_defects/form/@types/CarsConditionTableDefectsForm';
import { PropsCarsConditionTableDefects } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_table_form/table/form/@types/CarsConditionTableDefectsForm';
import { CarsConditionTableDefects } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';

export const carsConditionTableDefectsFormSchema: SchemaType<CarsConditionTableDefects, PropsCarsConditionTableDefects> = {
  properties: {
  },
};
