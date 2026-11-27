import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./formattedDateTime.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { dateTimeFormat } from 'lightning/internationalizationLibrary';
import { normalizeBoolean, normalizeString, toDateTimeFormatOptions, toFormattedDate } from 'lightning/utilsPrivate';
const DATE_STYLE_DEFAULT = 'medium';
class LightningFormattedDateTime extends LightningShadowBaseClass {
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
    this._dateStyle = DATE_STYLE_DEFAULT;
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
  get dateStyle() {
    return this._dateStyle;
  }
  set dateStyle(value) {
    const normalizedValue = normalizeString(value, {
      fallbackValue: 'medium',
      validValues: ['short', 'medium', 'long']
    });
    this._dateStyle = normalizedValue;
  }
  get formattedValue() {
    return toFormattedDate(this, dateTimeFormat);
  }
  getOptions() {
    return toDateTimeFormatOptions(this);
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningFormattedDateTime, {
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
    },
    dateStyle: {
      config: 3
    }
  },
  track: {
    _hour12: 1,
    _hour12Set: 1
  },
  fields: ["_dateStyle"]
});
const __lwc_component_class_internal = _registerComponent(LightningFormattedDateTime, {
  tmpl: _tmpl,
  sel: "lightning-formatted-date-time",
  apiVersion: 66
});
export default __lwc_component_class_internal;