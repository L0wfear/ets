import * as React from 'react';
import { BoxContainer } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';
import { BlockCarInfoProps } from '../../@types/BlockCarInfo';
import ExtField from 'components/@next/@ui/renderFields/Field';
// import { makeDate, makeTime } from 'components/@next/@utils/dates/dates';
// import { DivNone } from 'global-styled/global-styled';
import FieldCarsConditionsCarMarka from './inside_fields/marka/FieldCarsConditionsCarMarka';
import FieldCarsConditionsCarModel from './inside_fields/model/FieldCarsConditionsCarModel';
import FieldCarsConditionsCarType from './inside_fields/type/FieldCarsConditionsCarType';
import FieldCarsConditionsCarSeason from './inside_fields/season/FieldCarsConditionsCarSeason';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type BlockCarInfoMainDataProps = (
  {
    isPermitted: boolean;
  }
) & Pick<BlockCarInfoProps, 'IS_CREATING' | 'formState' | 'formErrors' | 'handleChange' | 'page' | 'path'>;

const BlockCarInfoMainData: React.FC<BlockCarInfoMainDataProps> = React.memo(
  (props) => {
    const {
      IS_CREATING,
      formState: state,
      formErrors: errors,
    } = props;

    return (
      <BoxContainer>
        <ExtField
          id="gov_number"
          type="string"
          label="Гос. номер:"
          value={state.gov_number}
          readOnly={!IS_CREATING}
          onChange={props.handleChange}
          error={errors.gov_number}
          boundKeys="gov_number"
          disabled={!props.isPermitted}
          inline
        />
        {
          !IS_CREATING
            ? (
              <ExtField
                type="string"
                label="Марка:"
                value={state.marka}
                readOnly
                inline
              />
            )
            : (
              <FieldCarsConditionsCarMarka
                value={state.marka}
                error={errors.marka}

                handleChange={props.handleChange}
                isPermitted={props.isPermitted}
                page={props.page}
                path={props.path}
              />
            )
        }
        {
          !IS_CREATING
            ? (
              <ExtField
                type="string"
                label="Модель:"
                value={state.model}
                readOnly
                inline
              />
            )
            : (
              <FieldCarsConditionsCarModel
                value={state.model}
                error={errors.model}

                handleChange={props.handleChange}
                isPermitted={props.isPermitted}
                page={props.page}
                path={props.path}
              />
            )
        }
        {
          !IS_CREATING
            ? (
              <ExtField
                type="string"
                label="Тип ТС:"
                value={state.type}
                readOnly
                inline
              />
            )
            : (
              <FieldCarsConditionsCarType
                value={state.type}
                error={errors.type}

                handleChange={props.handleChange}
                isPermitted={props.isPermitted}
                page={props.page}
                path={props.path}
              />
            )
        }
        {
          !IS_CREATING
            ? (
              <ExtField
                type="string"
                label="Сезон:"
                value={state.season}
                readOnly
                inline
              />
            )
            : (
              <FieldCarsConditionsCarSeason
                value={state.season}
                error={errors.season}

                handleChange={props.handleChange}
                isPermitted={props.isPermitted}
                page={props.page}
                path={props.path}
              />
            )
        }
        <ExtField
          type="string"
          label="VIN:"
          value={state.vin}
          onChange={props.handleChange}
          error={errors.vin}
          boundKeys="vin"
          disabled={!props.isPermitted}
          inline
        />
        <ExtField
          type="string"
          label="Пробег на дату проведения последнего ТО:"
          value={state.odometr_fact}
          onChange={props.handleChange}
          error={errors.odometr_fact}
          boundKeys="odometr_fact"
          disabled={!props.isPermitted}
          inline
        />
        <ExtField
          type="string"
          label="Наработка м/ч на дату проведения последнего ТО:"
          value={state.motohours_fact}
          onChange={props.handleChange}
          error={errors.motohours_fact}
          boundKeys="motohours_fact"
          disabled={!props.isPermitted}
          inline
        />
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="string"
              label="Номер ОСАГО:"
              value={state.osago}
              onChange={props.handleChange}
              error={errors.osago}
              boundKeys="osago"
              disabled={!props.isPermitted}
          />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="date"
              time={false}
              label="действует до:"
              value={state.osago_finished_at}
              makeGoodFormat
              onChange={props.handleChange}
              error={errors.osago_finished_at}
              boundKeys="osago_finished_at"
              disabled={!props.isPermitted}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="string"
              label="Номер диагностической карты:"
              value={state.diagnostic_card}
              onChange={props.handleChange}
              error={errors.diagnostic_card}
              boundKeys="diagnostic_card"
              disabled={!props.isPermitted}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={6}>
            <ExtField
              type="date"
              time={false}
              label="действует до:"
              value={state.diagnostic_card_finished_at}
              makeGoodFormat
              onChange={props.handleChange}
              error={errors.diagnostic_card_finished_at}
              boundKeys="diagnostic_card_finished_at"
              disabled={!props.isPermitted}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
        <ExtField
          type="date"
          time={false}
          label="Дата прохождения последнего ТО шасси:"
          value={state.last_tech_inspection_date}
          makeGoodFormat
          onChange={props.handleChange}
          error={errors.last_tech_inspection_date}
          boundKeys="last_tech_inspection_date"
          disabled={!props.isPermitted}
        />
        <ExtField
          type="date"
          time={false}
          label="Дата прохождения последнего ТО спецоборудования:"
          value={state.last_inspection_equipment}
          makeGoodFormat
          onChange={props.handleChange}
          error={errors.last_inspection_equipment}
          boundKeys="last_inspection_equipment"
          disabled={!props.isPermitted}
        />
        {/* { DITETS-6089 попросили просто скрыть
          !IS_CREATING && state.updated_at
            ? (
              <p>ТС проверено {makeDate(state.updated_at)} в {makeTime(state.updated_at)}</p>
            )
            : (
              <DivNone />
            )
        } */}
      </BoxContainer>
    );
  },
);

export default BlockCarInfoMainData;
