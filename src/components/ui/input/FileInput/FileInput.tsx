import * as React from 'react';
import * as Row from 'react-bootstrap/lib/Row';
import * as Col from 'react-bootstrap/lib/Col';
import * as BootstrapButton from 'react-bootstrap/lib/Button';

import * as cx from 'classnames';

import { IPropsFileInput, IStateFileInput, IFileWrapper } from 'components/ui/input/FileInput/FileInput.h';

import { onClickWithKeys } from 'components/compositions/hoc';
import { DivNone } from 'global-styled/global-styled';

const Button: any = onClickWithKeys(BootstrapButton as any);

const FileListItem: React.FunctionComponent<any> = ({
  onFileRemove,
  disabled,
  index,
  name,
  url,
}) =>
  <Col style={{ marginBottom: 10 }} md={12}>
    <a href={url} target="_blanc">{name}</a>
    <Button
      bsClass="close"
      bsSize="xsmall"
      onClick={onFileRemove}
      boundKeys={index}
      disabled={disabled}
    ><span>×</span>
    </Button>
  </Col>;

class FileInput extends React.Component<IPropsFileInput, IStateFileInput> {
  fileInputNode: HTMLInputElement;

  handleFileRemove = (index) => {
    const newFileList = this.props.value.filter((file, i) => i !== index);
    this.props.onChange(newFileList);
  }
  handleFilePick = () => {
    this.fileInputNode.click();
  }

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
    };

    const fileList = value
      .map((file) => file === null ? serverErrorFile : file)
      .map(({ name = 'Без названия', url, base64 } = serverErrorFile, i) =>
        <FileListItem
          key={i}
          index={i}
          url={url || base64}
          name={name}
          onFileRemove={this.handleFileRemove}
          disabled={this.props.disabled}
        />,
      );

    const ID = this.props.id ? `${modalKey ? `${modalKey}-` : ''}${this.props.id}-list` : undefined;

    return (
      <div>
        { showFileList && <Row id={ID}>{fileList}</Row> }
          {
            !this.props.disabled
              ? (
                <BootstrapButton
                  disabled={this.props.disabled}
                  onClick={this.handleFilePick}
                  id={button_id}
                >{buttonName}</BootstrapButton>
              )
              : (
                <DivNone />
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
