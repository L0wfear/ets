import * as React from 'react';

import { ISharedPropsDataTableInput } from 'components/old/ui/table/DataTableInput/DataTableInput.h';
import { IExternalPropsDataTableInputWrapper } from 'components/old/ui/table/DataTableInputWrapper/DataTableInputWrapper.h';
import DataTableInput from 'components/old/ui/table/DataTableInput/DataTableInput';
import { meta, renderers, validationSchema } from 'components/new/pages/nsi/autobase/pages/tachograph/form/body_container/local_registry/tachograph_data_reading/table-schema';

type IPropsTachographDataReadingBlock = {
  errors: any;
} & ISharedPropsDataTableInput & IExternalPropsDataTableInputWrapper;

const TachographDataReadingBlock: React.FC<IPropsTachographDataReadingBlock> = React.memo(
  (props) => {

    return (
      <DataTableInput
        tableSchema={meta}
        renderers={renderers}
        validationSchema={validationSchema}
        addButtonLabel="Добавить запись"
        removeButtonLable="Удалить запись"
        stackOrder
        useFilter
        withPerPageSelector
        usePagination
        {...props}
      />
    );
  },
);

export default TachographDataReadingBlock;
