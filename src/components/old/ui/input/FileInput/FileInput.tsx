import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import * as cx from 'classnames';

import { IPropsFileInput, IStateFileInput, IFileWrapper } from 'components/old/ui/input/FileInput/FileInput.h';

import { ButtonRemoveFile, FileInputWrapper, SingleInputFileItem } from 'components/old/ui/input/FileInput/styled';
import { get } from 'lodash';
import { createValidDateTimeDots } from 'components/@next/@utils/dates/dates';

const FileListItem: React.FC<any> = React.memo(
  (props) => {

    const onFileRemove = React.useCallback(
      async () => {
        if (props.askBefoeRemove) {
          try {
            await global.confirmDialog({
              title: 'Внимание!',
              body: 'Файл после удаления не может быть восстановлен. Продолжить?',
              okName: 'Да',
              cancelName: 'Нет',
            });
          } catch (e) {
            return;
          }
        }
        props.onFileRemove(props.index);
      },
      [props.onFileRemove, props.index, props.askBefoeRemove],
    );

    const onOpenFile = React.useCallback(
      () => {
        if (props.url.includes('data:image')) {
          let image = new Image();
          image.src = props.url;

          const w = window.open('');
          w.document.write(image.outerHTML);
          w.document.close();
        } else if (props.url.includes('data:application')) {
          let iframe = `<iframe width='100%' height='100%' src='${props.url}'></iframe>`;
          const w = window.open('');
          w.document.write(iframe);
          w.document.close();
        }
      }, [props.url]);

    const createdAt = get(props, 'created_at', null);
    const withDateTime = get(props, 'withDateTime', false);

    return (
      <EtsBootstrap.Col md={12}>
        <FileInputWrapper>
          <SingleInputFileItem>
            {
              !props.disabled && (
                <ButtonRemoveFile
                  bsClass="close"
                  bsSize="xsmall"
                  onClick={onFileRemove}
                  disabled={props.disabled}
                  children="×"
                />
              )
            }
            <a href={props.url} title={props.name} onClick={onOpenFile} target={props.url.includes('base64') ? '' : '_blank'}>{props.name}</a>
          </SingleInputFileItem>
          {
            Boolean(createdAt && withDateTime) && (
              <div>
                {createValidDateTimeDots(createdAt)}
              </div>
            )
          }
        </FileInputWrapper>
      </EtsBootstrap.Col>
    );
  },
);

class FileInput extends React.Component<IPropsFileInput, IStateFileInput> {
  fileInputNode: HTMLInputElement;

  handleFileRemove = (index) => {
    const newFileList = this.props.value.reduce(
      (newFiles, file, i) => {
        if (i === index) {
          if (file.action !== 'add') {
            file.action = 'delete';
            newFiles.push(file);
          }
        } else {
          newFiles.push(file);
        }

        return newFiles;
      },
      [],
    );
    this.props.onChange(newFileList);
  };
  handleFilePick = () => {
    this.fileInputNode.click();
  };

  setRef = (fileInputNode) => this.fileInputNode = fileInputNode;

  render() {
    const {
      buttonName = 'Добавить файл', errorClassName = '', value = [], multiple = false,
      showFileList = true,
      id,
      button_id,
      modalKey,
    } = this.props;
    const inputClass = cx(errorClassName);
    const inputStyle = { display: 'none' };
    // NOTE Funny mock 🐈
    const serverErrorFile: IFileWrapper = {
      url: 'https://s1-ssl.dmcdn.net/Sp5Gv/1280x720-l9x.jpg',
      name: 'Ошибка на сервере. Невалидный файл.',
      action: 'add',
    };

    const withDateTime = get(this.props, 'withDateTime', false); // флаг для отображения даты и времени
    const fileList = value
      .map((file) => file === null ? serverErrorFile : file)
      .reduce(
        (newArr, { name = 'Без названия', url, base64, created_at, action } = serverErrorFile, i) => {
          if (action !== 'delete') {
            newArr.push(
              <FileListItem
                key={i}
                index={i}
                url={url || base64}
                name={name}
                onFileRemove={this.handleFileRemove}
                disabled={this.props.disabled}
                askBefoeRemove={this.props.askBefoeRemove}
                created_at={created_at}
                withDateTime={withDateTime}
              />,
            );
          }

          return newArr;
        },
        [],
      );

    const disabledIfSingleFile = Boolean(!multiple && fileList.length);
    const ID = this.props.id ? `${modalKey ? `${modalKey}-` : ''}${this.props.id}-list` : undefined;

    return (
      <div>
        { showFileList && <EtsBootstrap.Row id={ID}>{fileList}</EtsBootstrap.Row> }
        {
          !this.props.disabled && (
            <EtsBootstrap.Button
              disabled={this.props.disabled || disabledIfSingleFile}
              onClick={this.handleFilePick}
              id={button_id}
              children={buttonName}
            />
          )
        }
        <input
          id={id}
          type="file"
          value={''}
          style={inputStyle}
          className={inputClass}
          ref={this.setRef}
          accept={this.props.formats}
          disabled={this.props.disabled}
          onChange={this.props.onChange}
          multiple={multiple}
        />
      </div>
    );
  }
}

export default FileInput;
