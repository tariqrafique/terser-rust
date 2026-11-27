import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./primitiveCellButton.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import { normalizeBoolean } from 'lightning/utilsPrivate';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
class PrivateCellButton extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this.rowKeyValue = void 0;
    this.colKeyValue = void 0;
    this.variant = void 0;
    this.label = void 0;
    this.iconName = void 0;
    this.iconPosition = void 0;
    this.buttonName = void 0;
    this.buttonClass = void 0;
    this.buttonTitle = void 0;
    this.internalTabIndex = void 0;
    this.type = void 0;
    this.alternativeText = void 0;
    this.iconClass = void 0;
    this.initialRender = true;
    this.buttonHasFocus = false;
    this._connected = false;
    this._disabled = false;
  }
  get computedTitle() {
    return this.buttonTitle || this.label;
  }
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    const newValue = normalizeBoolean(value);
    const oldValue = this._disabled;
    if (oldValue === false && newValue === true && this.buttonHasFocus && !import.meta.env.SSR) {
      this.fireCellFalseBlurred();
    }
    this._disabled = newValue;
  }
  get isButtonIconType() {
    return this.type === 'button-icon';
  }
  renderedCallback() {
    if (this.initialRender) {
      this.addListeners();
    }
    this.initialRender = false;
  }
  connectedCallback() {
    super.connectedCallback();
    this._connected = true;
  }
  disconnectedCallback() {
    this._connected = false;
  }
  get buttonCustomElement() {
    if (this._connected) {
      return this.isButtonIconType ? this.refs.buttonIcon : this.refs.button;
    }
    return undefined;
  }
  addListeners() {
    const buttonCustomElement = this.buttonCustomElement;
    buttonCustomElement.addEventListener('focus', this.handleButtonFocused.bind(this));
    buttonCustomElement.addEventListener('blur', this.handleButtonBlurred.bind(this));
  }
  focus() {
    if (this.buttonCustomElement) {
      this.buttonCustomElement.focus();
    }
  }
  click() {
    if (this.buttonCustomElement) {
      this.buttonCustomElement.click();
    }
  }
  handleButtonFocused(event) {
    if (event.target.localName.indexOf('button') > -1) {
      this.buttonHasFocus = true;
    }
  }
  handleButtonBlurred(event) {
    if (event.target.localName.indexOf('button') > -1) {
      this.buttonHasFocus = false;
    }
  }
  fireCellFalseBlurred() {
    const {
      rowKeyValue,
      colKeyValue
    } = this;
    this.dispatchEvent(new CustomEvent('privatecellfalseblurred', {
      composed: true,
      bubbles: true,
      cancelable: true,
      detail: {
        rowKeyValue,
        colKeyValue
      }
    }));
  }
  handleButtonClick() {
    const {
      rowKeyValue,
      colKeyValue
    } = this;
    setTimeout(() => {
      this.dispatchEvent(new CustomEvent('privatecellbuttonclicked', {
        composed: true,
        bubbles: true,
        cancelable: true,
        detail: {
          rowKeyValue,
          colKeyValue
        }
      }));
    }, 0);
  }
  /*LWC compiler v9.5.3*/
}
PrivateCellButton.delegatesFocus = true;
_registerDecorators(PrivateCellButton, {
  publicProps: {
    rowKeyValue: {
      config: 0
    },
    colKeyValue: {
      config: 0
    },
    variant: {
      config: 0
    },
    label: {
      config: 0
    },
    iconName: {
      config: 0
    },
    iconPosition: {
      config: 0
    },
    buttonName: {
      config: 0
    },
    buttonClass: {
      config: 0
    },
    buttonTitle: {
      config: 0
    },
    internalTabIndex: {
      config: 0
    },
    type: {
      config: 0
    },
    alternativeText: {
      config: 0
    },
    iconClass: {
      config: 0
    },
    disabled: {
      config: 3
    }
  },
  publicMethods: ["focus", "click"],
  fields: ["initialRender", "buttonHasFocus", "_connected", "_disabled"]
});
const __lwc_component_class_internal = _registerComponent(PrivateCellButton, {
  tmpl: _tmpl,
  sel: "lightning-primitive-cell-button",
  apiVersion: 66
});
export default __lwc_component_class_internal;