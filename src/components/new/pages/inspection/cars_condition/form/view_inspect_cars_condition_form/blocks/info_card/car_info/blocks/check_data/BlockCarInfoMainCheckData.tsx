import * as React from 'react';
import { BoxContainer } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';
import { BlockCarInfoProps } from '../../@types/BlockCarInfo';
import { ExtField } from 'components/ui/new/field/ExtField';
import { stateExploitationOptions } from './options';
import { get } from 'lodash';
import IAVisibleWarning from 'components/new/pages/inspection/autobase/components/vsible_warning/IAVisibleWarning';
import { filedToCheckDefectDataOuter, filedToCheckDefectDataFirstStart, filedToCheckDefectDataDocs, filedToCheckDefectDataOtherSecond, filedToCheckDefectDataOtherFirst } from './filedToCheckCarInfoMainCheckData';
import BlockCarsConditionCarSelectPhotoDefect from './photo_defect/BlockCarsConditionCarSelectPhotoDefect';
import FieldCarsConditionsCarSelectFactStatus from './fact_status_and_other/FieldCarsConditionsCarSelectFactStatus';

type BlockCarInfoMainCheckDataProps = (
  {
    isPermitted: boolean;
  }
) & Pick<BlockCarInfoProps, 'IS_CREATING' | 'formState' | 'formErrors' | 'handleChange'>;

const BlockCarInfoMainCheckData: React.FC<BlockCarInfoMainCheckDataProps> = React.memo(
  (props) => {
    const {
      formState: state,
      formErrors: errors,
      isPermitted,
    } = props;

    const handleChangeDataForIA = React.useCallback(
      (data) => {
        props.handleChange({
          data,
        });
      },
      [state.data, props.handleChange],
    );

    const handleChangeData = React.useCallback(
      (key, event) => {
        props.handleChange({
          data: {
            ...state.data,
            [key]: get(event, 'target.value', event),
          },
        });
      },
      [state.data, props.handleChange],
    );

    const handleChangeDataBoolean = React.useCallback(
      (key, event) => {
        handleChangeData(key, get(event, 'target.checked', false));
      },
      [handleChangeData],
    );

    return (
      <BoxContainer>
        <h4>Проверка техники и документации</h4>
        <FieldCarsConditionsCarSelectFactStatus
          formState={state}
          formErrors={errors}
          handleChange={props.handleChange}
          isPermitted={isPermitted}
        />
        <ExtField
          id="data-no_status_docs"
          type="boolean"
          label="Отсутствие подтверждающих <статус> документов"
          value={state.data.no_status_docs}
          error={errors.data.no_status_docs}
          onChange={handleChangeDataBoolean}
          boundKeys="no_status_docs"
          className="checkbox-input flex-reverse"
          disabled={!props.isPermitted}
        />
        <ExtField
          id="data-fact_mileage"
          type="number"
          label="Фактический пробег / счётчик моточасов:"
          value={state.data.fact_mileage}
          error={errors.data.fact_mileage}
          onChange={handleChangeData}
          boundKeys="fact_mileage"
          disabled={!props.isPermitted}
        />
        <h5>Выявленные дефекты ТС при внешнем осмотре:</h5>
        <IAVisibleWarning
          onChange={handleChangeDataForIA}
          data={state.data}
          errors={errors.data}
          isPermitted={isPermitted}
          filedToCheck={filedToCheckDefectDataOuter}
        />
        <br />
        <h5>Выявленные дефекты при пробном пуске ТС:</h5>
        <IAVisibleWarning
          onChange={handleChangeDataForIA}
          data={state.data}
          errors={errors.data}
          isPermitted={isPermitted}
          filedToCheck={filedToCheckDefectDataFirstStart}
        />
        <br />
        <h5>Проверка документации:</h5>
        <IAVisibleWarning
          onChange={handleChangeDataForIA}
          data={state.data}
          errors={errors.data}
          isPermitted={isPermitted}
          filedToCheck={filedToCheckDefectDataDocs}
        />
        <br />
        <h5>Прочее:</h5>
        <IAVisibleWarning
          onChange={handleChangeDataForIA}
          data={state.data}
          errors={errors.data}
          isPermitted={isPermitted}
          filedToCheck={filedToCheckDefectDataOtherFirst}
        />
        <ExtField
          id="state_exploitation"
          type="select"
          label="Состояние эксплуатации:"
          clearable={false}
          value={state.state_exploitation}
          error={errors.state_exploitation}
          options={stateExploitationOptions}
          onChange={props.handleChange}
          boundKeys="state_exploitation"
          disabled={!isPermitted}
        />
        <IAVisibleWarning
          onChange={handleChangeDataForIA}
          data={state.data}
          errors={errors.data}
          isPermitted={isPermitted}
          filedToCheck={filedToCheckDefectDataOtherSecond}
        />
        <BlockCarsConditionCarSelectPhotoDefect
          files={state.files}
          onChange={props.handleChange}
          isPermitted={isPermitted}
        />
      </BoxContainer>
    );
  },
);

export default BlockCarInfoMainCheckData;
