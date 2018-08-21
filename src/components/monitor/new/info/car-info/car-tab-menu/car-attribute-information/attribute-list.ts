import { makeDate, makeTime } from 'utils/dates';
import { getStatusById } from 'constants/statuses';
import { roundCoordinates } from 'utils/geo';
import {
  TypeLastPoint,
  PropsCarAttributeInformation,
} from 'components/monitor/new/info/car-info/car-tab-menu/car-attribute-information/CarAttributeInformation.h';

const makeLastPointString = (lastPoint: TypeLastPoint): string => {
  const dt = new Date(lastPoint.timestamp * 1000);

  return `${makeDate(dt)} ${makeTime(dt, true)} [${roundCoordinates(lastPoint.coords_msk)}]`;
};

type OneAtt<P> = {
  key?: string,
  title: string,
  value: (props: P) => string | number | JSX.Element | JSX.Element[],
  loader?: boolean;
  carActualGpsNumberIndex?: boolean;
}


export const attributeList: OneAtt<PropsCarAttributeInformation>[] = [
  {
    key: 'company_name',
    title: 'Организация',
    value: ({ company_name }) => company_name,
    carActualGpsNumberIndex: true,
  },
  {
    key: 'gov_number',
    title: 'Рег. номер ТС',
    value: ({ gov_number }) => gov_number,
    carActualGpsNumberIndex: true,
  },
  {
    key: 'garage_number',
    title: 'Гаражный номер',
    value: ({ garage_number }) => garage_number,
    carActualGpsNumberIndex: true,
  },
  {
    key: 'gps_code',
    title: 'ID БНСО',
    value: ({ gps_code }) => gps_code,
    carActualGpsNumberIndex: true,
  },
  {
    key: 'status',
    title: 'Статус',
    value: ({ status }) => status && getStatusById(status).title,
  },
  {
    key: 'type_name',
    title: 'Тип техники',
    value: ({ type_name }) => type_name,
    carActualGpsNumberIndex: true,
  },
  {
    key: 'model_name',
    title: 'Шасси',
    value: ({ model_name }) => model_name,
    carActualGpsNumberIndex: true,
  },
  {
    key: 'lastPoint',
    title: 'Последняя точка',
    value: ({ lastPoint }) => lastPoint && makeLastPointString(lastPoint),
    loader: true,
  },
];