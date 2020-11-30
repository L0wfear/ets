import * as React from 'react';
import ExtField from 'components/@next/@ui/renderFields/Field';
import {
  FormWithHandleChange,
  FormWithHandleChangeBoolean,
} from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { TachographListWithOuterProps } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_registry/@types';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import styled from 'styled-components';
import { getSessionStructuresOptions, getSessionUserStructureId } from 'redux-main/reducers/modules/session/selectors';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import TachographToVehicleBlockComponent from './vehicle-block/TachographToVehicleBlock';
import { onChangeWithKeys } from 'components/old/compositions/hoc';
import { actionGetTachographBrandList } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_brand/actions';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

const TachographToVehicleBlock: any = onChangeWithKeys(TachographToVehicleBlockComponent);

const MarginRow = styled(EtsBootstrap.Row)`
  margin: 20px 10px;
`;

type MainInfoTab = {
  isPermitted: boolean;
  formState: TachographListWithOuterProps;
  formErrors: any;
  onChange: FormWithHandleChange<TachographListWithOuterProps>;
  onChangeBoolean: FormWithHandleChangeBoolean<TachographListWithOuterProps>;
  page: string;
  path: string;
  STRUCTURES: ReturnType<typeof getSessionStructuresOptions>;
  structure_id: number;
};

const MainInfoTab: React.FC<MainInfoTab> = React.memo((props) => {
  const { formErrors: errors, formState: state, onChange, isPermitted, structure_id, page } = props;
  const dispatch = etsUseDispatch();
  const [tachographBrandList, setTachographBrandList] = React.useState([]);
  React.useEffect(() => {
    (async () => {
      const tachographBrandList = await (
        await dispatch(actionGetTachographBrandList({ page }))
      ).data.map((el) => ({ value: el.id, label: el.name }));
      setTachographBrandList(tachographBrandList);
    })();
  }, []);

  React.useEffect(() => {
    if (structure_id) {
      onChange('company_structure_id', structure_id);
    }
  }, [structure_id]);

  return (
    <MarginRow>
      <EtsBootstrap.Col md={12}>
        <EtsBootstrap.Row>
          <EtsBootstrap.Col md={4}>
            <ExtField
              type="select"
              label="Марка"
              value={state.tachograph_brand_id}
              boundKeys="tachograph_brand_id"
              error={errors.tachograph_brand_id}
              onChange={onChange}
              disabled={!isPermitted}
              options={tachographBrandList}
            />
            <ExtField
              type="string"
              label="Комментарий"
              value={state.comment}
              boundKeys="comment"
              error={errors.comment}
              onChange={onChange}
              disabled={!isPermitted}
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={4}>
            <ExtField
              type="string"
              label="Заводской номер"
              value={state.factory_number}
              boundKeys="factory_number"
              error={errors.factory_number}
              onChange={onChange}
              disabled={!isPermitted}
              toUpperCase
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={4}>
            <ExtField
              type="select"
              label="Подразделение"
              options={props.STRUCTURES}
              value={state.company_structure_id}
              onChange={onChange}
              boundKeys="company_structure_id"
              error={errors.company_structure_id}
              disabled
            />
          </EtsBootstrap.Col>
          <EtsBootstrap.Col md={12}>
            <TachographToVehicleBlock
              onChange={onChange}
              boundKeys="tachograph_on_car"
              inputList={state.tachograph_on_car}
              outerValidate
              errors={errors.tachograph_on_car}
              disabled={!isPermitted}
              selectField="customId"
              isPermitted={isPermitted}
              tableTitle="Транспортное средство, на котором установлен тахограф"
              page={props.page}
              path={props.path}
            />
          </EtsBootstrap.Col>
        </EtsBootstrap.Row>
      </EtsBootstrap.Col>
    </MarginRow>
  );
});

export default connect<any, any, any, ReduxState>(
  (state) => ({
    STRUCTURES: getSessionStructuresOptions(state),
    structure_id: getSessionUserStructureId(state),
  }),
)(MainInfoTab);
