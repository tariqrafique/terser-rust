import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./formattedName.html";
import { registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import locale from '@salesforce/i18n/locale';
import { LightningElement } from 'lwc';
import { normalizeString as normalize } from 'c/utilsPrivate';
import { nameFormat } from 'c/internationalizationLibrary';
const DEFAULT_FORMAT = 'long';
class cFormattedName extends LightningElement {
  constructor(...args) {
    super(...args);
    this.format = DEFAULT_FORMAT;
    this._salutation = void 0;
    this._firstName = void 0;
    this._lastName = void 0;
    this._middleName = void 0;
    this._suffix = void 0;
    this._informalName = void 0;
  }
  get salutation() {
    return this._salutation;
  }
  set salutation(value) {
    this._salutation = value;
  }
  get firstName() {
    return this._firstName;
  }
  set firstName(value) {
    this._firstName = value;
  }
  get lastName() {
    return this._lastName;
  }
  set lastName(value) {
    this._lastName = value;
  }
  get middleName() {
    return this._middleName;
  }
  set middleName(value) {
    this._middleName = value;
  }
  get suffix() {
    return this._suffix;
  }
  set suffix(value) {
    this._suffix = value;
  }
  get informalName() {
    return this._informalName;
  }
  set informalName(value) {
    this._informalName = value;
  }
  get normalizedFormat() {
    return normalize(this.format, {
      fallbackValue: DEFAULT_FORMAT,
      validValues: ['short', 'medium', 'long']
    });
  }
  get hasValue() {
    return !!(this.salutation || this.firstName || this.lastName || this.middleName || this.suffix || this.informalName);
  }
  get formattedName() {
    const {
      normalizedFormat
    } = this;
    const nameObject = {
      first: this.firstName,
      middle: this.middleName,
      last: this.lastName,
      salutation: this.salutation,
      suffix: this.suffix,
      informal: this.informalName
    };
    let formattedName = '';
    const localeTag = locale.replace(/-/g, '_');
    switch (normalizedFormat) {
      case 'short':
        formattedName = nameFormat.formatNameShort(localeTag, nameObject);
        break;
      case 'medium':
        formattedName = nameFormat.formatNameMedium(localeTag, nameObject);
        break;
      case 'long':
      default:
        formattedName = nameFormat.formatNameLong(localeTag, nameObject);
    }
    return formattedName;
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(cFormattedName, {
  publicProps: {
    format: {
      config: 0
    },
    salutation: {
      config: 3
    },
    firstName: {
      config: 3
    },
    lastName: {
      config: 3
    },
    middleName: {
      config: 3
    },
    suffix: {
      config: 3
    },
    informalName: {
      config: 3
    }
  },
  track: {
    _salutation: 1,
    _firstName: 1,
    _lastName: 1,
    _middleName: 1,
    _suffix: 1,
    _informalName: 1
  }
});
const __lwc_component_class_internal = _registerComponent(cFormattedName, {
  tmpl: _tmpl,
  sel: "c-formatted-name",
  apiVersion: 66
});
export default __lwc_component_class_internal;