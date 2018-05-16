import * as React from 'react';
import { connect } from 'react-redux';
import * as cx from 'classnames';
import { getSelectedGeometry } from 'redux/selectors/geoObjects';
import { selectGeometry } from 'redux/modules/geoObjects.js';
import DateFormatter from 'components/ui/DateFormatter';
import { WorkingHours } from 'components/directories/geoobjects/fountains/FountainsTable';

import Panel from 'components/ui/Panel';
import Div from 'components/ui/Div.jsx';

import { GEOOBJECTS_TYPES, GEOOBJECTS_TYPES_LABELS_SINGLE } from 'constants/geoobjects.js';

const InfoDt: React.SFC<any> = ({ data }) =>
  <div>
    <h5>Наименование</h5>
    {data.object_address}
    <h5>Общая площадь</h5>
    {data.total_area}
  </div>;

const InfoODh: React.SFC<any> = ({ data }) =>
  <div>
    <h5>Наименование</h5>
    {data.name}
    <h5>Общая площадь</h5>
    {data.total_area}
  </div>

const InfoSsp: React.SFC<any> = ({ data }) =>
  <div>
    <h5>Наименование</h5>
    {data.name}
    <h5>Адрес</h5>
    {data.address}
    <h5>Производительность (куб. м в сутки)</h5>
    {data.productivity}
  </div>;

const InfoMsp = InfoSsp;

const InfoCarpool: React.SFC<any> = ({ data }) =>
  <div>
    <h5>Наименование</h5>
    {data.name}
    <h5>Адрес</h5>
    {data.address}
  </div>;

const FuelingWaterInfo = InfoCarpool;

const DangerZoneInfo: React.SFC<any> = ({ data }) =>
  <div>
    <h5>Адрес</h5>
    {data.address_comm}
    <h5>Площадь на проезжей части, м2</h5>
    {data.roadway_area}
    <h5>Площадь на тротуаре, м2</h5>
    {data.sidewalk_area}
    <h5>Площадь на обочинах, м2</h5>
    {data.sidelines_area}
  </div>;

const PfmStoreInfo: React.SFC<any> = ({ data }) =>
  <div>
    <h5>Наименование</h5>
    {data.name}
    <h5>Адрес</h5>
    {data.address}
    <h5>Объем жидких ПГМ, т</h5>
    {data.liquid_pgm_volume}
    <h5>Объем твердых ПГМ, т</h5>
    {data.solid_pgm_volume}
    <h5>Тип ПГМ</h5>
    {data.pgm_stores_type_name}
  </div>;

const SnowStorageInfo = InfoCarpool;

const BridgesInfo: React.SFC<any> = ({ data }) =>
  <div>
    <h5>Наименование</h5>{data.name}
    <h5>Район</h5>{data.district}
    <h5>Местоположение объекта</h5>{data.location}
    <h5>Пересечение</h5>{data.crossing}
    <h5>Год ввода в эксплуатацию</h5><DateFormatter date={data.created_at} time={false} />
    <h5>Идентификатор моста</h5>{data.global_id}
  </div>;

const PedestrianTunnelsInfo: React.SFC<any> = ({ data }) =>
  <div>
    <h5>Наименование</h5>{data.name}
    <h5>Административный округ</h5>{data.adm_area}
    <h5>Район</h5>{data.district}
    <h5>Адресный ориентир</h5>{data.location}
  </div>;

const PedestrianTunnelExitsInfo: React.SFC<any> = ({ data }) =>
  <div>
    <h5>Наименование</h5>{data.name}
    <h5>Административный округ</h5>{data.adm_area}
    <h5>Район</h5>{data.district}
  </div>;

const FountainsInfo: React.SFC<any> = ({ data }) =>
  <div>
    <h5>Наименование</h5>{data.name}
    <h5>Административный округ</h5>{data.adm_area}
    <h5>Район</h5>{data.district}
    <h5>Адресный ориентир</h5>{data.location}
    <h5>Ведомственная принадлежность</h5>{data.departmental_affiliation}
    <h5>График работы</h5>
    {data.working_hours.map((item, i) => <WorkingHours key={i} day={item.DayOfWeek} hours={item.Hours} />)}
    <h5>Балансодержатель</h5>{data.balance_holder_name}
    <h5>Телефон балансодержателя</h5>{data.balance_holder_phone}
    <h5>Электронная почта балансодержателя</h5>{data.balance_holder_email}
    <h5>Сайт балансодержателя</h5>
    <a href={`//${data.balance_holder_web_site}`}>{data.balance_holder_web_site}</a>
    <h5>Эксплуатирующая организация</h5>{data.operation_organization_name}
    <h5>Телефон эксплуатирующей организации</h5>{data.operation_organization_phone}
    <h5>Электронная почта эксплуатирующей организации</h5>{data.operation_organization_email}
  </div>;

const renderByType = selected => {
  switch (selected.type) {
    case GEOOBJECTS_TYPES.dt: return <InfoDt data={selected.data} />;
    case GEOOBJECTS_TYPES.odh: return <InfoODh data={selected.data} />;
    case GEOOBJECTS_TYPES.ssp: return <InfoSsp data={selected.data} />;
    case GEOOBJECTS_TYPES.msp: return <InfoMsp data={selected.data} />;
    case GEOOBJECTS_TYPES.carpool: return <InfoCarpool data={selected.data} />;
    case GEOOBJECTS_TYPES.fueling_water: return <FuelingWaterInfo data={selected.data} />;
    case GEOOBJECTS_TYPES.danger_zone: return <DangerZoneInfo data={selected.data} />;
    case GEOOBJECTS_TYPES.pgm_store: return <PfmStoreInfo data={selected.data} />;
    case GEOOBJECTS_TYPES.snow_storage: return <SnowStorageInfo data={selected.data} />;
    case GEOOBJECTS_TYPES.bridges: return <BridgesInfo data={selected.data} />;
    case GEOOBJECTS_TYPES.pedestrian_tunnels: return <PedestrianTunnelsInfo data={selected.data} />;
    case GEOOBJECTS_TYPES.pedestrian_tunnel_exits: return <PedestrianTunnelExitsInfo data={selected.data} />;
    case GEOOBJECTS_TYPES.fountains: return <FountainsInfo data={selected.data} />;
    default: return null;
  }
};

const GeoobjectInfo: React.SFC<any> = props => {
  const { selected } = props;
  const dashboardClassName = cx('monitor-sidebar', { 'monitor-sidebar-sm': !!selected });
  return (
    <Div hidden={!selected} className={dashboardClassName}>
      <span className="monitor-sidebar-close" onClick={props.close}>×</span>
      <div className="car-info feature-info">
        <h3 className="car-info-plate">{GEOOBJECTS_TYPES_LABELS_SINGLE[selected.type]}</h3>
          <Panel title={''}>
            {renderByType(selected)}
          </Panel>
      </div>
    </Div>
  );
};

export default connect(
  state => ({
    selected: getSelectedGeometry(state),
  }),
  {
    close: () => selectGeometry(),
  },
)(GeoobjectInfo);
