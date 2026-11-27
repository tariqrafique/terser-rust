import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./primitiveButton.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
import { isIE11, normalizeBoolean, normalizeString, synchronizeAttrs } from 'c/utilsPrivate';
const ARIA_DESCRIBEDBY = 'aria-describedby';
const ARIA_CONTROLS = 'aria-controls';
class cPrimitiveButton extends LightningElement {
  get disabled() {
    return this.state.disabled;
  }
  set disabled(value) {
    this.state.disabled = normalizeBoolean(value);
  }
  set accessKey(value) {
    this.state.accesskey = value;
  }
  get accessKey() {
    return this.state.accesskey;
  }
  get computedAccessKey() {
    return this.state.accesskey;
  }
  get title() {
    return this.state.title;
  }
  set title(value) {
    this.state.title = value;
  }
  get ariaLabel() {
    return this.state.ariaLabel;
  }
  set ariaLabel(value) {
    this.state.ariaLabel = value;
  }
  get computedAriaLabel() {
    return this.state.ariaLabel;
  }
  get ariaDescribedBy() {
    return this.state.ariaDescribedBy;
  }
  set ariaDescribedBy(value) {
    this.state.ariaDescribedBy = value;
    const button = this.template.querySelector('button');
    synchronizeAttrs(button, {
      [ARIA_DESCRIBEDBY]: value
    });
  }
  get ariaControls() {
    return this.state.ariaControls;
  }
  set ariaControls(value) {
    this.state.ariaControls = value;
    const button = this.template.querySelector('button');
    synchronizeAttrs(button, {
      [ARIA_CONTROLS]: value
    });
  }
  get ariaExpanded() {
    return this.state.ariaExpanded;
  }
  set ariaExpanded(value) {
    this.state.ariaExpanded = normalizeString(value, {
      fallbackValue: undefined,
      validValues: ['true', 'false']
    });
  }
  get computedAriaExpanded() {
    return this.state.ariaExpanded || null;
  }
  set ariaLive(value) {
    this.state.ariaLive = value;
  }
  get ariaLive() {
    return this.state.ariaLive;
  }
  get computedAriaLive() {
    return this.state.ariaLive;
  }
  get ariaAtomic() {
    return this.state.ariaAtomic || null;
  }
  set ariaAtomic(value) {
    this.state.ariaAtomic = normalizeString(value, {
      fallbackValue: undefined,
      validValues: ['true', 'false']
    });
  }
  get computedAriaAtomic() {
    return this.state.ariaAtomic || null;
  }
  constructor() {
    super();
    this._initialized = false;
    this.state = {
      accesskey: null,
      ariaAtomic: null,
      ariaControls: null,
      ariaDescribedBy: null,
      ariaExpanded: null,
      ariaLabel: null,
      ariaLive: null,
      disabled: false
    };
    if (isIE11) {
      this.template.addEventListener('click', event => {
        if (this.disabled) {
          event.stopImmediatePropagation();
        }
      });
    }
  }
  renderedCallback() {
    if (!this._initialized) {
      const button = this.template.querySelector('button');
      synchronizeAttrs(button, {
        [ARIA_CONTROLS]: this.state.ariaControls,
        [ARIA_DESCRIBEDBY]: this.state.ariaDescribedBy
      });
      this._initialized = true;
    }
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(cPrimitiveButton, {
  publicProps: {
    disabled: {
      config: 3
    },
    accessKey: {
      config: 3
    },
    title: {
      config: 3
    },
    ariaLabel: {
      config: 3
    },
    ariaDescribedBy: {
      config: 3
    },
    ariaControls: {
      config: 3
    },
    ariaExpanded: {
      config: 3
    },
    ariaLive: {
      config: 3
    },
    ariaAtomic: {
      config: 3
    }
  },
  track: {
    state: 1
  },
  fields: ["_initialized"]
});
const __lwc_component_class_internal = _registerComponent(cPrimitiveButton, {
  tmpl: _tmpl,
  sel: "c-primitive-button",
  apiVersion: 66
});
export default __lwc_component_class_internal;