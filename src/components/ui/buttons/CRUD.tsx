import * as React from 'react';
import { Button as BootstrapButton, Glyphicon } from 'react-bootstrap';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';
import ICRUD from '../@types/CRUD.h';

const Button = enhanceWithPermissions(BootstrapButton);

export const ButtonCreate: React.SFC<ICRUD> = ({ permissions, onClick, disabled }) =>
  <Button bsSize="small" onClick={onClick} permissions={permissions} disabled={disabled}>
    <Glyphicon glyph="plus" /> Создать
  </Button>
;

export const ButtonRead: React.SFC<ICRUD> = ({ permissions, onClick, disabled }) =>
  <Button bsSize="small" onClick={onClick} disabled={disabled} permissions={permissions}>
    <Glyphicon glyph="search" /> Просмотреть
  </Button>
;

export const ButtonDelete: React.SFC<ICRUD> = ({ permissions, onClick, disabled }) =>
  <Button bsSize="small" onClick={onClick} disabled={disabled} permissions={permissions}>
    <Glyphicon glyph="remove" /> Удалить
  </Button>
;
