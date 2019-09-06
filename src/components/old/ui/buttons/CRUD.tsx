import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ICRUDButton } from 'components/old/ui/buttons/@types/index.h';

export const ButtonCreateNew: React.FC<ICRUDButton & { permission: string }> = ({ permission, onClick, disabled, buttonName = 'Создать' }) =>
  <EtsBootstrap.Button id="open-create-form" bsSize="small" onClick={onClick} permissions={permission} disabled={disabled}>
    <EtsBootstrap.Glyphicon glyph="plus" /> {buttonName}
  </EtsBootstrap.Button>
;

export const ButtonReadNew: React.FC<ICRUDButton & { permission: string }> = ({ permission, onClick, disabled, buttonName = 'Просмотреть' }) =>
  <EtsBootstrap.Button id="open-update-form" bsSize="small" onClick={onClick} permissions={permission} disabled={disabled}>
    <EtsBootstrap.Glyphicon glyph="search" /> {buttonName}
  </EtsBootstrap.Button>
;

export const ButtonDeleteNew: React.FC<ICRUDButton & { permission: string }> = ({ permission, onClick, disabled, buttonName = 'Удалить' }) =>
  <EtsBootstrap.Button id="remove-element" bsSize="small" onClick={onClick} permissions={permission} disabled={disabled}>
    <EtsBootstrap.Glyphicon glyph="remove" /> {buttonName}
  </EtsBootstrap.Button>
;
