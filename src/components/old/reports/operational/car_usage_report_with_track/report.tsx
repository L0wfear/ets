import * as React from 'react';
import { withProps } from 'recompose';
import { get } from 'lodash';

import { IReportProps } from 'components/old/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/old/reports/common/ReportContainer';
import ReportHeader from 'components/old/reports/operational/car_usage_report_with_track/ReportHeader';
import Title from 'components/old/reports/common/Title';

const renderCarData = ({ data }, props) => {
  const show_gov_numbers = get(props, 'localState.show_gov_numbers');
  if (!show_gov_numbers) {
    return get(data, 'count');
  }

  const gov_numbers = get(data, 'gov_numbers') || [];
  return (
    <div>
      <div><b>{get(data, 'count')}{Boolean(gov_numbers.length) ? ':' : ''}</b></div>
      {
        Boolean(gov_numbers.length) && gov_numbers.map((gov_number) => (
          <div key={gov_number}>{gov_number}</div>
        ))
      }
    </div>
  );
};

const schemaMakeCar = (schema) => ({
  ...schema,
  filter: false,
  sortable: false,
  needStr: true,
});

const serviceUrl = 'car_usage_report';
const reportUrl = 'car-usage-report';
const serviceName = 'CarUsageReport';

const schemaMakers: IReportProps['schemaMakers'] = {
  total_cars: schemaMakeCar,
  write_off_cars: schemaMakeCar,
  accident_cars: schemaMakeCar,
  tech_inspection_cars: schemaMakeCar,
  repair_cars: schemaMakeCar,
  season_store_cars: schemaMakeCar,
  conservation_cars: schemaMakeCar,
  broken_cars: schemaMakeCar,
  not_ready_cars: schemaMakeCar,
  ready_cars: schemaMakeCar,
  working_cars: schemaMakeCar,
};
const summarySchemaMakers: IReportProps['summarySchemaMakers'] = schemaMakers;

const renderers: IReportProps['renderers'] = {
  total_cars: renderCarData,
  write_off_cars: renderCarData,
  accident_cars: renderCarData,
  tech_inspection_cars: renderCarData,
  repair_cars: renderCarData,
  season_store_cars: renderCarData,
  conservation_cars: renderCarData,
  broken_cars: renderCarData,
  not_ready_cars: renderCarData,
  ready_cars: renderCarData,
  working_cars: renderCarData,
};

const infoMessage = 'Отчет строится по назначенным заданиям на ТС, попадающим в дату формирования отчета. Если хотя бы одна координата поступала от ТС, то ТС учитывается в отчете.';
const titleText = 'Отчет по статистике выхода техники';

const title = (
  <Title
    text={titleText}
    hint={infoMessage}
  />
);

const reportProps: IReportProps = {
  title,
  titleText,
  serviceName,
  reportUrl,
  serviceUrl,
  headerComponent: ReportHeader,
  renderers,
  enumerated: true,
  schemaMakers,
  summarySchemaMakers,
  notUseServerSummerTable: true,
  tableProps: {
    reportKey: serviceUrl,
  },
};

const ExportableReportContainer = exportable({
  entity: serviceUrl,
})(ReportContainer);

export default withProps(reportProps)(ExportableReportContainer);
