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
import { Tachograph, TachographListElement } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_periodic_verification/@types';
import { getDefaultTachographElement } from './utils';
import { tachographPeriodicVerificationFormSchema } from './schema';
import tachographPermissions from '../_config-data/permissions';
import { FileField } from 'components/old/ui/input/fields';
import {
  actionUpdateTachographPeriodicVerification,
  actionCreateTachographPeriodicVerification,
  actionGetTachographsList,
  actionGetTachographVerificationReasonList,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_periodic_verification/actions';
import { ReduxState } from 'redux-main/@types/state';
import { getDatePlusSomeYears } from 'components/@next/@utils/dates/dates';
import { uniqBy } from 'lodash';

const TachographPeriodicVerificationForm: React.FC<PropsTachograph> = React.memo(
  (props) => {

    const { 
      formState: state, 
      page, 
      path,
      formErrors: errors,
    } = props;
    const [
      verificationReasonOptions,
      setVerificationReasonOptions,
    ] = React.useState<Array<{ value: string | number; label: string; }>>([]);
    const [
      tachographBrandNameOptions,
      setTachographBrandNameOptions,
    ] = React.useState<Array<{ value: string | number; label: string; }>>([]);
    const [
      tachographFactoryNumberOptions,
      setTachographFactoryNumberOptions,
    ] = React.useState<Array<{ value: string | number; label: string; }>>([]);
    const [
      tachographBrandNameList,
      setTachographBrandNameList,
    ] = React.useState<Array<TachographListElement>>([]);

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
        const tachographBrandNameList = await props.actionGetTachographsList(
          {},
          { page }
        );
        const tachographVerificationReasonList = await props.actionGetTachographVerificationReasonList(
          {},
          { page }
        );
        setTachographBrandNameList(tachographBrandNameList.data);
        const tachographVerificationReasonOptions = tachographVerificationReasonList?.data.map(
          (el) => ({ value: el.id, label: el.name })
        ) ?? [];
        setVerificationReasonOptions(tachographVerificationReasonOptions);
      })();
    }, []);

    React.useEffect(() => {
      if (tachographBrandNameList.length) {
        const last_tachograph_installation_date = tachographBrandNameList[0].installed_at;
        const tachographBrandNameOptions = uniqBy(
          tachographBrandNameList?.map((rowData) => ({
            value: rowData.tachograph_brand_id,
            label: rowData.tachograph_brand_name,
            rowData
          })),
          'label',
        ) ?? [];
        setTachographBrandNameOptions(tachographBrandNameOptions);
        props.handleChange('dataForValidation', {installed_at: last_tachograph_installation_date});
      }
    }, [tachographBrandNameList]);

    React.useEffect(() => {
      if (tachographBrandNameList.length) {
        if (!state.tachograph_id && state.factory_number) {
          const tachograph_id = tachographBrandNameList.find(
            (el) => el.factory_number === state.factory_number
          )?.tachograph_brand_id;
          props.handleChange('tachograph_id', tachograph_id);
        }
        if (state.tachograph_id) {
          const tachographFactoryNumberOptions = tachographBrandNameList
            .filter((el) => el.tachograph_brand_id === state.tachograph_id)
            ?.map((el) => ({
              value: el.factory_number,
              label: el.factory_number,
            }));
          setTachographFactoryNumberOptions(tachographFactoryNumberOptions);
          if (!tachographFactoryNumberOptions.find((el) => el.value === state.factory_number)) {
            props.handleChange('factory_number', null);
          }
        } else {
          const tachographFactoryNumberOptions = tachographBrandNameList?.map(
            (el) => ({ value: el.factory_number, label: el.factory_number })
          );
          setTachographFactoryNumberOptions(tachographFactoryNumberOptions);
        }
      }
    }, [state.tachograph_id, state.factory_number, tachographBrandNameList]);

    return (
      <EtsBootstrap.ModalContainer
        id="modal-tachograph"
        show
        onHide={props.hideWithoutChanges}
        bsSize="small"
      >
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>Изменение записи</EtsBootstrap.ModalTitle>
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
                  onChange={props.handleChange}
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
                value={state.tachograph_id}
                boundKeys="tachograph_id"
                options={tachographBrandNameOptions}
                onChange={props.handleChange}
                error={errors.tachograph_id}
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
    { actionGetTachographsList, actionGetTachographVerificationReasonList }
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
  })
)(TachographPeriodicVerificationForm);
