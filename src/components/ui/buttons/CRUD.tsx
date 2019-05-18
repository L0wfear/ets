import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ICRUDButton } from 'components/ui/buttons/@types/index.h';
import ButtonCheckPermission from 'components/ui/buttons/ButtonCheckPermission';

export const ButtonCreateNew: React.FC<ICRUDButton & { permission: string }> = ({ permission, onClick, disabled, buttonName = 'Создать' }) =>
  <ButtonCheckPermission id="open-create-form" bsSize="small" onClick={onClick} permissions={permission} disabled={disabled}>
    <EtsBootstrap.Glyphicon glyph="plus" /> {buttonName}
  </ButtonCheckPermission>
;

export const ButtonReadNew: React.FC<ICRUDButton & { permission: string }> = ({ permission, onClick, disabled, buttonName = 'Просмотреть' }) =>
  <ButtonCheckPermission id="open-update-form" bsSize="small" onClick={onClick} permissions={permission} disabled={disabled}>
    <EtsBootstrap.Glyphicon glyph="search" /> {buttonName}
  </ButtonCheckPermission>
;

export const ButtonDeleteNew: React.FC<ICRUDButton & { permission: string }> = ({ permission, onClick, disabled, buttonName = 'Удалить' }) =>
  <ButtonCheckPermission id="remove-element" bsSize="small" onClick={onClick} permissions={permission} disabled={disabled}>
    <EtsBootstrap.Glyphicon glyph="remove" /> {buttonName}
  </ButtonCheckPermission>
;
