import { generateRecordInputForCreate, createRecord, generateRecordInputForUpdate, createRecordInputFilteredByEditedFields, updateRecord } from 'lightning/uiRecordApi';
import '@salesforce/i18n/locale';

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function deepCopy(obj) {
  if (Object(obj) !== obj) {
    return obj;
  }
  if (obj instanceof Set) {
    return new Set(obj);
  }
  if (obj instanceof Date) {
    return new Date(obj);
  }
  if (typeof obj === 'function') {
    return obj.bind({});
  }
  if (Array.isArray(obj)) {
    const obj2 = [];
    const len = obj.length;
    for (let i = 0; i < len; i++) {
      obj2.push(deepCopy(obj[i]));
    }
    return obj2;
  }
  const result = Object.create({});
  let keys = Object.keys(obj);
  if (obj instanceof Error) {
    keys = Object.getOwnPropertyNames(obj);
  }
  const len = keys.length;
  for (let i = 0; i < len; i++) {
    const key = keys[i];
    result[key] = deepCopy(obj[key]);
  }
  return result;
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const FieldTypes = {
  MULTI_PICKLIST: 'MultiPicklist',
  PICKLIST: 'Picklist'};

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const Fields = FieldTypes;

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function filterByPicklistsInForm(objectInfo, picklistValues, fields) {
  const picklistsInForm = getPicklistFields(objectInfo, fields);
  return filterPicklistValues(picklistValues, picklistsInForm);
}
function formHasPicklists(objectInfo, fields) {
  return getPicklistFields(objectInfo, fields).size > 0;
}
function getPicklistFields(objectInfo, fields) {
  const picklistFields = new Set();
  for (const fieldName in objectInfo.fields) {
    // eslint-disable-next-line no-prototype-builtins
    if (objectInfo.fields.hasOwnProperty(fieldName)) {
      const field = objectInfo.fields[fieldName];
      if (field.dataType === Fields.PICKLIST || field.dataType === Fields.MULTI_PICKLIST) {
        if (fields.includes(`${objectInfo.apiName}.${fieldName}`) || field.compoundFieldName && fields.includes(`${objectInfo.apiName}.${field.compoundFieldName}`)) {
          picklistFields.add(field.apiName);
        }
      }
    }
  }
  return picklistFields;
}
function filterPicklistValues(picklistsByRecordType, picklistsInForm) {
  return Object.keys(picklistsByRecordType).filter(key => picklistsInForm.has(key)).reduce((obj, key) => {
    return {
      ...obj,
      [key]: picklistsByRecordType[key]
    };
  }, {});
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const OUTPUT_FIELD_TAGNAME = 'C-OUTPUT-FIELD';
const MASTER_RECORD_TYPE_ID = '012000000000000AAA';
function normalizeRecord(newRecord) {
  const normalizedRecord = Object.assign({}, newRecord);
  normalizedRecord.fields = {};
  Object.keys(newRecord.fields).forEach(field => {
    if (newRecord.fields[field] && typeof newRecord.fields[field] === 'object') {
      normalizedRecord.fields[field] = newRecord.fields[field];
    } else {
      normalizedRecord.fields[field] = {
        value: newRecord.fields[field]
      };
    }
  });
  return normalizedRecord;
}

// eslint-disable-next-line @lwc/lwc/no-async-await
async function ldsUpdateRecord(newRecord, originalRecord, objectInfo) {
  newRecord.id = originalRecord.id;
  newRecord.apiName = null;
  const newRecordEdit = generateRecordInputForUpdate(normalizeRecord(newRecord), objectInfo);
  const recordToSave = createRecordInputFilteredByEditedFields(newRecordEdit, originalRecord);
  return updateRecord(recordToSave);
}

// eslint-disable-next-line @lwc/lwc/no-async-await
async function ldsCreateRecord(newRecord, objectInfo) {
  const normalizedRecord = normalizeRecord(newRecord);
  const recordToSave = generateRecordInputForCreate(normalizedRecord, objectInfo);
  return createRecord(recordToSave);
}

// eslint-disable-next-line @lwc/lwc/no-async-await
async function createOrSaveRecord(newRecord, originalRecord, objectInfo) {
  if (originalRecord) {
    return ldsUpdateRecord(newRecord, originalRecord, objectInfo);
  }
  return ldsCreateRecord(newRecord, objectInfo);
}
function getFormValues(inputFields) {
  const values = {};
  inputFields.forEach(field => {
    if (field.readOnly) {
      return;
    }
    if (field.value && typeof field.value === 'object') {
      if (field.value.longitude) {
        const prefix = field.fieldName.slice(0, field.fieldName.indexOf('__c'));
        values[prefix + '__Longitude__s'] = field.value.longitude;
        values[prefix + '__Latitude__s'] = field.value.latitude;
      } else {
        Object.assign(values, field.value);
      }
    } else {
      values[field.fieldName] = field.value;
    }
  });
  return values;
}
function parseError(err) {
  let message = '',
    output = {},
    detail = '';
  if (err) {
    if (err.body && err.body.output) {
      message = err.body.message;
      if (err.body.output.errors.length > 0) {
        detail = err.body.output.errors[0].message;
      } else if (err.body.detail) {
        detail = err.body.detail;
      }
      output = JSON.parse(JSON.stringify(err.body.output));
    } else if (Array.isArray(err.body) && err.body.length > 0) {
      message = err.body[0].message;
      detail = err.body[0].errorCode;
    } else if (err.body && err.body.message) {
      message = err.body.message;
      detail = err.body.detail ? err.body.detail : '';
    } else if (err.body) {
      message = err.body;
    } else if (err.statusText) {
      message.err = err.statusText;
    } else if (err.message) {
      message = err.message;
    } else {
      message = err;
    }
  }
  return {
    message,
    detail,
    output
  };
}
function createErrorEvent(err) {
  const parsed = parseError(err);
  return new CustomEvent('error', {
    detail: parsed
  });
}
class FieldSet {
  constructor(objectApiName) {
    this._set = new Set();
    this._apiName = objectApiName;
  }
  set objectApiName(objectApiName) {
    this._apiName = objectApiName;
  }
  add(val) {
    this._set.add(val);
  }
  concat(arr) {
    arr.forEach(item => {
      this.add(item);
    });
  }
  getList() {
    const apiName = this._apiName;
    return [...this._set].map(field => {
      return `${apiName}.${field}`;
    });
  }
  getUnqualifiedList() {
    return [...this._set];
  }
}
function validateForm(inputFields) {
  let isValid = true;
  inputFields.forEach(cmp => {
    if (cmp.tagName === OUTPUT_FIELD_TAGNAME || !cmp.reportValidity) {
      return;
    }
    if (!cmp.reportValidity()) {
      isValid = false;
    }
  });
  return isValid;
}
function getFieldSet(objectApiName) {
  return new FieldSet(objectApiName);
}
function getRecordTypeId(recordUi) {
  const record = recordUi.record;
  const objectInfo = recordUi.objectInfo;
  const defaultRecordTypeId = objectInfo.defaultRecordTypeId || MASTER_RECORD_TYPE_ID;
  if (!record.id) {
    return defaultRecordTypeId;
  }
  return record.recordTypeId || defaultRecordTypeId;
}

export { createErrorEvent, createOrSaveRecord, deepCopy, filterByPicklistsInForm, formHasPicklists, getFieldSet, getFormValues, getRecordTypeId, ldsCreateRecord, ldsUpdateRecord, parseError, validateForm };