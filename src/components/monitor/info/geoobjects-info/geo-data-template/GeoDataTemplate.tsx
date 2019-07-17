import * as React from 'react';
import { connect } from 'react-redux';
import DateFormatter from 'components/ui/DateFormatter';
import { GEOOBJECTS_OBJ } from 'constants/geoobjects-new';
import { geoJSON } from 'utils/ol';
import { monitorPageRemoveFromSelectedGeoobjects } from 'components/monitor/redux-main/models/actions-monitor-page';
import FountainWorkingHours from 'components/new/ui/render_some_s/fountain_working_hours';
import { CarInfoBlock, CarInfoClose } from 'components/monitor/styled';

const InfoDt: React.FC<any> = ({ data, ...props }) =>
  <div className="geoobject_one_data" onClick={props.centerOn}>
    <h5 className="title">
      <span>Наименование</span>
      <CarInfoClose>
        <CarInfoBlock onClick={props.handleClickOnClose}><span>x</span></CarInfoBlock>
      </CarInfoClose>
    </h5>
    {data.object_address}
    <h5>Общая площадь</h5>
    {data.total_area}
    <h5>Территория уборки усовершенствованных покрытий, все классы, механизированная, кв.м</h5>
    {data.area_machine_sum}
    <h5>Площадь усовершенствованных покрытий для ручной уборки, кв.м</h5>
    {data.area_hand_improved_sum}
  </div>;

const InfoODh: React.FC<any> = ({ data, ...props }) =>
  <div className="geoobject_one_data" onClick={props.centerOn}>
    <h5 className="title">
      <span>Наименование</span>
      <CarInfoClose>
        <CarInfoBlock onClick={props.handleClickOnClose}><span>x</span></CarInfoBlock>
      </CarInfoClose>
    </h5>
    {data.name}
    <h5>Общая площадь</h5>
    {data.total_area}
    <h5>Площадь проезжей части для механизированной уборки</h5>
    {data.total_auto_clean_area || '--'}
    <h5>Площадь проезжей части для ручной уборки</h5>
    {data.total_manual_clean_area || '---'}
    <h5>Площать тротуаров для механизированной уборки</h5>
    {data.auto_footway_area || '--'}
    <h5>Площать тротуаров для ручной уборки</h5>
    {data.manual_footway_area || '--'}
    <h5>Длина по оси</h5>
    {data.distance || '--'}
    <h5>Длина лотка</h5>
    {data.gutters_length || '--'}
  </div>;

const InfoSsp: React.FC<any> = ({ data, ...props }) =>
  <div className="geoobject_one_data" onClick={props.centerOn}>
    <h5 className="title">
      <span>Наименование</span>
      <CarInfoClose>
        <CarInfoBlock onClick={props.handleClickOnClose}><span>x</span></CarInfoBlock>
      </CarInfoClose>
    </h5>
    {data.name}
    <h5>Адрес</h5>
    {data.address}
    <h5>Производительность (куб. м в сутки)</h5>
    {data.productivity}
  </div>;

const InfoMsp = InfoSsp;

const InfoCarpool: React.FC<any> = ({ data, ...props }) =>
  <div className="geoobject_one_data" onClick={props.centerOn}>
    <h5 className="title">
      <span>Наименование</span>
      <CarInfoClose>
        <CarInfoBlock onClick={props.handleClickOnClose}><span>x</span></CarInfoBlock>
      </CarInfoClose>
    </h5>
    {data.name}
    <h5>Адрес</h5>
    {data.address}
  </div>;

const InfoFuelingWater = InfoCarpool;

const InfoDangerZone: React.FC<any> = ({ data, ...props }) =>
  <div className="geoobject_one_data" onClick={props.centerOn}>
    <h5 className="title">
      <span>Адрес</span>
      <CarInfoClose>
        <CarInfoBlock onClick={props.handleClickOnClose}><span>x</span></CarInfoBlock>
      </CarInfoClose>
    </h5>
    {data.address_comm}
    <h5>Площадь на проезжей части, м2</h5>
    {data.roadway_area}
    <h5>Площадь на тротуаре, м2</h5>
    {data.sidewalk_area}
    <h5>Площадь на обочинах, м2</h5>
    {data.sidelines_area}
  </div>;

const InfoPgm: React.FC<any> = ({ data, ...props }) =>
  <div className="geoobject_one_data" onClick={props.centerOn}>
    <h5 className="title">
      <span>Наименование</span>
      <CarInfoClose>
        <CarInfoBlock onClick={props.handleClickOnClose}><span>x</span></CarInfoBlock>
      </CarInfoClose>
    </h5>
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

const InfoSnowStorage = InfoCarpool;

const InfoBridges: React.FC<any> = ({ data, ...props }) =>
  <div className="geoobject_one_data" onClick={props.centerOn}>
    <h5 className="title">
      <span>Наименование</span>
      <CarInfoClose>
        <CarInfoBlock onClick={props.handleClickOnClose}><span>x</span></CarInfoBlock>
      </CarInfoClose>
    </h5>{data.name}
    <h5>Район</h5>{data.district}
    <h5>Местоположение объекта</h5>{data.location}
    <h5>Пересечение</h5>{data.crossing}
    <h5>Год ввода в эксплуатацию</h5><DateFormatter date={data.created_at} time={false} />
    <h5>Идентификатор моста</h5>{data.global_id}
  </div>;

