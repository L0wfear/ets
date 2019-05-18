import * as React from 'react';
import { ExtField } from 'components/ui/new/field/ExtField';
import { CarWrap } from '../../../../../@types/CarForm';
import { FormWithHandleChange } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { compose } from 'recompose';
import { componentsToDriver } from './component_to_select';
import { ReduxState } from 'redux-main/@types/state';
import { employeeDriverGetSetDriver } from 'redux-main/reducers/modules/employee/driver/actions';
import { employeeEmployeeGetSetEmployee } from 'redux-main/reducers/modules/employee/employee/actions';
import useCarDriversList from './useCarDriversList';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type FieldSelectDriverCarStateProps = {};
type FieldSelectDriverCarDispatchProps = {
  employeeEmployeeGetSetEmployee: HandleThunkActionCreator<typeof employeeEmployeeGetSetEmployee>;
  employeeDriverGetSetDriver: HandleThunkActionCreator<typeof employeeDriverGetSetDriver>;
};

type FieldSelectDriverCarOwnProps = {
  gov_number: CarWrap['gov_number'];
  drivers_data: CarWrap['drivers_data']
  onChange: FormWithHandleChange<CarWrap>;
  isPermitted: boolean;
  page: string;
  path: string;
};

type FieldSelectDriverCarMergedProps = (
  FieldSelectDriverCarStateProps
  & FieldSelectDriverCarDispatchProps
  & FieldSelectDriverCarOwnProps
);

type FieldSelectDriverCarProps = FieldSelectDriverCarMergedProps;

const FieldSelectDriverCar: React.FC<FieldSelectDriverCarProps> = React.memo(
  (props) => {
    const {
      drivers_data,
      gov_number,

      page, path,
    } = props;

    const {
      primaryDriverOptions,
      secondaryDriverOptions,
    } = useCarDriversList(
      drivers_data,
      gov_number,
      page,
      path,
      props.employeeEmployeeGetSetEmployee,
      props.employeeDriverGetSetDriver,
    );

    const onChange = React.useCallback(
      (key, value) => {
        props.onChange({
          drivers_data: {
            ...drivers_data,
            [key]: value,
          },
        });
      },
      [drivers_data],
    );

    return (
      <EtsBootstrap.Row>
        <EtsBootstrap.Col md={6}>
          <ExtField
            id="primary_drivers"
            type="select"
            multi
            label="Основной водитель/машинист"
            options={primaryDriverOptions}
            value={drivers_data.primary_drivers}
            onChange={onChange}
            boundKeys="primary_drivers"
            disabled={!props.isPermitted}
            components={componentsToDriver}
          />
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={6}>
          <ExtField
            id="secondary_drivers"
            type="select"
            multi
            label="Вторичный водитель/машинист"
            options={secondaryDriverOptions}
            value={drivers_data.secondary_drivers}
            onChange={onChange}
            boundKeys="secondary_drivers"
            disabled={!props.isPermitted}
            components={componentsToDriver}
          />
        </EtsBootstrap.Col>
      </EtsBootstrap.Row>
    );
  },
);

export default compose<FieldSelectDriverCarProps, FieldSelectDriverCarOwnProps>(
  connect<FieldSelectDriverCarStateProps, FieldSelectDriverCarDispatchProps, FieldSelectDriverCarOwnProps, ReduxState>(
    null,
    (dispatch: any) => ({
      employeeEmployeeGetSetEmployee: (...arg) => (
        dispatch(
          employeeEmployeeGetSetEmployee(...arg),
        )
      ),
      employeeDriverGetSetDriver: (...arg) => (
        dispatch(
          employeeDriverGetSetDriver(...arg),
        )
      ),
    }),
  ),
)(FieldSelectDriverCar);
