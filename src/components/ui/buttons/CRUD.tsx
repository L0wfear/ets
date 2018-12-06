import * as React from 'react';
import * as BootstrapButton from 'react-bootstrap/lib/Button';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import enhanceWithPermissions from 'components/util/RequirePermissions';
import { ICRUDButton } from 'components/ui/buttons/@types/index.h';
import ButtonPermission from 'components/ui/buttons/ButtonPermission';

const Button = enhanceWithPermissions(BootstrapButton);

export const ButtonCreate: React.FunctionComponent<ICRUDButton> = ({ permissions, onClick, disabled, buttonName = 'Создать' }) =>
  <Button id="open-create-form" bsSize="small" onClick={onClick} permissions={permissions} disabled={disabled}>
    <Glyphicon glyph="plus" /> {buttonName}
  </Button>
;

export const ButtonRead: React.FunctionComponent<ICRUDButton> = ({ permissions, onClick, disabled, buttonName = 'Просмотреть' }) =>
  <Button id="open-update-form" bsSize="small" onClick={onClick} disabled={disabled} permissions={permissions}>
    <Glyphicon glyph="search" /> {buttonName}
  </Button>
;

export const ButtonDelete: React.FunctionComponent<ICRUDButton> = ({ permissions, onClick, disabled, buttonName = 'Удалить' }) =>
  <Button id="remove-element" bsSize="small" onClick={onClick} disabled={disabled} permissions={permissions}>
    <Glyphicon glyph="remove" /> {buttonName}
  </Button>
;

export const ButtonCreateNew: React.FunctionComponent<ICRUDButton & { permission: string }> = ({ permission, onClick, disabled, buttonName = 'Создать' }) =>
  <ButtonPermission id="open-create-form" bsSize="small" onClick={onClick} permission={permission} disabled={disabled}>
    <Glyphicon glyph="plus" /> {buttonName}
  </ButtonPermission>
;

export const ButtonReadNew: React.FunctionComponent<ICRUDButton & { permission: string }> = ({ permission, permissions, onClick, disabled, buttonName = 'Просмотреть' }) =>
  <ButtonPermission id="open-update-form" bsSize="small" onClick={onClick} permission={permission} permissions={permissions} disabled={disabled}>
    <Glyphicon glyph="search" /> {buttonName}
  </ButtonPermission>
;

export const ButtonDeleteNew: React.FunctionComponent<ICRUDButton & { permission: string }> = ({ permission, onClick, disabled, buttonName = 'Удалить' }) =>
  <ButtonPermission id="remove-element" bsSize="small" onClick={onClick} permission={permission} disabled={disabled}>
    <Glyphicon glyph="remove" /> {buttonName}
  </ButtonPermission>
;
