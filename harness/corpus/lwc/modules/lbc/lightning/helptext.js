import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./helptext.html";
import { registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import labelButtonAlternativeText from '@salesforce/label/LightningHelptext.buttonAlternativeText';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { isValidName } from 'lightning/iconUtils';
import { normalizeString } from 'lightning/utilsPrivate';
const DEFAULT_BUTTON_ALT_TEXT = labelButtonAlternativeText;
const DEFAULT_ICON_NAME = 'utility:info';
const DEFAULT_ICON_VARIANT = 'bare';
class LightningHelptext extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this.state = {
      iconName: DEFAULT_ICON_NAME,
      iconVariant: DEFAULT_ICON_VARIANT,
      alternativeText: DEFAULT_BUTTON_ALT_TEXT
    };
    this.content = void 0;
    this.tabIndex = void 0;
  }
  get iconName() {
    if (isValidName(this.state.iconName)) {
      return this.state.iconName;
    }
    return DEFAULT_ICON_NAME;
  }
  set iconName(value) {
    this.state.iconName = value;
  }
  get iconVariant() {
    return normalizeString(this.state.iconVariant, {
      fallbackValue: DEFAULT_ICON_VARIANT,
      validValues: ['bare', 'error', 'inverse', 'warning']
    });
  }
  set iconVariant(value) {
    this.state.iconVariant = value;
  }
  get alternativeText() {
    return this.state.alternativeText;
  }
  set alternativeText(value) {
    if (value && typeof value === 'string' && value.trim() !== '') {
      this.state.alternativeText = value;
    } else {
      console.warn(`<lightning-helptext> Invalid alternativeText value: ${value}`);
    }
  }
  focus() {
    this.template.querySelector('lightning-button-icon').focus();
  }
  get computedButtonVariant() {
    switch (this.iconVariant) {
      case 'inverse':
        return 'bare-inverse';
      default:
        return 'bare';
    }
  }
  get computedIconClass() {
    switch (this.iconVariant) {
      case 'error':
        return 'slds-icon-text-error';
      case 'warning':
        return 'slds-icon-text-warning';
      default:
        return '';
    }
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningHelptext, {
  publicProps: {
    content: {
      config: 0
    },
    tabIndex: {
      config: 0
    },
    iconName: {
      config: 3
    },
    iconVariant: {
      config: 3
    },
    alternativeText: {
      config: 3
    }
  },
  publicMethods: ["focus"],
  track: {
    state: 1
  }
});
const __lwc_component_class_internal = _registerComponent(LightningHelptext, {
  tmpl: _tmpl,
  sel: "lightning-helptext",
  apiVersion: 66
});
export default __lwc_component_class_internal;