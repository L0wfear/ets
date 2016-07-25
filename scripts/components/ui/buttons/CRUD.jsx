import React from 'react';
import { Button as BootstrapButton, Glyphicon, ButtonToolbar, Dropdown, MenuItem } from 'react-bootstrap';
import { enhanceWithPermissions } from 'components/util/RequirePermissions.jsx';

const Button = enhanceWithPermissions(BootstrapButton);

export const ButtonCreate = ({permissions, onClick}) =>
  <Button bsSize="small" onClick={onClick} permissions={permissions}>
    <Glyphicon glyph="plus"/> Создать
  </Button>
;

export const ButtonRead = ({permissions, onClick, disabled}) =>
  <Button bsSize="small" onClick={onClick} disabled={disabled} permissions={permissions}>
    <Glyphicon glyph="search"/> Просмотреть
  </Button>
;

export const ButtonDelete = ({permissions, onClick, disabled}) =>
  <Button bsSize="small" onClick={onClick} disabled={disabled} permissions={permissions}>
    <Glyphicon glyph="remove"/> Удалить
  </Button>
;
