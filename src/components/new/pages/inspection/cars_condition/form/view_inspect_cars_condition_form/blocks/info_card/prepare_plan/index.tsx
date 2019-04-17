import * as React from 'react';
// import { ExtField } from 'components/ui/new/field/ExtField';
// import { get } from 'lodash';
// import { DivNone } from 'global-styled/global-styled';
// import { Button } from 'react-bootstrap';
// import { ButtonGroupWrapperMargin } from 'global-styled/global-styled';
import DataTableInput from 'components/ui/table/DataTableInput/DataTableInput';
import * as PrepareCars from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/prepare_plan/table-schema-prepare-cars';
import * as PrepareAgregat from 'components/new/pages/inspection/cars_condition/form/view_inspect_cars_condition_form/blocks/info_card/prepare_plan/table-schema-prepare-agregat';
import { CustomTableWrapper } from './styled/styled';
import { promiseLoadCarFuncTypess } from 'redux-main/reducers/modules/autobase/car_func_types/promise';

export type PreparePlanProps = {
  page: string;
  types_cars: any;
  canSavePreparePlanHandler: any;
  prepareListHandler: any;
};

const PreparePlan: React.FC<PreparePlanProps> = (props) => {

  const [prepareTsList, setPrepareTsList] = React.useState([]);
  const [prepareAgregatList, setPrepareAgregatList] = React.useState([]);
  const [typesListOpt, setTypesListOpt] = React.useState([]);
  const [canSavePrepareCars, setCanSavePrepareCars] = React.useState(false);
  const [canSavePrepareAgregat, setCanSavePrepareAgregat] = React.useState(false);
  // componentDidMount
  React.useEffect(() => {
    const prepareTsListOpt = props.types_cars.map((elem, index) =>
      ({
        ...elem,
        customId: index + 1,
        isDefaultVal: true, // для renderers
      }),
    );

    promiseLoadCarFuncTypess().then(({data}) => {
      setTypesListOpt(data.map(
        (rowData) => ({
          label: rowData.short_name,
          value: rowData.short_name,
          rowData,
        }), // Id с бека нет, делаем такую фигню
      ));
    });
    setPrepareTsList(prepareTsListOpt);
  }, []);

  React.useEffect( () => {
    props.canSavePreparePlanHandler(canSavePrepareCars && canSavePrepareAgregat);
  }, [canSavePrepareCars, canSavePrepareAgregat]);

  React.useEffect( () => {
    props.prepareListHandler({prepareTsList, prepareAgregatList});
  }, [prepareTsList, prepareAgregatList]);

  const handleValidityPrepareCars = ({ isValidInput }) =>
    setCanSavePrepareCars(isValidInput);

  const handleValidityPrepareAgregat = ({ isValidInput }) =>
    setCanSavePrepareAgregat(isValidInput);

  // console.log('preparePlan === ', {prepareTsList, props, canSavePrepareCars, typesListOpt});

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
          <CustomTableWrapper>
            <DataTableInput
              tableSchema={PrepareCars.meta}
              renderers={PrepareCars.renderers}
              validationSchema={PrepareCars.validationSchema}
              addButtonLabel="Добавить тип"
              removeButtonLable="Удалить тип"
              stackOrder
              onChange={setPrepareTsList}
              inputList={prepareTsList || []}
              path="cars_condition-prepare_plan"
              isPermitted={true}
              onValidation={handleValidityPrepareCars}
              selectField="customId"
              typesListOpt={typesListOpt}
              {...props}
            />
          </CustomTableWrapper>
          <h3>
            План и проверка готовности к сезону прицепных, навесных и уборочных агрегатов
          </h3>
          <CustomTableWrapper>
            <DataTableInput
              tableSchema={PrepareAgregat.meta}
              renderers={PrepareAgregat.renderers}
              validationSchema={PrepareAgregat.validationSchema}
              addButtonLabel="Добавить тип"
              removeButtonLable="Удалить тип"
              stackOrder
              onChange={setPrepareAgregatList}
              inputList={prepareAgregatList || []}
              path="cars_condition-prepare_plan"
              isPermitted={true}
              onValidation={handleValidityPrepareAgregat}
              selectField="customId"
              {...props}
            />
          </CustomTableWrapper>
        </div>
      }
    </>
  );
};

export default PreparePlan;
