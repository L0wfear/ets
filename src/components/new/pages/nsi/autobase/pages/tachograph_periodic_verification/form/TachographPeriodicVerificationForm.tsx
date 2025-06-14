import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import ExtField from 'components/@next/@ui/renderFields/Field';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import { DivNone } from 'global-styled/global-styled';
import { compose } from 'recompose';
import {
  OwnTachographProps,
  PropsTachograph,
  PropsTachographWithForm,
  StatePropsTachograph,
} from 'components/new/pages/nsi/autobase/pages/tachograph_periodic_verification/form/@types/TachographPeriodicVerificationForm';
import { connect } from 'react-redux';

import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { Tachograph } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_periodic_verification/@types';
import { getDefaultTachographElement } from './utils';
import { tachographPeriodicVerificationFormSchema } from './schema';
import tachographPermissions from '../_config-data/permissions';
import { FileField } from 'components/old/ui/input/fields';
import {
  actionUpdateTachographPeriodicVerification,
  actionCreateTachographPeriodicVerification,
  actionGetTachographVerificationReasonList,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_periodic_verification/actions';
import { ReduxState } from 'redux-main/@types/state';
import { getDatePlusSomeYears } from 'components/@next/@utils/dates/dates';
import withTachographOptions from './hoc/withTachographOptions';

const TachographPeriodicVerificationForm: React.FC<PropsTachograph> = React.memo(
  (props) => {

    const { 
      formState: state, 
      page, 
      path,
      formErrors: errors,
      IS_CREATING,
      tachographBrandNameOptions,
      tachographFactoryNumberOptions,
      tachographBrandNameList,
    } = props;
    const [
      verificationReasonOptions,
      setVerificationReasonOptions,
    ] = React.useState<Array<{ value: string | number; label: string; }>>([]);

    const isPermitted = props.isPermittedToUpdate;
    const calibrationOptions = [
      { value: 'unscheduled', label: 'Внеплановая' },
      { value: 'scheduled', label: 'Плановая' },
    ];

    const handleChangeCalibrationDate = React.useCallback((key, value) => {
      const next_calibration_date = getDatePlusSomeYears(value, 2);
      const objChange: Partial<Tachograph> = {
        next_calibration_date,
        [key]: value,
      };
      (Object.keys(objChange) as Array<keyof typeof objChange>).forEach((key) => {
        props.handleChange(key, objChange[key]);
      });
    }, []);

    React.useEffect(() => {
      (async () => {
        const tachographVerificationReasonList = await props.actionGetTachographVerificationReasonList(
          {},
          { page, path }
        );
        const tachographVerificationReasonOptions = tachographVerificationReasonList?.data.map(
          (el) => ({ value: el.id, label: el.name, rowData: el })
        ) ?? [];
        setVerificationReasonOptions(tachographVerificationReasonOptions);
      })();
    }, []);

    React.useEffect(() => {
      if (tachographBrandNameList.length) {
        const last_tachograph_installation_date = tachographBrandNameList.find((el) => el.id === state.tachograph_id)?.installed_at;
        props.handleChange('dataForValidation', {installed_at: last_tachograph_installation_date});
      }
    }, [tachographBrandNameList, state.tachograph_id]);

    const handleChangeVerificationReasonId = React.useCallback((key, value, rowData) => {
      props.handleChange({
        verification_reason_id: value,
        verification_reason_name: rowData?.label,
      });
    }, []);

    return (
      <EtsBootstrap.ModalContainer
        id="modal-tachograph"
        show
        onHide={props.hideWithoutChanges}
        bsSize="small"
      >
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{IS_CREATING ? 'Создание записи' : 'Изменение записи'}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="string"
                label="Номер поверки"
                value={state.verification_number}
                boundKeys="verification_number"
                onChange={props.handleChange}
                error={errors.verification_number}
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="date"
                label="Дата калибровки"
                value={state.calibration_date}
                boundKeys="calibration_date"
                onChange={handleChangeCalibrationDate}
                error={errors.calibration_date}
                time={false}
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="select"
                label="Тип калибровки"
                value={state.calibration_type}
                boundKeys="calibration_type"
                options={calibrationOptions}
                emptyValue={null}
                onChange={props.handleChange}
                error={errors.calibration_type}
              />
            </EtsBootstrap.Col>
            {state.calibration_type === 'unscheduled' && (
              <EtsBootstrap.Col md={6}>
                <ExtField
                  type="select"
                  label="Причина внеплановой калибровки"
                  value={state.verification_reason_id}
                  boundKeys="verification_reason_id"
                  emptyValue={null}
                  options={verificationReasonOptions}
                  onChange={handleChangeVerificationReasonId}
                  error={errors.verification_reason_id}
                />
              </EtsBootstrap.Col>
            )}
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="date"
                label="Дата следующей калибровки (план)"
                readOnly
                value={state.next_calibration_date}
                boundKeys="next_calibration_date"
                error={errors.next_calibration_date}
                disabled
                time={false}
              />
            </EtsBootstrap.Col>
            {state.verification_reason_id === 7 && (
              <EtsBootstrap.Col md={6}>
                <ExtField
                  type="string"
                  label="Другое"
                  value={state.other_reason}
                  boundKeys="other_reason"
                  onChange={props.handleChange}
                  error={errors.other_reason}
                />
              </EtsBootstrap.Col>
            )}
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="select"
                label="Марка тахографа"
                value={state.tachograph_brand_id}
                boundKeys="tachograph_brand_id"
                options={tachographBrandNameOptions}
                onChange={props.handleChange}
                error={errors.tachograph_brand_id}
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="select"
                label="Заводской номер тахографа"
                value={state.factory_number}
                boundKeys="factory_number"
                options={tachographFactoryNumberOptions}
                onChange={props.handleChange}
                error={errors.factory_number}
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="string"
                label="Рег. номер ТС"
                disabled
                value={state.gov_number}
                boundKeys="gov_number"
                error={errors.gov_number}
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="string"
                label="Комментарий"
                value={state.comment}
                boundKeys="comment"
                onChange={props.handleChange}
                error={errors.comment}
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <FileField
                label="Сертификат"
                type="file"
                formats=".pdf"
                value={state.files}
                onChange={props.handleChange}
                boundKeys="files"
                error={errors.files}
                kind={'tachograph_periodic_verification'}
                askBefoeRemove
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          {isPermitted ? (
            <EtsBootstrap.Button disabled={!props.canSave} onClick={props.defaultSubmit}>
              Сохранить
            </EtsBootstrap.Button>
          ) : (
            <DivNone />
          )}
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  }
); 
export default compose<PropsTachograph, OwnTachographProps>(
  connect<StatePropsTachograph, {}, OwnTachographProps, ReduxState>(
    null,
    { actionGetTachographVerificationReasonList }
  ),
  withSearch,
  withForm<PropsTachographWithForm, Tachograph>({
    uniqField: 'id',
    createAction: actionCreateTachographPeriodicVerification,
    updateAction: actionUpdateTachographPeriodicVerification,
    mergeElement: (props) => {
      return getDefaultTachographElement(props.element);
    },
    schema: tachographPeriodicVerificationFormSchema,
    permissions: tachographPermissions,
  }),
  withTachographOptions,
)(TachographPeriodicVerificationForm);
