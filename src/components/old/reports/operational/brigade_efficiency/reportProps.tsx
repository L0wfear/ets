import * as React from 'react';

import { IReportProps } from 'components/reports/@types/common.h';

import { bindable } from 'utils/decorators';
import ReportHeader from 'components/reports/operational/brigade_efficiency/ReportHeader';

export const serviceUrl = '/reports/efficiency/brigade';
const reportUrl = 'brigade-efficiency-report';
const serviceName = 'BrigadeEfficiencyReport';

interface IPropsDutyNumberLink {
  dutyNumber: string;
  onClick: any;
}

const DutyNumberLinkComponent: React.StatelessComponent<IPropsDutyNumberLink> = (props) =>
  <div><a className="pointer" onClick={props.onClick}>{props.dutyNumber}</a></div>;

const DutyNumberLink: any = bindable(DutyNumberLinkComponent);

const schemaMakers = {};

export const renderers = (onDutyNumberLinkClick) => ({
  number: (meta) =>
    <DutyNumberLink
      dutyNumber={meta.data}
      onClick={onDutyNumberLinkClick}
      bindOnClick={meta}
    />,
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
