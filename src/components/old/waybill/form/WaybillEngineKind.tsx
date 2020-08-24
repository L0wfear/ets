/* eslint-disable no-tabs */
import * as React from 'react';
import { WaybillProps } from 'components/old/waybill/WaybillForm';
import styled from 'styled-components';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { get } from 'lodash';
import { GAS_ENGINE_TYPE_ID } from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/main_tabs/info/inside_fields/engine_data/FieldSelectEngine';
import UseEngineKindsList from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/main_tabs/info/inside_fields/engine_data/useEngineKindsList';

type Props = {
	carIndex: WaybillProps['carIndex'];
	car_id: number;
	engine_kind_ids: Car['engine_kind_ids'];
	waybillStatus: {
		IS_CREATING: boolean;
		IS_ACTIVE: boolean;
		IS_DRAFT: boolean;
		IS_CLOSED: boolean;
		IS_DELETE: boolean;
	};
  handleChange: (field: string, e: any, index?: number) => any;
  handleMultipleChange: (fields: any) => void;
  setIsGasKind: (isGasKind: boolean) => any;
  origFormState: WaybillProps['formState'];
	waybillFormState: WaybillProps['formState']; // state in render WaybillForm
};

export const WaybillEngineKindStyled = styled.div`
`;

/*
Обработать кейсы:
1) Черновик открыт, изменили вид двигателя, нажали на созранить в ПЛ
ФР: при сохранении ПЛ бек ругнется на несоответствие типа двигателя и тачки, пользаку надо обновить тип двигателя
ОР: Фронт каким-то образом, должен обновлять тип двигателя до или после соъранения
2) Заполнить блок со спецоборудованием в ПЛ -> Сохранить -> У ТС поменять на газ -> Открыть ПЛ
ОР:
- На ТС установлено спецоборудование установленно на 'Нет' и задисейблено
- Нет всплывашки, что очиститься блок спецоборудования
- Значения в блоке спецоборудования сброшены
- Карточка сохраняется при нажатии на сохранить
3)
*/

const WaybillEngineKind: React.FC<Props> = React.memo(
  (props) => {
    const canChangeEngineKindIds = Boolean(props.waybillStatus?.IS_CREATING || props.waybillStatus?.IS_DRAFT);
    const engineKindsOptions = UseEngineKindsList(true, {page: null, path: null}, 'waybillForm' );
    const engineKindIdsByStatus = React.useMemo(
      () => canChangeEngineKindIds
        ? get(props.carIndex, `${props.car_id}.engine_kind_ids`, [])
        : props.engine_kind_ids,
      [
        props.carIndex,
        props.car_id,
        props.engine_kind_ids,
        canChangeEngineKindIds,
      ]
    );
		
    React.useEffect(() => {
      if(canChangeEngineKindIds){
        props.handleChange('engine_kind_ids', engineKindIdsByStatus); // <<< неперетираются старые значения, если открыть карточку без газа, при сохранении engine_kind_ids: [1, 2]
      }
    }, [
      props.car_id,
      canChangeEngineKindIds,
      props.handleChange,
      props.carIndex,
      props.origFormState,
      props.waybillFormState.gas_fuel_type,
    ]);

    const fuelKind = React.useMemo(
      () => (engineKindsOptions.find( (elem) => engineKindIdsByStatus.includes(elem.value) )?.label || '-'),
      [engineKindIdsByStatus, engineKindsOptions]);

    const isGasKind = React.useMemo(
      () => engineKindIdsByStatus.includes(GAS_ENGINE_TYPE_ID),
      [engineKindIdsByStatus]);
    
    React.useEffect(() => {
      props.setIsGasKind(isGasKind);
    }, [ isGasKind ]);

    return <WaybillEngineKindStyled>
      <b>Тип двигателя: </b> { fuelKind } <br/>
      <b>На ТС установлено газовое оборудование: </b> { isGasKind ? 'Да' : 'нет' }
      {/* <br/> <b>Можно поменять ВИД двигателя в ПЛ???: </b> { canChangeEngineKindIds ? 'Да' : 'нет' } */}
    </WaybillEngineKindStyled>;
  },
);

export default WaybillEngineKind;
