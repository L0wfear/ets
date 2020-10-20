import * as React from 'react';
import {
  FormWithHandleChange,
  FormWithHandleChangeBoolean,
} from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { TachographListWithOuterProps } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_registry/@types';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import styled from 'styled-components';
import TachographDataReadingBlockComponent from './TachographDataReadingBlock';
import { onChangeWithKeys } from 'components/old/compositions/hoc';

const TachographDataReadingBlock: any = onChangeWithKeys(
  TachographDataReadingBlockComponent
);

const MarginRow = styled(EtsBootstrap.Row)`
  margin: 20px 10px;
`;

type TachographDataReadingTab = {
  isPermitted: boolean;
  formState: TachographListWithOuterProps;
  formErrors: any;
  onChange: FormWithHandleChange<TachographListWithOuterProps>;
  onChangeBoolean: FormWithHandleChangeBoolean<TachographListWithOuterProps>;
  page: string;
  path: string;
};

const TachographDataReadingTab: React.FC<TachographDataReadingTab> = React.memo(
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
              <TachographDataReadingBlock
                onChange={onChange}
                boundKeys="tachograph_data_reading"
                inputList={state.tachograph_data_reading}
                outerValidate
                errors={errors.tachograph_data_reading}
                disabled={!isPermitted}
                selectField="customId"
                isPermitted={isPermitted}
                tableTitle="Даты считывания данных с тахографа"
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

export default TachographDataReadingTab;
