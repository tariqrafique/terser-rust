import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./primitiveHeaderActions.html";
import { registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import labelClipText from '@salesforce/label/LightningDatatable.clipText';
import labelShowActions from '@salesforce/label/LightningDatatable.showActions';
import labelWrapText from '@salesforce/label/LightningDatatable.wrapText';
import { deepCopy } from 'lightning/utilsPrivate';
import { formatLabel } from 'lightning/utils';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
const i18n = {
  clipText: labelClipText,
  showActions: labelShowActions,
  wrapText: labelWrapText
};
class PrimitiveHeaderActions extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this.containerRect = void 0;
    this._internalActions = [];
    this._customerActions = [];
    this._actionMenuAlignment = void 0;
    this.colKeyValue = void 0;
    this.columnHeader = void 0;
  }
  get actions() {
    return this._actions;
  }
  set actions(value) {
    this._actions = value;
    this.updateActions();
  }
  focus() {
    const btnMenu = this.refs.buttonMenu;
    if (btnMenu) {
      btnMenu.focus();
    }
  }
  get i18n() {
    return i18n;
  }
  get hasActions() {
    return this._internalActions.length > 0 || this._customerActions.length > 0;
  }
  get hasActionsDivider() {
    return this._internalActions.length > 0 && this._customerActions.length > 0;
  }
  handleMenuOpen(event) {
    event.preventDefault();
    event.stopPropagation();
    this.elementRect = this.refs.buttonMenu.getBoundingClientRect();
    this.dispatchEvent(new CustomEvent('privatecellheaderactionmenuopening', {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: {
        actionsCount: this._internalActions.length + this._customerActions.length,
        dividersCount: this.hasActionsDivider ? 1 : 0,
        saveContainerPosition: containerRect => {
          this.containerRect = containerRect;
        }
      }
    }));
  }
  handleMenuClose() {
    this.dispatchEvent(new CustomEvent('privatecellheaderactionmenuclosed', {
      bubbles: true,
      composed: true,
      cancelable: true
    }));
  }
  handleActionSelect(event) {
    const action = event.detail.value;
    this.dispatchEvent(new CustomEvent('privatecellheaderactiontriggered', {
      composed: true,
      bubbles: true,
      cancelable: true,
      detail: {
        action: deepCopy(action._action),
        actionType: action._type,
        colKeyValue: this.colKeyValue
      }
    }));
  }
  updateActions() {
    const actionTypeReducer = type => (actions, action) => {
      const overrides = {
        _type: type,
        _action: action
      };
      actions.push(Object.assign({}, action, overrides));
      return actions;
    };
    this._internalActions = this.getActionsByType('internalActions').reduce(actionTypeReducer('internal'), []);
    this._customerActions = this.getActionsByType('customerActions').reduce(actionTypeReducer('customer'), []);
    this._actionMenuAlignment = this._actions.menuAlignment && this._actions.menuAlignment.replace('auto-', '');
  }
  getActionsByType(type) {
    return Array.isArray(this._actions[type]) ? this._actions[type] : [];
  }
  get alternativeText() {
    return formatLabel(i18n.showActions, this.columnHeader || '');
  }
  /*LWC compiler v9.5.3*/
}
PrimitiveHeaderActions.delegatesFocus = true;
_registerDecorators(PrimitiveHeaderActions, {
  publicProps: {
    colKeyValue: {
      config: 0
    },
    actions: {
      config: 3
    },
    columnHeader: {
      config: 0
    }
  },
  publicMethods: ["focus"],
  track: {
    containerRect: 1,
    _internalActions: 1,
    _customerActions: 1
  },
  fields: ["_actionMenuAlignment"]
});
const __lwc_component_class_internal = _registerComponent(PrimitiveHeaderActions, {
  tmpl: _tmpl,
  sel: "lightning-primitive-header-actions",
  apiVersion: 66
});
export default __lwc_component_class_internal;