import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./formattedNumber.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
import { numberFormat } from 'c/internationalizationLibrary';
class cFormattedNumber extends LightningElement {
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
    const value = this.value;
    const options = {
      style: this.formatStyle,
      currency: this.currencyCode,
      currencyDisplay: this.currencyDisplayAs,
      minimumIntegerDigits: this.minimumIntegerDigits,
      minimumFractionDigits: this.minimumFractionDigits,
      maximumFractionDigits: this.maximumFractionDigits,
      minimumSignificantDigits: this.minimumSignificantDigits,
      maximumSignificantDigits: this.maximumSignificantDigits
    };
    const canReturnValue = value !== undefined && value !== null && value !== '' && isFinite(value);
    if (canReturnValue) {
      const valueAsString = value.toString();
      let valueToFormat = valueAsString;
      if (this.formatStyle === 'percent-fixed') {
        options.style = 'percent';
        valueToFormat = parseFloat(value) / 100;
        if (valueAsString.indexOf('.') > 0 && valueAsString.indexOf('e') < 0) {
          valueToFormat = valueToFormat.toFixed(valueAsString.split('.')[1].length + 2);
        }
      }
      return numberFormat(options).format(valueToFormat);
    }
    return '';
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(cFormattedNumber, {
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
const __lwc_component_class_internal = _registerComponent(cFormattedNumber, {
  tmpl: _tmpl,
  sel: "c-formatted-number",
  apiVersion: 66
});
export default __lwc_component_class_internal;
cFormattedNumber.interopMap = {
  props: {
    formatStyle: 'style'
  }
};