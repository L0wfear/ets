import * as React from 'react';

import Report from 'components/reports/operational/cars_travel_time/report';
import ReportFormWrap from 'components/reports/operational/cars_travel_time/form/ReportFormWrap';

type ReportContainerWithFormProps = {
  onRowDoubleClick: any;
  selectedElement?: number;
};

const ReportContainerWithForm: React.FC<ReportContainerWithFormProps> = (props) => {
  const [showForm, setShowForm] = React.useState(false);
  const [dateRange, setDateRange] = React.useState({
    date_from: '',
    date_to: '',
  });
  const [selectedElement, setSelectedElement] = React.useState(null);

  const onRowDoubleClick = React.useCallback(({props: {data}}) => {
    setSelectedElement(data);
    setShowForm(true);
  }, []);

  const onMapFormHide = React.useCallback(() => {
    setShowForm(false);
  }, []);

  return (
    <>
      <Report
        onRowDoubleClick = {onRowDoubleClick}
        setDateRange = {setDateRange}
      ></Report>
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
