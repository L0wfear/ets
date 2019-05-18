import * as React from 'react';

import Report from 'components/reports/operational/cars_travel_time_new/report';
import ReportFormWrap from 'components/reports/operational/cars_travel_time_new/form/ReportFormWrap';

const ReportTsx: any = Report;

type ReportContainerWithFormProps = {
  onRowDoubleClick: any;
  selectedElement?: number; // <<< required
};

const ReportContainerWithForm: React.FC<ReportContainerWithFormProps> = (props) => {
  const [showForm, setShowForm] = React.useState(false);
  const [dateRange, setDateRange] = React.useState({
    date_from: '',
    date_to: '',
  });
  const [selectedElement, setSelectedElement] = React.useState(null);
  // между компоенентами даннми обмениваться как во вью, через функцию setSomething

  const onRowDoubleClick: any = React.useCallback(({props: {data}}) => {
    setSelectedElement(data);
    setShowForm(true);
  }, []);

  const onMapFormHide = React.useCallback(() => {
    setShowForm(false);
  }, []);

  return (
    <>
      <ReportTsx
        onRowDoubleClick={onRowDoubleClick}
        setDateRange={setDateRange}
      />
      <ReportFormWrap
        showForm={showForm}
        onFormHide={onMapFormHide}
        date_from={dateRange.date_from}
        date_to={dateRange.date_to}
        selectedElement={selectedElement}
      />
    </>
  );
};

export default ReportContainerWithForm;
