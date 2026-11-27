import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./tab.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
import { normalizeBoolean } from 'c/utilsPrivate';
class cTab extends LightningElement {
  constructor(...args) {
    super(...args);
    this._loadContent = false;
  }
  connectedCallback() {
    this._connected = true;
    this.dispatchEvent(new CustomEvent('privatetabregister', {
      cancelable: true,
      bubbles: true,
      composed: true,
      detail: {
        setDeRegistrationCallback: deRegistrationCallback => {
          this._deRegistrationCallback = deRegistrationCallback;
        }
      }
    }));
  }
  loadContent() {
    this._loadContent = true;
    this.dispatchEvent(new CustomEvent('active'));
  }
  disconnectedCallback() {
    this._connected = false;
    if (this._deRegistrationCallback) {
      this._deRegistrationCallback();
    }
  }
  get value() {
    return this._value;
  }
  set value(newValue) {
    this._value = String(newValue);
    this._dispatchDataChangeEventIfConnected();
  }
  get label() {
    return this._label;
  }
  set label(value) {
    this._label = value;
    this._dispatchDataChangeEventIfConnected();
  }
  get title() {
    return this._title;
  }
  set title(value) {
    this._title = value;
    this._dispatchDataChangeEventIfConnected();
  }
  get iconName() {
    return this._iconName;
  }
  set iconName(value) {
    this._iconName = value;
    this._dispatchDataChangeEventIfConnected();
  }
  get iconAssistiveText() {
    return this._iconAlernativeText;
  }
  set iconAssistiveText(value) {
    this._iconAlernativeText = value;
    this._dispatchDataChangeEventIfConnected();
  }
  get endIconName() {
    return this._endIconName;
  }
  set endIconName(value) {
    this._endIconName = value;
    this._dispatchDataChangeEventIfConnected();
  }
  get endIconAlternativeText() {
    return this._endIconAlternativeText;
  }
  set endIconAlternativeText(value) {
    this._endIconAlternativeText = value;
    this._dispatchDataChangeEventIfConnected();
  }
  get showErrorIndicator() {
    return this._showErrorIndicator;
  }
  set showErrorIndicator(value) {
    this._showErrorIndicator = normalizeBoolean(value);
    this._dispatchDataChangeEventIfConnected();
  }
  _dispatchDataChangeEventIfConnected() {
    if (this._connected) {
      this.dispatchEvent(new CustomEvent('privatetabdatachange', {
        cancelable: true,
        bubbles: true,
        composed: true
      }));
    }
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(cTab, {
  publicProps: {
    value: {
      config: 3
    },
    label: {
      config: 3
    },
    title: {
      config: 3
    },
    iconName: {
      config: 3
    },
    iconAssistiveText: {
      config: 3
    },
    endIconName: {
      config: 3
    },
    endIconAlternativeText: {
      config: 3
    },
    showErrorIndicator: {
      config: 3
    }
  },
  publicMethods: ["loadContent"],
  track: {
    _loadContent: 1
  }
});
const __lwc_component_class_internal = _registerComponent(cTab, {
  tmpl: _tmpl,
  sel: "c-tab",
  apiVersion: 66
});
export default __lwc_component_class_internal;