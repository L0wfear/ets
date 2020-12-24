import * as React from 'react';
import {
  FormWithHandleChange,
  FormWithHandleChangeBoolean,
} from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { TachographListWithOuterProps } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_registry/@types';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import styled from 'styled-components';
import TachographReplacementSkziBlockComponent from './TachographReplacementSkziBlock';
import { onChangeWithKeys } from 'components/old/compositions/hoc';

const TachographReplacementSkziBlock: any = onChangeWithKeys(
  TachographReplacementSkziBlockComponent
);

const MarginRow = styled(EtsBootstrap.Row)`
  margin: 20px 10px;
`;

type TachographReplacementSkziTab = {
  isPermitted: boolean;
  formState: TachographListWithOuterProps;
  formErrors: any;
  onChange: FormWithHandleChange<TachographListWithOuterProps>;
  onChangeBoolean: FormWithHandleChangeBoolean<TachographListWithOuterProps>;
  page: string;
  path: string;
};

const TachographReplacementSkziTab: React.FC<TachographReplacementSkziTab> = React.memo(
  (props) => {
    const {
      formErrors: errors,
      formState: state,
      onChange,
      isPermitted,
    } = props;

    return (
      <MarginRow>
        <EtsBootstrap.Col md={12}>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <TachographReplacementSkziBlock
                onChange={onChange}
                boundKeys="tachograph_replacement_skzi"
                inputList={state.tachograph_replacement_skzi}
                outerValidate
                errors={errors.tachograph_replacement_skzi}
                disabled={!isPermitted}
                disabledAddButton={!isPermitted || state.tachograph_on_car.length === 0}
                selectField="customId"
                isPermitted={isPermitted}
                tableTitle="Замена блока СКЗИ"
                page={props.page}
                path={props.path}
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </EtsBootstrap.Col>
      </MarginRow>
    );
  }
);

export default TachographReplacementSkziTab;
