import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./formattedDateTime.html";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import { LightningElement, registerComponent as _registerComponent } from 'lwc';
import { dateTimeFormat } from 'c/internationalizationLibrary';
import { isValidISODateTimeString } from 'c/iso8601Utils';
import { isIE11, normalizeBoolean } from 'c/utilsPrivate';
class cFormattedDateTime extends LightningElement {
  constructor(...args) {
    super(...args);
    this.value = void 0;
    this.weekday = void 0;
    this.era = void 0;
    this.year = void 0;
    this.month = void 0;
    this.day = void 0;
    this.hour = void 0;
    this.minute = void 0;
    this.second = void 0;
    this.timeZoneName = void 0;
    this.timeZone = void 0;
    this._hour12 = false;
    this._hour12Set = false;
  }
  get hour12() {
    return this._hour12;
  }
  set hour12(value) {
    if (value === undefined) {
      this._hour12Set = false;
      this._hour12 = value;
    } else {
      this._hour12Set = true;
      this._hour12 = normalizeBoolean(value);
    }
  }
  get formattedValue() {
    return this.computeFormattedValue();
  }
  computeFormattedValue() {
    const {
      value
    } = this;
    if (!this.isEmpty(value) && this.isValid(value)) {
      const formatted = dateTimeFormat(this.getOptions()).format(value);
      if (formatted) {
        return formatted;
      }
    }
    this.printError(value);
    return '';
  }
  isEmpty(value) {
    return value === undefined || value === null || value === '';
  }
  isValid(value) {
    return isFinite(value) || isValidISODateTimeString(value);
  }
  printError(value) {
    const errorMsg = `<c-formatted-date-time> The value attribute accepts either a Date object, a timestamp, or a valid ISO8601 formatted string ` + `with timezone offset. but we are getting the ${typeof value} value "${value}" instead.`;
    console.warn(errorMsg); // eslint-disable-line no-console
  }
  getOptions() {
    const options = {
      weekday: this.weekday,
      era: this.era,
      year: this.year,
      month: this.month,
      day: this.day,
      hour: this.hour,
      minute: this.minute,
      second: this.second,
      timeZoneName: this.timeZoneName,
      timeZone: this.timeZone
    };
    if (this._hour12Set) {
      options.hour12 = this.hour12;
    }
    if (options.hour12 === false && !isIE11) {
      options.hourCycle = 'h23';
      delete options.hour12;
    }
    return options;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(cFormattedDateTime, {
  publicProps: {
    value: {
      config: 0
    },
    weekday: {
      config: 0
    },
    era: {
      config: 0
    },
    year: {
      config: 0
    },
    month: {
      config: 0
    },
    day: {
      config: 0
    },
    hour: {
      config: 0
    },
    minute: {
      config: 0
    },
    second: {
      config: 0
    },
    timeZoneName: {
      config: 0
    },
    timeZone: {
      config: 0
    },
    hour12: {
      config: 3
    }
  },
  track: {
    _hour12: 1,
    _hour12Set: 1
  }
});
const __lwc_component_class_internal = _registerComponent(cFormattedDateTime, {
  tmpl: _tmpl,
  sel: "c-formatted-date-time",
  apiVersion: 66
});
export default __lwc_component_class_internal;