import * as React from 'react';
import SingleUiElementWrapper from 'components/@next/@ui/renderFields/SingleUiElementWrapper';
import { FieldLabel } from 'components/@next/@ui/renderFields/styled';
import ErrorsBlock from 'components/@next/@ui/renderFields/ErrorsBlock/ErrorsBlock';
import cx from 'classnames';
import { FileInputUi } from 'components/@next/@ui/renderFields/FileField/styled';
import { ExtFieldFile } from 'components/old/ui/new/field/ExtField';

const FileField: React.FC<ExtFieldFile> = React.memo(
  (props) => {
    const { label = '', ...fileInputProps } = props;
    const { error, modalKey } = props;
    const errorClassName = cx({ 'has-error': error });
    const id = props.id
      ? `${modalKey ? `${modalKey}-` : ''}${props.id}-label`
      : undefined;

    return (
      <SingleUiElementWrapper hidden={props.hidden} style={{ marginBottom: 15 }}>
        {typeof label === 'string' && (
          <FieldLabel htmlFor=" " id={id} style={{ minHeight: 15 }}>
            {label}
          </FieldLabel>
        )}
        <FileInputUi {...fileInputProps} errorClassName={errorClassName} />
        <ErrorsBlock
          hidden={!error}
          error={error}
        />

      </SingleUiElementWrapper>
    );
  },
);

export default FileField;
