import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./buttonIcon.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import { classSet } from 'lightning/utils';
import { normalizeString as normalize } from 'lightning/utilsPrivate';
import { privateContext } from 'lightning/utilsInternal';
import { features } from 'lightning/features';
import { Tooltip, TooltipType } from 'lightning/tooltipLibrary';
import LightningPrimitiveButton from 'lightning/primitiveButton';
import template from './buttonIcon.html';
const DEFAULT_SIZE = 'medium';
const DEFAULT_VARIANT = 'border';
const DEFAULT_TYPE = 'button';
export const relatedTarget = Symbol('relatedTarget');
const {
  setContext,
  assertContext
} = privateContext;
class LightningButtonIcon extends LightningPrimitiveButton {
  get variant() {
    return this._originalVariant;
  }
  set variant(val) {
    this._originalVariant = val;
    this._variant = this.normalizeVariant(val);
    this.setAttribute('variant', this._variant);
  }
  get size() {
    return this._originalSize;
  }
  set size(val) {
    this._originalSize = val;
    this._size = this.normalizeSize(val);
    this.setAttribute('size', this._size);
  }
  get tooltip() {
    return this._tooltip ? this._tooltip.value : undefined;
  }
  set tooltip(value) {
    assertContext(this);
    this.tooltipValue = value;
    if (this._tooltip) {
      this._tooltip.value = value;
    } else if (value && this.rendered) {
      this.createTooltip(value);
    }
  }
  createTooltip(value) {
    this._tooltip = new Tooltip(value, {
      root: this,
      target: () => this.template.querySelector('button'),
      type: this.tooltipType,
      disableAriaDescribedBy: features.enableNoDescribedbyTooltip && value === this.alternativeText
    });
    this._tooltip.initialize();
  }
  render() {
    return template;
  }
  get computedTitle() {
    if (this.title) {
      return this.title;
    }
    if (!this.disableAlternativeTextTitle) {
      return this.alternativeText;
    }
    return null;
  }
  normalizeVariant(variant) {
    if (features.enableAssertContext260Round2) {
      assertContext(this);
    }
    return normalize(variant, {
      fallbackValue: DEFAULT_VARIANT,
      validValues: ['bare', 'brand', 'container', 'border', 'border-filled', 'bare-inverse', 'border-inverse']
    });
  }
  get normalizedType() {
    return normalize(this.type, {
      fallbackValue: DEFAULT_TYPE,
      validValues: ['button', 'reset', 'submit']
    });
  }
  normalizeSize(size) {
    return normalize(size, {
      fallbackValue: DEFAULT_SIZE,
      validValues: ['xx-small', 'x-small', 'small', 'medium', 'large']
    });
  }
  get variantBase() {
    return this._variant.split('-')[0];
  }
  get variantModifier() {
    return this._variant.split('-')[1] || '';
  }
  get computedButtonClass() {
    const classes = classSet(super.computedButtonClass);
    const isBare = this.variantBase === 'bare';
    classes.add('slds-button_icon');
    if (!isBare) {
      switch (this._size) {
        case 'small':
          classes.add('slds-button_icon-small');
          break;
        case 'x-small':
          classes.add('slds-button_icon-x-small');
          break;
        case 'xx-small':
          classes.add('slds-button_icon-xx-small');
          break;
        case 'large':
          console.warn(`<lightning-button-icon> The non-bare variants of buttonIcon do not support a size value of "large". Supported values include "xx-small", "x-small", "small", and "medium". Falling back to size value "medium".`);
        case 'medium':
        default:
      }
    }
    return classes.add({
      'slds-button_icon-bare': isBare,
      'slds-button_icon-container': this._variant === 'container',
      'slds-button_icon-border': this._variant === 'border',
      'slds-button_icon-border-filled': this._variant === 'border-filled',
      'slds-button_icon-border-inverse': this._variant === 'border-inverse',
      'slds-button_icon-inverse': this._variant === 'bare-inverse',
      'slds-button_icon-brand': this._variant === 'brand'
    }).toString();
  }
  get computedIconClass() {
    const isBare = this.variantBase === 'bare';
    const iconClass = this.iconClass || '';
    const classes = classSet('slds-button__icon');
    classes.add(iconClass);
    if (isBare) {
      switch (this._size) {
        case 'large':
          classes.add('slds-button__icon_large');
          break;
        case 'small':
          classes.add('slds-button__icon_small');
          break;
        case 'xx-small':
          console.warn(`<lightning-button-icon> The bare variant of buttonIcon does not support a size value of "xx-small". Supported values include "x-small", "small", "medium", and "large". The default is "medium".`);
        case 'x-small':
          classes.add('slds-button__icon_x-small');
          break;
        case 'medium':
        default:
      }
    }
    return classes.toString();
  }
  handleFocus(event) {
    event.stopPropagation();
    this.dispatchEvent(new CustomEvent('focus'));
  }
  handleBlur(event) {
    this.dispatchEvent(new CustomEvent('blur', {
      detail: {
        [relatedTarget]: event.relatedTarget
      }
    }));
  }
  focus() {
    if (this._connected) {
      this.template.querySelector('button').focus();
    }
  }
  click() {
    if (this._connected) {
      this.template.querySelector('button').click();
    }
  }
  constructor() {
    super();
    this._tooltipCreated = false;
    this.name = void 0;
    this.value = void 0;
    this.tabIndex = void 0;
    this._variant = DEFAULT_VARIANT;
    this._originalVariant = void 0;
    this._originalSize = void 0;
    this._connected = void 0;
    this.iconName = void 0;
    this.iconClass = void 0;
    this._size = DEFAULT_SIZE;
    this.type = DEFAULT_TYPE;
    this.alternativeText = void 0;
    this.tooltipType = TooltipType.Info;
    this.disableAlternativeTextTitle = false;
    this._tooltip = null;
    this.tooltipValue = null;
    this.rendered = false;
    setContext(this);
  }
  connectedCallback() {
    super.connectedCallback();
    this._connected = true;
  }
  renderedCallback() {
    assertContext(this);
    super.renderedCallback();
    if (this.tooltipValue && !this._tooltip) {
      this.createTooltip(this.tooltipValue);
    }
    this.template.host.style.pointerEvents = this.disabled ? 'none' : '';
    this.rendered = true;
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._connected = false;
    this.rendered = false;
    if (this._tooltip) {
      this._tooltip.disconnect();
    }
  }
  /*LWC compiler v9.5.3*/
}
LightningButtonIcon.delegatesFocus = true;
_registerDecorators(LightningButtonIcon, {
  publicProps: {
    name: {
      config: 0
    },
    value: {
      config: 0
    },
    tabIndex: {
      config: 0
    },
    variant: {
      config: 3
    },
    iconName: {
      config: 0
    },
    iconClass: {
      config: 0
    },
    size: {
      config: 3
    },
    type: {
      config: 0
    },
    alternativeText: {
      config: 0
    },
    tooltipType: {
      config: 0
    },
    disableAlternativeTextTitle: {
      config: 0
    },
    tooltip: {
      config: 3
    }
  },
  publicMethods: ["focus", "click"],
  fields: ["_tooltipCreated", "_variant", "_originalVariant", "_originalSize", "_connected", "_size", "_tooltip", "tooltipValue", "rendered"]
});
const __lwc_component_class_internal = _registerComponent(LightningButtonIcon, {
  tmpl: _tmpl,
  sel: "lightning-button-icon",
  apiVersion: 66
});
export default __lwc_component_class_internal;