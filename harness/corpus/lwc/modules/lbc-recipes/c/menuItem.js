import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./menuItem.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
import { classSet } from 'c/utils';
import { normalizeBoolean, normalizeString, keyCodes } from 'c/utilsPrivate';
class cMenuItem extends LightningElement {
  constructor(...args) {
    super(...args);
    this.value = void 0;
    this.label = void 0;
    this.iconName = void 0;
    this.download = void 0;
    this._accesskey = null;
    this._disabled = false;
    this._tabindex = '-1';
    this._checked = undefined;
    this._isDraft = false;
    this._target = null;
    this.prefixIconName = void 0;
    this.href = void 0;
    this.draftAlternativeText = void 0;
  }
  connectedCallback() {
    this.classList.add('slds-dropdown__item');
    this.setAttribute('role', 'presentation');
  }
  get isDraft() {
    return this._isDraft;
  }
  set isDraft(value) {
    this._isDraft = normalizeBoolean(value);
  }
  get accessKey() {
    return this._accesskey;
  }
  set accessKey(newValue) {
    this._accesskey = newValue;
    this.handleAccessKeyChange(newValue);
  }
  get tabIndex() {
    return this._tabindex;
  }
  set tabIndex(newValue) {
    this._tabindex = newValue;
    this.handleTabIndexChange(newValue);
  }
  get target() {
    return this._target;
  }
  set target(newValue) {
    this._target = normalizeString(newValue, {
      fallbackValue: null,
      validValues: ['_self', '_blank']
    });
  }
  handleAccessKeyChange(value) {
    this._accesskey = value;
  }
  handleTabIndexChange(value) {
    this._tabindex = value;
  }
  get computedAccessKey() {
    return this._accesskey;
  }
  get computedTabIndex() {
    return this._tabindex;
  }
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = normalizeBoolean(value);
  }
  get checked() {
    return this._checked;
  }
  set checked(value) {
    if (typeof value === 'string') {
      value = normalizeString(value, {
        fallbackValue: undefined,
        validValues: ['true', 'false']
      });
      if (value !== undefined) {
        value = value === 'true';
      }
    }
    if (value !== undefined) {
      value = normalizeBoolean(value);
    }
    this._checked = value;
    this.classList.toggle('slds-is-selected', this.checked === true);
  }
  get computedCheckedIconClass() {
    return classSet('slds-icon slds-icon_x-small slds-icon-text-default slds-m-right_x-small').add({
      'slds-icon_selected': !this.checked
    }).toString();
  }
  get computedHref() {
    // eslint-disable-next-line no-script-url
    return this.href ? this.href : 'javascript:void(0)';
  }
  get computedAriaChecked() {
    return this.isMenuItemCheckbox ? this.checked + '' : null;
  }
  get computedAriaDisabled() {
    return this.disabled ? 'true' : 'false';
  }
  get isMenuItemCheckbox() {
    return this.checked !== undefined;
  }
  get computedRole() {
    return this.isMenuItemCheckbox ? 'menuitemcheckbox' : 'menuitem';
  }
  handleBlur() {
    this.dispatchEvent(new CustomEvent('blur'));
    this.dispatchEvent(new CustomEvent('privateblur', {
      composed: true,
      bubbles: true,
      cancelable: true
    }));
  }
  handleFocus() {
    this.dispatchEvent(new CustomEvent('privatefocus', {
      bubbles: true,
      cancelable: true
    }));
  }
  handleClick(event) {
    if (this.disabled) {
      event.preventDefault();
      return;
    }
    if (this.href) {} else {
      event.preventDefault();
      this.dispatchSelect();
    }
  }
  handleKeyDown(event) {
    if (this.disabled) {
      return;
    }
    if (event.keyCode === keyCodes.space) {
      if (this.href) {
        this.template.querySelector('a').click();
      } else {
        this.dispatchSelect();
      }
    }
  }
  dispatchSelect() {
    if (!this.disabled) {
      this.dispatchEvent(new CustomEvent('privateselect', {
        bubbles: true,
        cancelable: true,
        detail: {
          value: this.value
        }
      }));
    }
  }
  focus() {
    this.template.querySelector('a').focus();
    this.dispatchEvent(new CustomEvent('focus'));
  }
  click() {
    const anchor = this.template.querySelector('a');
    if (anchor) {
      anchor.click();
    }
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(cMenuItem, {
  publicProps: {
    value: {
      config: 0
    },
    label: {
      config: 0
    },
    iconName: {
      config: 0
    },
    download: {
      config: 0
    },
    prefixIconName: {
      config: 0
    },
    href: {
      config: 0
    },
    draftAlternativeText: {
      config: 0
    },
    isDraft: {
      config: 3
    },
    accessKey: {
      config: 3
    },
    tabIndex: {
      config: 3
    },
    target: {
      config: 3
    },
    disabled: {
      config: 3
    },
    checked: {
      config: 3
    }
  },
  publicMethods: ["focus", "click"],
  track: {
    _accesskey: 1,
    _disabled: 1,
    _tabindex: 1,
    _checked: 1,
    _isDraft: 1,
    _target: 1
  }
});
const __lwc_component_class_internal = _registerComponent(cMenuItem, {
  tmpl: _tmpl,
  sel: "c-menu-item",
  apiVersion: 66
});
export default __lwc_component_class_internal;