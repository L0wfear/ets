import React from 'react';
import { Button as BootstrapButton, Glyphicon } from 'react-bootstrap';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';

const Button = enhanceWithPermissions(BootstrapButton);

export const ButtonCreate = ({ permissions, onClick, disabled }) =>
  <Button bsSize="small" onClick={onClick} permissions={permissions} disabled={disabled}>
    <Glyphicon glyph="plus" /> Создать
  </Button>
;

export const ButtonRead = ({ permissions, onClick, disabled }) =>
  <Button bsSize="small" onClick={onClick} disabled={disabled} permissions={permissions}>
    <Glyphicon glyph="search" /> Просмотреть
  </Button>
;

export const ButtonDelete = ({ permissions, onClick, disabled }) =>
  <Button bsSize="small" onClick={onClick} disabled={disabled} permissions={permissions}>
    <Glyphicon glyph="remove" /> Удалить
  </Button>
;

const propTypes = {
  permissions: React.PropTypes.array,
  onClick: React.PropTypes.func,
  disabled: React.PropTypes.bool,
};

ButtonCreate.propTypes = propTypes;
ButtonRead.propTypes = propTypes;
ButtonDelete.propTypes = propTypes;
