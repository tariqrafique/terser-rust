import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./primitiveCellActions.html";
import { registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import labelLoadingActions from '@salesforce/label/LightningPrimitiveCellActions.loadingActions';
import labelShowActions from '@salesforce/label/LightningPrimitiveCellActions.showActions';
import { normalizeString } from 'lightning/utilsPrivate';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
const DEFAULT_MENU_ALIGNMENT = 'auto-right';
const VALID_MENU_ALIGNMENT = ['auto-right', 'auto-left', 'auto', 'left', 'center', 'right', 'bottom-left', 'bottom-center', 'bottom-right'];
const i18n = {
  loadingActions: labelLoadingActions,
  showActions: labelShowActions
};
class PrimitiveCellActions extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this.containerRect = void 0;
    this._actions = [];
    this._isLoadingActions = void 0;
    this._menuAlignment = DEFAULT_MENU_ALIGNMENT;
    this.rowKeyValue = void 0;
    this.colKeyValue = void 0;
    this.rowActions = void 0;
    this.internalTabIndex = void 0;
  }
  get menuAlignment() {
    return this._menuAlignment;
  }
  set menuAlignment(value) {
    this._menuAlignment = normalizeString(value, {
      fallbackValue: DEFAULT_MENU_ALIGNMENT,
      validValues: VALID_MENU_ALIGNMENT
    });
  }
  focus() {
    if (this._connected && this.refs.buttonMenu) {
      this.refs.buttonMenu.focus();
    }
  }
  click() {
    if (this._connected && this.refs.buttonMenu) {
      setTimeout(() => {
        this.refs.buttonMenu.click();
      }, 0);
    }
  }
  get computedMenuAlignment() {
    return this.menuAlignment;
  }
  get buttonAlternateText() {
    return `${i18n.showActions}`;
  }
  get showButtonMenu() {
    const {
      rowActions
    } = this;
    return typeof rowActions === 'function' || Array.isArray(rowActions) && rowActions.length;
  }
  get spinnerAlternateText() {
    return `${i18n.loadingActions}`;
  }
  handleActionSelect(event) {
    this.dispatchEvent(new CustomEvent('privatecellactiontriggered', {
      composed: true,
      bubbles: true,
      cancelable: true,
      detail: {
        rowKeyValue: this.rowKeyValue,
        colKeyValue: this.colKeyValue,
        action: event.detail.value
      }
    }));
  }
  handleMenuOpen() {
    this.elementRect = this.refs.buttonMenu.getBoundingClientRect();
    const detail = {
      rowKeyValue: this.rowKeyValue,
      colKeyValue: this.colKeyValue,
      doneCallback: this.finishLoadingActions.bind(this),
      saveContainerPosition: containerRect => {
        this.containerRect = containerRect;
      }
    };
    if (typeof this.rowActions === 'function') {
      this._isLoadingActions = true;
      this._actions = [];
      detail.actionsProviderFunction = this.rowActions;
      Promise.resolve().then(() => {
        this.dispatchEvent(new CustomEvent('privatecellactionmenuopening', {
          composed: true,
          bubbles: true,
          cancelable: true,
          detail
        }));
      });
    } else {
      this._actions = this.rowActions;
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this._connected = true;
  }
  disconnectedCallback() {
    this._connected = false;
  }
  finishLoadingActions(actions) {
    this._isLoadingActions = false;
    this._actions = actions;
  }
  /*LWC compiler v9.5.3*/
}
PrimitiveCellActions.delegatesFocus = true;
_registerDecorators(PrimitiveCellActions, {
  publicProps: {
    rowKeyValue: {
      config: 0
    },
    colKeyValue: {
      config: 0
    },
    rowActions: {
      config: 0
    },
    internalTabIndex: {
      config: 0
    },
    menuAlignment: {
      config: 3
    }
  },
  publicMethods: ["focus", "click"],
  track: {
    containerRect: 1,
    _actions: 1
  },
  fields: ["_isLoadingActions", "_menuAlignment"]
});
const __lwc_component_class_internal = _registerComponent(PrimitiveCellActions, {
  tmpl: _tmpl,
  sel: "lightning-primitive-cell-actions",
  apiVersion: 66
});
export default __lwc_component_class_internal;