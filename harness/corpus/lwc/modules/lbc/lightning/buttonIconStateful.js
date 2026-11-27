import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./buttonIconStateful.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import { classSet } from 'lightning/utils';
import { normalizeString, normalizeBoolean, reflectAttribute } from 'lightning/utilsPrivate';
import { privateContext } from 'lightning/utilsInternal';
import { Tooltip, TooltipType } from 'lightning/tooltipLibrary';
import LightningPrimitiveButton from 'lightning/primitiveButton';
const DEFAULT_SIZE = 'medium';
const DEFAULT_VARIANT = 'border';
const {
  setContext,
  assertContext
} = privateContext;
class LightningButtonIconStateful extends LightningPrimitiveButton {
  get computedTitle() {
    return this.title || this.alternativeText || null;
  }
  get normalizedVariant() {
    return normalizeString(this.variant, {
      fallbackValue: DEFAULT_VARIANT,
      validValues: ['border', 'border-filled', 'border-inverse']
    });
  }
  get normalizedSize() {
    return normalizeString(this.size, {
      fallbackValue: DEFAULT_SIZE,
      validValues: ['xx-small', 'x-small', 'small', 'medium']
    });
  }
  get selected() {
    return this.state.selected || false;
  }
  set selected(value) {
    this.state.selected = normalizeBoolean(value);
  }
  get computedAriaPressed() {
    return String(this.selected);
  }
  get computedButtonClass() {
    const classes = classSet(super.computedButtonClass);
    classes.add('slds-button_icon');
    const {
      normalizedSize,
      normalizedVariant
    } = this;
    switch (normalizedSize) {
      case 'small':
        classes.add('slds-button_icon-small');
        break;
      case 'x-small':
        classes.add('slds-button_icon-x-small');
        break;
      case 'xx-small':
        classes.add('slds-button_icon-xx-small');
        break;
      case 'medium':
      default:
    }
    classes.add({
      'slds-button_icon-border': normalizedVariant === 'border',
      'slds-button_icon-border-filled': normalizedVariant === 'border-filled',
      'slds-button_icon-border slds-button_icon-inverse': normalizedVariant === 'border-inverse',
      'slds-is-selected': this.selected === true
    });
    return classes.toString();
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
      type: this.tooltipType
    });
    this._tooltip.initialize();
  }
  focus() {
    this.template.querySelector('button').focus();
  }
  constructor() {
    super();
    this._tooltipCreated = false;
    this.name = void 0;
    this.value = void 0;
    this.variant = DEFAULT_VARIANT;
    this.iconName = void 0;
    this.size = DEFAULT_SIZE;
    this.alternativeText = void 0;
    this.rendered = void 0;
    this._tooltip = null;
    this.tooltipValue = null;
    this.tooltipType = TooltipType.Info;
    setContext(this);
  }
  renderedCallback() {
    assertContext(this);
    super.renderedCallback();
    this.template.host.style.pointerEvents = this.disabled ? 'none' : '';
    reflectAttribute(this, 'variant', this.normalizedVariant);
    reflectAttribute(this, 'size', this.normalizedSize);
    reflectAttribute(this, 'selected', this.selected);
    reflectAttribute(this, 'disabled', this.disabled);
    if (this.tooltipValue && !this._tooltip) {
      this.createTooltip(this.tooltipValue);
    }
  }
  disconnectedCallback() {
    if (this._tooltip) {
      this._tooltip.disconnect();
    }
  }
  /*LWC compiler v9.5.3*/
}
LightningButtonIconStateful.delegatesFocus = true;
_registerDecorators(LightningButtonIconStateful, {
  publicProps: {
    name: {
      config: 0
    },
    value: {
      config: 0
    },
    variant: {
      config: 0
    },
    iconName: {
      config: 0
    },
    size: {
      config: 0
    },
    alternativeText: {
      config: 0
    },
    selected: {
      config: 3
    },
    tooltip: {
      config: 3
    }
  },
  publicMethods: ["focus"],
  fields: ["_tooltipCreated", "rendered", "_tooltip", "tooltipValue", "tooltipType"]
});
const __lwc_component_class_internal = _registerComponent(LightningButtonIconStateful, {
  tmpl: _tmpl,
  sel: "lightning-button-icon-stateful",
  apiVersion: 66
});
export default __lwc_component_class_internal;