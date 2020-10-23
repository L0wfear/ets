import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import ExtField from 'components/@next/@ui/renderFields/Field';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import { DivNone } from 'global-styled/global-styled';
import { compose } from 'recompose';
import {
  OwnTachographMetrologicalVerificationProps,
  PropsTachographMetrologicalVerification,
  StatePropsTachographMetrologicalVerification,
  PropsTachographMetrologicalVerificationWithForm
} from 'components/new/pages/nsi/autobase/pages/tachograph_metrological_verification/form/@types/TachographMetrologicalVerificationForm';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { getAutobaseState } from 'redux-main/reducers/selectors';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import withForm from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { TachographMetrologicalVerification } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_metrological_verification/@types';
import { getDefaultTachographMetrologicalVerificationElement } from './utils';
import { tachographMetrologicalVerificationFormSchema } from './schema';
import tachographMetrologicalVerificationPermissions from '../_config-data/permissions';
import { autobaseCreateTachographMetrologicalVerification, autobaseUpdateTachographMetrologicalVerification } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_metrological_verification/actions';
import { FileField } from 'components/old/ui/input/fields';
import withTachographOptions from '../../tachograph_periodic_verification/form/hoc/withTachographOptions';

const TachographMetrologicalVerificationForm: React.FC<PropsTachographMetrologicalVerification> = React.memo(
  (props) => {
    const {
      formState: state,
      formErrors: errors,
      page,
      path,
      IS_CREATING,
      tachographBrandNameOptions: brandsOptions,
      tachographFactoryNumberOptions: factoryNumbersOptions,
      tachographBrandNameList: tachographListData,
    } = props;

    const isPermitted = props.isPermittedToUpdate;

    const handleSubmit = React.useCallback(
      async () => {
        const {
          formState: { id, factory_number, verification_date, verification_number, comment, files },
        } = props;

        const chosenTachograph = tachographListData?.find((tachograph) => tachograph.factory_number === factory_number);

        const data = {
          id,
          files,
          factory_number,
          verification_date,
          verification_number,
          tachograph_id: chosenTachograph?.id,
          comment,
        };

        const result = await props.submitAction(data);

        if (result) {
          props.handleHide(true, result);
        }
      }, [tachographListData, state]);

    return (
      <EtsBootstrap.ModalContainer id="modal-tachograph_metrological_verification" show onHide={props.hideWithoutChanges}>
        <EtsBootstrap.ModalHeader closeButton>
          <EtsBootstrap.ModalTitle>{!IS_CREATING ? 'Изменение записи' : 'Создание записи'}</EtsBootstrap.ModalTitle>
        </EtsBootstrap.ModalHeader>
        <ModalBodyPreloader page={page} path={path} typePreloader="mainpage">
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="string"
                label="Номер поверки"
                value={state.verification_number}
                error={errors.verification_number}
                onChange={props.handleChange}
                boundKeys="verification_number"
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="date"
                time={false}
                label="Дата проведения поверки"
                date={state.verification_date}
                error={errors.verification_date}
                onChange={props.handleChange}
                boundKeys="verification_date"
                makeGoodFormat
                makeGoodFormatInitial
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={6}>
              <ExtField
                id="tachograph_brand_id"
                type="select"
                label="Марка тахографа"
                options={brandsOptions}
                value={state.tachograph_brand_id}
                error={errors.tachograph_brand_id}
                onChange={props.handleChange}
                boundKeys="tachograph_brand_id"
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="select"
                label="Заводской номер тахографа"
                value={state.factory_number}
                error={errors.factory_number}
                options={factoryNumbersOptions}
                onChange={props.handleChange}
                boundKeys="factory_number"
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="string"
                label="Рег. номер ТС"
                value={state.gov_number}
                error={errors.gov_number}
                disabled
                onChange={props.handleChange}
                boundKeys="gov_number"
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={6}>
              <ExtField
                type="string"
                label="Комментарий"
                value={state.comment}
                error={errors.comment}
                onChange={props.handleChange}
                boundKeys="comment"
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={12}>
              <FileField
                label="Сертификат"
                type="file"
                formats=".pdf"
                kind="tachograph_metrological_verification"
                value={state.files}
                error={errors.files}
                onChange={props.handleChange}
                boundKeys="files"
                askBefoeRemove
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </ModalBodyPreloader>
        <EtsBootstrap.ModalFooter>
          {
            isPermitted
              ? (
                <EtsBootstrap.Button disabled={!props.canSave} onClick={handleSubmit}>Сохранить</EtsBootstrap.Button>
              )
              : (
                <DivNone />
              )
          }
        </EtsBootstrap.ModalFooter>
      </EtsBootstrap.ModalContainer>
    );
  }
);

export default compose<PropsTachographMetrologicalVerification, OwnTachographMetrologicalVerificationProps>(
  connect<StatePropsTachographMetrologicalVerification, {}, OwnTachographMetrologicalVerificationProps, ReduxState>(
    (state) => ({
      tachographList: getAutobaseState(state).tachographList,
    }),
  ),
  withSearch,
  withForm<PropsTachographMetrologicalVerificationWithForm, TachographMetrologicalVerification>({
    uniqField: 'id',
    createAction: autobaseCreateTachographMetrologicalVerification,
    updateAction: autobaseUpdateTachographMetrologicalVerification,
    mergeElement: (props) => {
      return getDefaultTachographMetrologicalVerificationElement(props.element);
    },
    schema: tachographMetrologicalVerificationFormSchema,
    permissions: tachographMetrologicalVerificationPermissions,
  }),
  withTachographOptions,
)(TachographMetrologicalVerificationForm);
