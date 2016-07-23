import React from 'react';
import { Button, Glyphicon, ButtonToolbar, Dropdown, MenuItem } from 'react-bootstrap';
import RequirePermissions from 'components/util/RequirePermissions.jsx';

export const ButtonCreate = ({permissions, onClick}) =>
  <RequirePermissions permissions={permissions}>
    <Button bsSize="small" onClick={onClick}>
      <Glyphicon glyph="plus"/> Создать
    </Button>
  </RequirePermissions>
;

export const ButtonRead = ({permissions, onClick, disabled}) =>
  <RequirePermissions permissions={permissions}>
    <Button bsSize="small" onClick={onClick} disabled={disabled}>
      <Glyphicon glyph="search"/> Просмотреть
    </Button>
  </RequirePermissions>
;

export const ButtonDelete = ({permissions, onClick, disabled}) =>
  <RequirePermissions permissions={permissions}>
    <Button bsSize="small" onClick={onClick} disabled={disabled}>
      <Glyphicon glyph="remove"/> Удалить
    </Button>
  </RequirePermissions>
;
