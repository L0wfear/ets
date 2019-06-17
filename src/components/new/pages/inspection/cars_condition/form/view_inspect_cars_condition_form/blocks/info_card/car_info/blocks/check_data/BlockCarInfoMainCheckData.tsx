import * as React from 'react';
import { BoxContainer } from 'components/new/pages/inspection/autobase/components/data/styled/InspectionAutobaseData';
import { BlockCarInfoProps } from '../../@types/BlockCarInfo';
import { ExtField } from 'components/ui/new/field/ExtField';
import { stateExploitationOptions } from './options';
import { get } from 'lodash';
import { filedToCheckDefectDataOuter, filedToCheckDefectDataFirstStart, filedToCheckDefectDataDocs, filedToCheckDefectDataOtherSecond, filedToCheckDefectDataOtherFirst } from './filedToCheckCarInfoMainCheckData';
import BlockCarsConditionCarSelectPhotoDefect from './photo_defect/BlockCarsConditionCarSelectPhotoDefect';
import FieldCarsConditionsCarSelectFactStatus from './fact_status_and_other/FieldCarsConditionsCarSelectFactStatus';
import IAVisibleWarningContainer from 'components/new/pages/inspection/container/filed_to_check/IAVisibleWarningContainer';

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
          id="mileage"
          type="number"
          label="Пробег на дату проведения проверки:"
          value={state.mileage}
          error={errors.mileage}
          onChange={props.handleChange}
          boundKeys="mileage"
          disabled={!props.isPermitted}
        />
        <ExtField
          id="motohours"
          type="number"
          label="Наработка м/ч на дату проверки:"
          value={state.motohours}
          error={errors.motohours}
          onChange={props.handleChange}
          boundKeys="motohours"
          disabled={!props.isPermitted}
        />
        <ExtField
          id="data-comments"
          type="text"
          label="Замечания:"
          value={state.data.comments}
          error={errors.data.comments}
          onChange={handleChangeData}
          boundKeys="comments"
          disabled={!props.isPermitted}
        />
        <h5>Выявленные дефекты ТС при внешнем осмотре:</h5>
        <IAVisibleWarningContainer
          onChange={handleChangeDataForIA}
          data={state.data}
          errors={errors.data}
          isPermitted={isPermitted}
          filedToCheck={filedToCheckDefectDataOuter}
        />
        <br />
        <h5>Выявленные дефекты при пробном пуске ТС:</h5>
        <IAVisibleWarningContainer
          onChange={handleChangeDataForIA}
          data={state.data}
          errors={errors.data}
          isPermitted={isPermitted}
          filedToCheck={filedToCheckDefectDataFirstStart}
        />
        <br />
        <h5>Проверка документации:</h5>
        <IAVisibleWarningContainer
          onChange={handleChangeDataForIA}
          data={state.data}
          errors={errors.data}
          isPermitted={isPermitted}
          filedToCheck={filedToCheckDefectDataDocs}
        />
        <br />
        <h5>Прочее:</h5>
        <IAVisibleWarningContainer
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
        <IAVisibleWarningContainer
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
