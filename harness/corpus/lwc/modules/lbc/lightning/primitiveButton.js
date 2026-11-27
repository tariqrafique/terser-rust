import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./primitiveButton.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { isIE11, normalizeBoolean, normalizeString, buttonGroupOrderClass } from 'lightning/utilsPrivate';
import { classSet } from 'lightning/utils';
import AriaObserver from 'lightning/ariaObserver';
class LightningPrimitiveButton extends LightningShadowBaseClass {
  set disabled(value) {
    this.originalDisabledValue = value;
    this.state.disabled = normalizeBoolean(value);
  }
  get disabled() {
    return this.state.disabled;
  }
  set ariaLabelledBy(value) {
    this.originalAriaLabelledBy = value;
    this.ariaObserver.connect({
      targetSelector: 'button',
      attribute: 'aria-labelledby',
      relatedNodeIds: value
    });
  }
  get ariaLabelledBy() {
    return this.originalAriaLabelledBy;
  }
  set ariaDescribedBy(value) {
    this.originalAriaDescribedBy = value;
    this.ariaObserver.connect({
      targetSelector: 'button',
      attribute: 'aria-describedby',
      relatedNodeIds: value
    });
  }
  get ariaDescribedBy() {
    return this.originalAriaDescribedBy;
  }
  set ariaControls(value) {
    this.originalAriaControls = value;
    this.setAttribute('aria-controls', value);
  }
  get ariaControls() {
    return this.originalAriaControls;
  }
  set ariaOwns(value) {
    this.originalAriaOwns = value;
    this.setAttribute('aria-owns', value);
  }
  get ariaOwns() {
    return this.originalAriaOwns;
  }
  set ariaDetails(value) {
    this.originalAriaDetails = value;
    this.setAttribute('aria-details', value);
  }
  get ariaDetails() {
    return this.originalAriaDetails;
  }
  set ariaFlowTo(value) {
    this.originalAriaFlowTo = value;
    this.setAttribute('aria-flowto', value);
  }
  get ariaFlowTo() {
    return this.originalAriaFlowTo;
  }
  get ariaExpanded() {
    return this.originalAriaExpanded !== undefined ? String(this.originalAriaExpanded) : null;
  }
  set ariaExpanded(value) {
    this.originalAriaExpanded = value;
    if (typeof value === 'string') {
      this.state.ariaExpanded = normalizeString(value, {
        fallbackValue: null,
        validValues: ['true', 'false']
      });
    } else if (typeof value === 'boolean') {
      this.state.ariaExpanded = normalizeBoolean(value);
    }
  }
  get computedAriaExpanded() {
    return this.state.ariaExpanded;
  }
  set ariaPressed(value) {
    this.originalAriaPressed = value;
    this.state.ariaPressed = normalizeString(value, {
      fallbackValue: null,
      validValues: ['true', 'false']
    });
  }
  get ariaPressed() {
    return this.originalAriaPressed;
  }
  get computedAriaPressed() {
    return this.state.ariaPressed;
  }
  set ariaHidden(value) {
    this.originalAriaHidden = value;
    this.state.ariaHidden = normalizeString(value, {
      fallbackValue: null,
      validValues: ['true', 'false']
    });
  }
  get ariaHidden() {
    return this.originalAriaHidden;
  }
  get computedAriaHidden() {
    return this.state.ariaHidden;
  }
  set ariaHasPopup(value) {
    this.originalAriaHasPopup = value;
    this.state.ariaHasPopup = normalizeString(value, {
      fallbackValue: null,
      validValues: ['true', 'dialog', 'menu', 'listbox', 'tree', 'grid']
    });
  }
  get ariaHasPopup() {
    return this.originalAriaHasPopup;
  }
  get computedAriaHasPopup() {
    return this.state.ariaHasPopup;
  }
  set ariaRelevant(value) {
    this.originalAriaRelevant = value;
    this.state.ariaRelevant = normalizeString(value, {
      fallbackValue: null,
      validValues: ['additions', 'removals', 'text', 'all']
    });
  }
  get ariaRelevant() {
    return this.originalAriaRelevant;
  }
  get computedAriaRelevant() {
    return this.state.ariaRelevant;
  }
  set ariaLive(value) {
    this.originalAriaLive = value;
    this.state.ariaLive = normalizeString(value, {
      fallbackValue: null,
      validValues: ['polite', 'assertive', 'off']
    });
  }
  get ariaLive() {
    return this.originalAriaLive;
  }
  get computedAriaLive() {
    return this.state.ariaLive;
  }
  set ariaAtomic(value) {
    this.originalAriaAtomic = value;
    this.state.ariaAtomic = normalizeString(value, {
      fallbackValue: null,
      validValues: ['true', 'false']
    });
  }
  get ariaAtomic() {
    return this.originalAriaAtomic;
  }
  get computedAriaAtomic() {
    return this.state.ariaAtomic;
  }
  set ariaBusy(value) {
    this.originalAriaBusy = value;
    this.state.ariaBusy = normalizeString(value, {
      fallbackValue: null,
      validValues: ['true', 'false']
    });
  }
  get ariaBusy() {
    return this.originalAriaBusy;
  }
  get computedAriaBusy() {
    return this.state.ariaBusy;
  }
  get computedButtonClass() {
    const classes = classSet('slds-button');
    classes.add(buttonGroupOrderClass(this.groupOrder));
    return classes.toString();
  }
  focus() {}
  constructor() {
    super();
    this._initialized = false;
    this.state = {
      ariaAtomic: null,
      ariaBusy: null,
      ariaControls: null,
      ariaDetails: null,
      ariaDescribedBy: null,
      ariaExpanded: null,
      ariaFlowTo: null,
      ariaHasPopup: null,
      ariaHidden: null,
      ariaLabelledBy: null,
      ariaLive: null,
      ariaOwns: null,
      ariaPressed: null,
      ariaRelevant: null,
      disabled: false
    };
    this.ariaObserver = void 0;
    this.originalAriaAtomic = void 0;
    this.originalAriaBusy = void 0;
    this.originalAriaControls = void 0;
    this.originalAriaDetails = void 0;
    this.originalAriaDescribedBy = void 0;
    this.originalAriaExpanded = void 0;
    this.originalAriaFlowTo = void 0;
    this.originalAriaHasPopup = void 0;
    this.originalAriaHidden = void 0;
    this.originalAriaLabelledBy = void 0;
    this.originalAriaLive = void 0;
    this.originalAriaOwns = void 0;
    this.originalAriaPressed = void 0;
    this.originalAriaRelevant = void 0;
    this.originalDisabledValue = void 0;
    this.accessKey = void 0;
    this.title = void 0;
    this.ariaLabel = void 0;
    this.ariaCurrent = void 0;
    this.ariaKeyShortcuts = void 0;
    this.groupOrder = '';
    this.ariaObserver = new AriaObserver(this);
    if (isIE11 && !import.meta.env.SSR) {
      this.template.addEventListener('click', event => {
        if (this.disabled) {
          event.stopImmediatePropagation();
        }
      });
    }
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.ariaObserver) {
      this.ariaObserver = new AriaObserver(this);
    }
  }
  renderedCallback() {
    if (this.isConnected) {
      this.ariaObserver.sync();
    }
  }
  disconnectedCallback() {
    if (this.ariaObserver) {
      this.ariaObserver.disconnect();
      this.ariaObserver = undefined;
    }
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningPrimitiveButton, {
  publicProps: {
    disabled: {
      config: 3
    },
    accessKey: {
      config: 0
    },
    title: {
      config: 0
    },
    ariaLabel: {
      config: 0
    },
    ariaLabelledBy: {
      config: 3
    },
    ariaDescribedBy: {
      config: 3
    },
    ariaControls: {
      config: 3
    },
    ariaOwns: {
      config: 3
    },
    ariaDetails: {
      config: 3
    },
    ariaFlowTo: {
      config: 3
    },
    ariaExpanded: {
      config: 3
    },
    ariaPressed: {
      config: 3
    },
    ariaHidden: {
      config: 3
    },
    ariaCurrent: {
      config: 0
    },
    ariaKeyShortcuts: {
      config: 0
    },
    ariaHasPopup: {
      config: 3
    },
    ariaRelevant: {
      config: 3
    },
    ariaLive: {
      config: 3
    },
    ariaAtomic: {
      config: 3
    },
    ariaBusy: {
      config: 3
    },
    groupOrder: {
      config: 0
    }
  },
  publicMethods: ["focus"],
  track: {
    state: 1
  },
  fields: ["_initialized", "ariaObserver", "originalAriaAtomic", "originalAriaBusy", "originalAriaControls", "originalAriaDetails", "originalAriaDescribedBy", "originalAriaExpanded", "originalAriaFlowTo", "originalAriaHasPopup", "originalAriaHidden", "originalAriaLabelledBy", "originalAriaLive", "originalAriaOwns", "originalAriaPressed", "originalAriaRelevant", "originalDisabledValue"]
});
const __lwc_component_class_internal = _registerComponent(LightningPrimitiveButton, {
  tmpl: _tmpl,
  sel: "lightning-primitive-button",
  apiVersion: 66
});
export default __lwc_component_class_internal;