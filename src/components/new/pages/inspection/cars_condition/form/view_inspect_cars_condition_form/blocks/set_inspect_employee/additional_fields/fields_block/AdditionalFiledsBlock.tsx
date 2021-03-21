import * as React from 'react';

import { ISharedPropsDataTableInput } from 'components/old/ui/table/DataTableInput/DataTableInput.h';
import { IExternalPropsDataTableInputWrapper } from 'components/old/ui/table/DataTableInputWrapper/DataTableInputWrapper.h';
import DataTableInput from 'components/old/ui/table/DataTableInput/DataTableInput';
import { 
  meta, 
  renderers, 
  validationSchema 
} from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/set_inspect_employee/additional_fields/fields_block/table-schema';

type IPropsAdditionalFiledsBlock = {
  disabledAddButton: boolean;
} & ISharedPropsDataTableInput & IExternalPropsDataTableInputWrapper;

const AdditionalFiledsBlock: React.FC<IPropsAdditionalFiledsBlock> = React.memo(
  (props) => {

    return (
      <DataTableInput
        tableSchema={meta}
        renderers={renderers}
        validationSchema={validationSchema}
        addButtonLabel="Добавить поле"
        removeButtonLable="Удалить поле"
        stackOrder
        selectField="customId"
        onValidation={() => {}} 
        {...props}
      />
    );
  },
);

export default AdditionalFiledsBlock;
