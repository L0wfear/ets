import * as React from 'react';
import WaybillByDatePrintForm from './waybill_by_date_print_form/WaybillByDatePrintForm';
import WaybillIntervalPrintForm from './waybill_interval_print_form/WaybillIntervalPrintForm';

type WaybillExportFormProps = {
  typeExportForm: 'byDate' | 'interval';
  handleHide: any;
  registryKey: string;
};

const WaybillExportForm: React.FC<WaybillExportFormProps> = React.memo(
  (props) => {
    if (props.typeExportForm === 'byDate') {
      return (
        <WaybillByDatePrintForm
          element={null}
          handleHide={props.handleHide}
          registryKey={props.registryKey}
          page={props.registryKey}
        />
      );
    }

    if (props.typeExportForm === 'interval') {
      return (
        <WaybillIntervalPrintForm
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

export default WaybillExportForm;
