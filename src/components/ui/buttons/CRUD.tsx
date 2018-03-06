import * as React from 'react';
import { Button as BootstrapButton, Glyphicon } from 'react-bootstrap';
import enhanceWithPermissions from 'components/util/RequirePermissions.jsx';
import { ICRUDButton } from 'components/ui/buttons/@types/index.h';

const Button = enhanceWithPermissions(BootstrapButton);

export const ButtonCreate: React.SFC<ICRUDButton> = ({ permissions, onClick, disabled }) =>
  <Button id="open-create-form" bsSize="small" onClick={onClick} permissions={permissions} disabled={disabled}>
    <Glyphicon glyph="plus" /> Создать
  </Button>
;

export const ButtonRead: React.SFC<ICRUDButton> = ({ permissions, onClick, disabled }) =>
  <Button id="open-update-form" bsSize="small" onClick={onClick} disabled={disabled} permissions={permissions}>
    <Glyphicon glyph="search" /> Просмотреть
  </Button>
;

export const ButtonDelete: React.SFC<ICRUDButton> = ({ permissions, onClick, disabled }) =>
  <Button id="remove-element" bsSize="small" onClick={onClick} disabled={disabled} permissions={permissions}>
    <Glyphicon glyph="remove" /> Удалить
  </Button>
;
