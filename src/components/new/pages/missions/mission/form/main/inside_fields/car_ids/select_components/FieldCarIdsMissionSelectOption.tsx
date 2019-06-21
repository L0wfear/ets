import * as React from 'react';
import { get } from 'lodash';
import { Option } from "components/ui/input/ReactSelect/styled/styled";

import { AvailableCarImg, NotAvailableCarImg } from './styled';

const FieldCarIdsMissionSelectOption = (props: any) => {
  const available = get(props, 'data.rowData.available', false);
  const label = get(props, 'data.label', false);

  return (
    <Option {...props}>
      <div>
        {
          available
            ? <AvailableCarImg height="20" />
            : <NotAvailableCarImg height="20" />
        }
        {label}
      </div>
    </Option>
  );
};

export default React.memo(FieldCarIdsMissionSelectOption);
