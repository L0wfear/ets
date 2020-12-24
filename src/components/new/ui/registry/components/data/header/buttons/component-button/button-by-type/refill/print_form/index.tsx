import * as React from 'react';
import RefillIntervalPrintForm from './refill_interval_print_form/RefillIntervalPrintForm';

type RefillExportFormProps = {
  showForm: boolean;
  handleHide: any;
  registryKey: string;
};

const RefillExportForm: React.FC<RefillExportFormProps> = React.memo(
  (props) => {
    if (props.showForm) {
      return (
        <RefillIntervalPrintForm
          element={null}
          handleHide={props.handleHide}
          registryKey={props.registryKey}
          page={props.registryKey}
        />
      );
    }

    return null;
  },
);

export default RefillExportForm;
