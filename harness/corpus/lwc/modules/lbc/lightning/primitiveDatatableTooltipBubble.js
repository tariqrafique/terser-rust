import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./primitiveDatatableTooltipBubble.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classListMutation, keyCodes } from 'lightning/utilsPrivate';
import { classSet } from 'lightning/utils';
import labelCloseButtonAssistiveText from '@salesforce/label/LightningDatatable.closeButtonAssistiveText';
const i18n = {
  closeButtonAssistiveText: labelCloseButtonAssistiveText
};
const DEFAULT_ALIGN = {
  horizontal: 'left',
  vertical: 'bottom'
};
class LightningPrimitiveDatatableTooltipBubble extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this._inDom = false;
    this._visible = false;
    this._align = DEFAULT_ALIGN;
    this.anchor = void 0;
    this.header = '';
    this.content = '';
    this.variant = 'bare';
    this.hideCloseButton = false;
    this.handleBlur = evt => {
      const isValidBlur = evt.relatedTarget === null || !this.template.contains(evt.relatedTarget);
      if (isValidBlur) {
        this.handleBubbleFocusLost();
      }
    };
    this.handleBubbleFocusLost = () => {
      this.dispatchCloseButtonEvent('bubbleLoseFocus');
    };
    this.handleBubbleKey = event => {
      if (keyCodes.escape === event.keyCode) {
        this.dispatchCloseButtonEvent();
      }
      if (keyCodes.tab === event.keyCode) {
        event.preventDefault();
        event.stopPropagation();
        this.focus();
      }
    };
    this.handleCloseButtonClick = () => {
      this.dispatchCloseButtonEvent();
    };
    this.handleCloseButtonKey = event => {
      event.preventDefault();
      event.stopPropagation();
      const keysToClose = [keyCodes.enter, keyCodes.space, keyCodes.escape];
      if (keysToClose.includes(event.keyCode)) {
        this.dispatchCloseButtonEvent();
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this._inDOM = true;
    this.updateClassList();
  }
  disconnectedCallback() {
    this._inDOM = false;
  }
  get align() {
    return this._align;
  }
  set align(value) {
    this._align = value;
    if (this._inDOM) {
      this.updateClassList();
    }
  }
  get visible() {
    return this._visible;
  }
  set visible(value) {
    this._visible = value;
    if (this._inDOM) {
      this.updateClassList();
    }
  }
  focus() {
    this.closeButton.focus();
  }
  get i18n() {
    return i18n;
  }
  get isContentList() {
    return Array.isArray(this.content);
  }
  get computedHeaderIconName() {
    switch (this.variant) {
      case 'error':
        return 'utility:ban';
      case 'warning':
        return 'utility:warning';
      case 'bare':
      default:
        return 'utility:info';
    }
  }
  get closeButton() {
    return this.refs.closeBtn;
  }
  updateClassList() {
    const classes = classSet('slds-popover');
    classes.add({
      'slds-popover_error': this.variant === 'error',
      'slds-popover_warning': this.variant === 'warning'
    });
    classes.add({
      'slds-rise-from-ground': this._visible === true,
      'slds-fall-into-ground': this._visible === false
    });
    const {
      horizontal,
      vertical
    } = this.align;
    classes.add({
      'slds-nubbin_top-left': horizontal === 'left' && vertical === 'top',
      'slds-nubbin_top-right': horizontal === 'right' && vertical === 'top',
      'slds-nubbin_bottom-left': horizontal === 'left' && vertical === 'bottom',
      'slds-nubbin_bottom-right': horizontal === 'right' && vertical === 'bottom'
    });
    classListMutation(this.classList, classes);
  }
  dispatchCloseButtonEvent(reason) {
    this.dispatchEvent(new CustomEvent('close', {
      detail: {
        reason: reason || 'userCloseBubble',
        anchor: this.anchor
      }
    }));
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningPrimitiveDatatableTooltipBubble, {
  publicProps: {
    anchor: {
      config: 0
    },
    header: {
      config: 0
    },
    content: {
      config: 0
    },
    variant: {
      config: 0
    },
    hideCloseButton: {
      config: 0
    },
    align: {
      config: 3
    },
    visible: {
      config: 3
    }
  },
  publicMethods: ["focus"],
  track: {
    _align: 1
  },
  fields: ["_inDom", "_visible", "handleBlur", "handleBubbleFocusLost", "handleBubbleKey", "handleCloseButtonClick", "handleCloseButtonKey"]
});
const __lwc_component_class_internal = _registerComponent(LightningPrimitiveDatatableTooltipBubble, {
  tmpl: _tmpl,
  sel: "lightning-primitive-datatable-tooltip-bubble",
  apiVersion: 66
});
export default __lwc_component_class_internal;