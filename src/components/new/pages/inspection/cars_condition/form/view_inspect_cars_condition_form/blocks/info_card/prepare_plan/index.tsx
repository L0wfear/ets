import * as React from 'react';
// import { ExtField } from 'components/ui/new/field/ExtField';
// import { get } from 'lodash';
// import { DivNone } from 'global-styled/global-styled';
// import { Button } from 'react-bootstrap';
// import { ButtonGroupWrapperMargin } from 'global-styled/global-styled';
import DataTableInput from 'components/ui/table/DataTableInput/DataTableInput';
import { meta, renderers, validationSchema } from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/prepare_plan/table-schema';
import { CustomTableWrapper } from './styled/styled';

export type PreparePlanProps = {
  page: string;
};

const PreparePlan: React.FC<PreparePlanProps> = (props) => {

  const [prepareTsList, setPrepareTsList] = React.useState([]);
  const [canSave, setCanSave] = React.useState(false);

  const handleValidity = ({ isValidInput }) =>
    setCanSave(isValidInput);

  return(
    <>
      {
        <div>
          <h2>
            План подготовки
          </h2>
          <h3>
            План подготовки ТС
          </h3>
          {/* <ButtonGroupWrapperMargin>
            <Button id="block_info_card-add_type" onClick={() => alert('Добавить тип')} >
              Добавить тип
            </Button>
            <Button id="block_info_card-remove_type" onClick={() => alert('Удалить тип')} >
              Удалить тип
            </Button>
          </ButtonGroupWrapperMargin> */}
          <CustomTableWrapper>
            <DataTableInput
              tableSchema={meta}
              renderers={renderers}
              validationSchema={validationSchema}
              addButtonLabel="Добавить тип"
              removeButtonLable="Удалить тип"
              stackOrder
              onChange={setPrepareTsList}
              inputList={prepareTsList || []}
              path="cars_condition-prepare_plan"
              isPermitted={true}
              onValidation={handleValidity}
              {...props}
            />
          </CustomTableWrapper>
        </div>
      }
    </>
  );
};

export default PreparePlan;
