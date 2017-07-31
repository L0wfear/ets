import * as React from 'react';
import { Row, Col, Button as BootstrapButton } from 'react-bootstrap';
import * as cx from 'classnames';

import { onClickWithKeys } from 'components/compositions/hoc';
import { IPropsFileInput, IStateFileInput } from './FileInput.h';

const Button = onClickWithKeys(BootstrapButton);

const FileListItem: React.SFC<any> = ({
  onFileRemove,
  index,
  name,
  url,
}) =>
  <Col style={{ marginBottom: 10 }} key={index} md={12}>
    <a href={url} target="_blanc">{decodeURI(name)}</a>
    <Button
      bsClass="close"
      bsSize="xsmall"
      onClick={onFileRemove}
      boundKeys={[index]}
    ><span>×</span>
    </Button>
  </Col>;

class FileInput extends React.Component<IPropsFileInput, IStateFileInput> {
  fileInputNode: HTMLInputElement;

  handleFileRemove = index => {
    const newFileList = this.props.value.filter((file, i) => i !== index);
    this.props.onChange(newFileList);
  }
  handleFilePick = () => {
    this.fileInputNode.click();
  }
  render() {
    const { buttonName = 'Добавить файл', errorClassName = '', value = [] } = this.props;
    const inputClass = cx(errorClassName);
    const inputStyle = { display: 'none' };

    const fileList = value.map(({ name = 'Без названия', url, base64 }, i) =>
      <FileListItem
        index={i}
        url={url || base64}
        name={name}
        onFileRemove={this.handleFileRemove}
      />,
    );

    return (
      <div>
        <Row>{fileList}</Row>
          <BootstrapButton onClick={this.handleFilePick}>{buttonName}</BootstrapButton>
          <input
            type="file"
            style={inputStyle}
            className={inputClass}
            ref={ fileInputNode => this.fileInputNode = fileInputNode}
            accept={this.props.formats}
            disabled={this.props.disabled}
            onChange={this.props.onChange}
            multiple={this.props.multiple}
          />
      </div>
    );
  }
}

export default FileInput;
