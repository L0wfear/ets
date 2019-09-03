import * as React from 'react';

import ShowActsFormLazy from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/inspect/forms/show_acts/ShowActsFormLazy';
import InspectionCarsConditionTableFormLazy from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_table_form';
import * as InspectionCarsConditionTableConfig from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_table_form/table/_config-data/registry-config';
import { globalFormShema } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_table_form/GlobalFormSchema';
import CarsConditionTableEdit from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_table_form/table/CarsConditionTableEdit';
import inspectCarsConditionPermissions from 'components/new/pages/inspection/cars_condition/_config_data/permissions';

type Props = {};

export type GlobalFormSchemaType = {
  dataInSearchKeyList: { // То, что мы записываем в URL через метод SetDataInSearch
    type: 'string' | 'number'; // Тип значения по ключу key(ниже), нужен для корректного извлечения значения, если это число
    key: string; // ключ, по которому можно взять значение, из URL
    required?: boolean; // обязателен ли параметр для отображения формы
  }[];
  permissions?: any; // значения в url обнуляются и окно не открываается, если значение не соответствует пермишену, по умолчанию
};

// Здесь формы, которые можно открыть по урлу
const GlobalForms: React.FC<Props> = React.memo(
  (props) => {

  return (
    <React.Fragment>
      <ShowActsFormLazy />
      <InspectionCarsConditionTableFormLazy
        registryConfig={InspectionCarsConditionTableConfig}
        {...props}
        title={"Форма заполнения данных ТС"}
        globalFormShema={globalFormShema}
        registryComponent={<CarsConditionTableEdit />}
        permissions={Object.values(inspectCarsConditionPermissions)}
      />
    </React.Fragment>
  );
  },
);

export default GlobalForms;