const InfoPedestrianTunnels: React.FC<any> = ({ data, ...props }) =>
  <div className="geoobject_one_data" onClick={props.centerOn}>
    <h5 className="title">
      <span>Наименование</span>
      <CarInfoClose>
        <CarInfoBlock onClick={props.handleClickOnClose}><span>x</span></CarInfoBlock>
      </CarInfoClose>
    </h5>{data.name}
    <h5>Административный округ</h5>{data.adm_area}
    <h5>Район</h5>{data.district}
    <h5>Адресный ориентир</h5>{data.location}
  </div>;

const InfoPedestrianTunnelExits: React.FC<any> = ({ data, ...props }) =>
  <div className="geoobject_one_data" onClick={props.centerOn}>
    <h5 className="title">
      <span>Наименование</span>
      <CarInfoClose>
        <CarInfoBlock onClick={props.handleClickOnClose}><span>x</span></CarInfoBlock>
      </CarInfoClose>
    </h5>{data.name}
    <h5>Административный округ</h5>{data.adm_area}
    <h5>Район</h5>{data.district}
  </div>;

const FountainsInfo: React.FC<any> = ({ data, ...props }) =>
  <div className="geoobject_one_data" onClick={props.centerOn}>
    <h5 className="title">
      <span>Наименование</span>
      <CarInfoClose>
        <CarInfoBlock onClick={props.handleClickOnClose}><span>x</span></CarInfoBlock>
      </CarInfoClose>
    </h5>{data.name}
    <h5>Административный округ</h5>{data.adm_area}
    <h5>Район</h5>{data.district}
    <h5>Адресный ориентир</h5>{data.location}
    <h5>Ведомственная принадлежность</h5>{data.departmental_affiliation}
    <h5>График работы</h5>
      <FountainWorkingHours data={data.working_hours} />
    <h5>Балансодержатель</h5>{data.balance_holder_name}
    <h5>Телефон балансодержателя</h5>{data.balance_holder_phone}
    <h5>Электронная почта балансодержателя</h5>{data.balance_holder_email}
    <h5>Сайт балансодержателя</h5>
    <a href={`//${data.balance_holder_web_site}`}>{data.balance_holder_web_site}</a>
    <h5>Эксплуатирующая организация</h5>{data.operation_organization_name}
    <h5>Телефон эксплуатирующей организации</h5>{data.operation_organization_phone}
    <h5>Электронная почта эксплуатирующей организации</h5>{data.operation_organization_email}
  </div>;

export const InfoDefaultData: React.FC<any> = ({ data, ...props }) => (
  <div className="geoobject_one_data">define component</div>
);

export let dataByServerName = {
  [GEOOBJECTS_OBJ.dt.serverName]: InfoDt,
  [GEOOBJECTS_OBJ.odh.serverName]: InfoODh,
  [GEOOBJECTS_OBJ.odh_mkad.serverName]: InfoODh,
  [GEOOBJECTS_OBJ.ssp.serverName]: InfoSsp,
  [GEOOBJECTS_OBJ.msp.serverName]: InfoMsp,
  [GEOOBJECTS_OBJ.carpool.serverName]: InfoCarpool,
  [GEOOBJECTS_OBJ.pgm.serverName]: InfoPgm,
  [GEOOBJECTS_OBJ.snow_storage.serverName]: InfoSnowStorage,
  [GEOOBJECTS_OBJ.danger_zone.serverName]: InfoDangerZone,
  [GEOOBJECTS_OBJ.fueling_water.serverName]: InfoFuelingWater,
  [GEOOBJECTS_OBJ.bridges.serverName]: InfoBridges,
  [GEOOBJECTS_OBJ.pedestrian_tunnels.serverName]: InfoPedestrianTunnels,
  [GEOOBJECTS_OBJ.pedestrian_tunnel_exits.serverName]: InfoPedestrianTunnelExits,
  [GEOOBJECTS_OBJ.fountains.serverName]: FountainsInfo,
};

const GeoDataTemplate: React.FC<any> = (props) => {
  const { [props.serverName]: Component = InfoDefaultData } = dataByServerName;

  return <Component data={props.data} serverName={props.serverName} id={props.id} centerOn={props.centerOn} handleClickOnClose={props.handleClickOnClose} />;
};

const mergedProps = (stateProps, { dispatch }, ownerProps) => ({
  ...ownerProps,
  centerOn: () => (
    ownerProps.centerOn({
      extent: geoJSON.readGeometry(ownerProps.data.shape).getExtent(),
      opt_options: {
        padding: [50, 550, 50, 150],
        maxZoom: 9,
        duration: 1000,
      },
    })
  ),
  handleClickOnClose: (event) => {
    dispatch(
      monitorPageRemoveFromSelectedGeoobjects(
        ownerProps.serverName,
        ownerProps.id,
      ),
    );

    event.stopPropagation();
  },
});

export default connect(
  null,
  null,
  mergedProps,
)(GeoDataTemplate);
