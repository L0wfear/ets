import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import ExtField from 'components/@next/@ui/renderFields/Field';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import { DivNone } from 'global-styled/global-styled';
import { compose } from 'recompose';
import {
  OwnTachographProps,
  PropsTachograph,
  StatePropsTachograph,
  PropsTachographWithForm,
} from 'components/new/pages/nsi/autobase/pages/tachograph_periodic_verification/form/@types/TachographPeriodicVerificationForm';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getAutobaseState } from 'redux-main/reducers/selectors';
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
  actionGetTachographsList,
  actionGetTachographVerificationReasonList,
} from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_periodic_verification/actions';

const TachographPeriodicVerificationForm: React.FC<PropsTachograph> = React.memo(
  (props) => {
    const { formState: state, page, path } = props;
    const [
      verificationReasonOptions,
      setVerificationReasonOptions,
    ] = React.useState<Array<{ value: string | number; label: string; }>>([]);
    const [
      tachographBrandNameOptions,
      setTachographBrandNameOptions,
    ] = React.useState<Array<{ value: string | number; label: string; }>>([]);
    const [
      tachographGovNumberOptions,
      setTachographGovNumberOptions,
    ] = React.useState<Array<{ value: string | number; label: string; }>>([]);
    const [
      tachographFactoryNumberOptions,
      setTachographFactoryNumberOptions,
    ] = React.useState<Array<{ value: string | number; label: string; }>>([]);

    const isPermitted = props.isPermittedToUpdate;
    const calibrationOptions = [
      { value: 'unscheduled', label: 'Внеплановая' },
      { value: 'scheduled', label: 'Плановая' },
    ];

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
        const tachographVerificationReasonOptions = tachographVerificationReasonList.data.map(
          (el) => ({ value: el.id, label: el.name })
        );
        const tachographBrandNameOptions = tachographBrandNameList.data.map(
          (el) => ({ value: el.id, label: el.name })
        );
        const tachographGovNumberOptions = tachographBrandNameList.data.map(
          (el) => ({ value: el.id, label: el.gov_number })
        );
        const tachographFactoryNumberOptions = tachographBrandNameList.data.map(
          (el) => ({ value: el.id, label: el.factory_number })
        );
        setTachographBrandNameOptions(tachographBrandNameOptions);
        setVerificationReasonOptions(tachographVerificationReasonOptions);
        setTachographGovNumberOptions(tachographGovNumberOptions);
        setTachographFactoryNumberOptions(tachographFactoryNumberOptions);
      })();
    }, []);
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
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="date"
                label="Дата калибровки"
                value={state.calibration_date}
                boundKeys="calibration_date"
                onChange={props.handleChange}
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
              />
            </EtsBootstrap.Col>
            {state.calibration_type === 'unscheduled' && (
              <EtsBootstrap.Col md={6}>
                <ExtField
                  type="select"
                  label="Причина внеплановой калибровки"
                  value={state.verification_reason_name}
                  boundKeys="verification_reason_name"
                  emptyValue={null}
                  options={verificationReasonOptions}
                  onChange={props.handleChange}
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
                onChange={props.handleChange}
              />
            </EtsBootstrap.Col>
            {state.verification_reason_name === 'Другое' && (
              <EtsBootstrap.Col md={6}>
                <ExtField
                  type="string"
                  label="Другое"
                  value={state.other_reason}
                  boundKeys="other_reason"
                  onChange={props.handleChange}
                />
              </EtsBootstrap.Col>
            )}
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="select"
                label="Марка тахографа"
                value={state.tachograph_brand_name}
                boundKeys="tachograph_brand_name"
                options={tachographBrandNameOptions}
                onChange={props.handleChange}
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
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="select"
                label="Рег. номер ТС"
                readOnly
                value={state.gov_number}
                boundKeys="gov_number"
                options={tachographGovNumberOptions}
                onChange={props.handleChange}
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="string"
                label="Комментарий"
                value={state.comment}
                boundKeys="comment"
                onChange={props.handleChange}
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <FileField
                multiple
                label="Файл"
                type="file"
                value={state.files}
                onChange={props.handleChange}
                boundKeys="files"
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          {isPermitted ? (
            <EtsBootstrap.Button onClick={props.defaultSubmit}>
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
    (state) => ({
      TachographPeriodicVerificationList: getAutobaseState(state)
        .tachographPeriodicVerificationList,
    }),
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
