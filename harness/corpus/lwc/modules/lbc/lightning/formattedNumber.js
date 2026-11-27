import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./formattedNumber.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { numberFormat } from 'lightning/internationalizationLibrary';
import { toFormattedNumber } from 'lightning/utilsPrivate';
class LightningFormattedNumber extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this.value = void 0;
    this.formatStyle = 'decimal';
    this.currencyCode = void 0;
    this.currencyDisplayAs = 'symbol';
    this.minimumIntegerDigits = void 0;
    this.minimumFractionDigits = void 0;
    this.maximumFractionDigits = void 0;
    this.minimumSignificantDigits = void 0;
    this.maximumSignificantDigits = void 0;
  }
  get formattedNumber() {
    return toFormattedNumber(this, numberFormat);
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningFormattedNumber, {
  publicProps: {
    value: {
      config: 0
    },
    formatStyle: {
      config: 0
    },
    currencyCode: {
      config: 0
    },
    currencyDisplayAs: {
      config: 0
    },
    minimumIntegerDigits: {
      config: 0
    },
    minimumFractionDigits: {
      config: 0
    },
    maximumFractionDigits: {
      config: 0
    },
    minimumSignificantDigits: {
      config: 0
    },
    maximumSignificantDigits: {
      config: 0
    }
  }
});
const __lwc_component_class_internal = _registerComponent(LightningFormattedNumber, {
  tmpl: _tmpl,
  sel: "lightning-formatted-number",
  apiVersion: 66
});
export default __lwc_component_class_internal;
LightningFormattedNumber['interopMap'] = {
  props: {
    formatStyle: 'style'
  }
};