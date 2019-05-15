import * as React from 'react';
import useForm from 'components/new/utils/context/form/hoc_selectors/useForm';
import { Modal } from 'react-bootstrap';
import { isArray } from 'highcharts';
import { DefaultHeaderType } from 'components/new/utils/context/@types';

type DefaultModalHeaderProps = {
  formDataKey: string;
};

const DefaultModalHeader: React.FC<DefaultModalHeaderProps> = React.memo(
  (props) => {
    const formDataHeaderValue = useForm.useFormDataSchemaHeader<any>(props.formDataKey) as DefaultHeaderType;
    const IS_CREATING = useForm.useFormDataSchemaIsCreating<any>(props.formDataKey);

    const title = React.useMemo(
      () => {
        if (isArray(formDataHeaderValue.title)) {
          return formDataHeaderValue.title.reduce(
            (titleTemp: string, titleConfig) => {
              if (titleConfig.disaplayIf === 'IS_CREATING') {
                if (!titleConfig.reverse ? IS_CREATING : !IS_CREATING) {
                  titleTemp = titleConfig.title;
                }
              }

              return titleTemp;
            },
            '',
          );
        }

        return formDataHeaderValue.title;
      },
      [formDataHeaderValue.title, IS_CREATING],
    );

    return React.useMemo(
      () => (
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
      ),
      [title],
    );
  },
);

export default DefaultModalHeader;
