import * as React from 'react';

import { IReportProps } from 'components/old/reports/@types/common.h';

import ReportHeader from 'components/old/reports/operational/brigade_efficiency/ReportHeader';

export const serviceUrl = '/reports/efficiency/brigade';
const reportUrl = 'brigade-efficiency-report';
const serviceName = 'BrigadeEfficiencyReport';

const schemaMakers = {};

export const renderers = (onDutyNumberLinkClick) => ({
  number: (meta) => {
    return (
      <div>
        <a className="pointer" onClick={(value) => onDutyNumberLinkClick(meta, value)}>{meta.data}</a>
      </div>
    );
  },
});

const reportProps: IReportProps = {
  title: 'Работа бригад по ручной уборке',
  serviceName,
  reportUrl,
  serviceUrl,
  enumerated: true,
  headerComponent: ReportHeader,
  schemaMakers,
};

export default reportProps;
