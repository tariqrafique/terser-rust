export { getPicklistValuesByRecordType, getRecordCreateDefaults, getRecordUi } from 'force/wireServiceMocks';
import { mockDataRetriever } from 'force:mockDataLibrary';

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const INVALID_INPUT_COMBINATION = {
  ok: false,
  status: 400,
  statusText: 'Bad Request',
  body: [{
    errorCode: 'INVALID_INPUT_COMBINATION',
    message: "Must provide either 'fields' or 'layoutTypes'."
  }]
};
const ILLEGAL_QUERY_PARAMETER_VALUE = {
  ok: false,
  status: 400,
  statusText: 'Bad Request',
  body: [{
    errorCode: 'ILLEGAL_QUERY_PARAMETER_VALUE',
    message: 'Record input is required for PATCH.'
  }]
};
const POST_BODY_PARSE_ERROR = {
  ok: false,
  status: 400,
  statusText: 'Bad Request',
  body: [{
    message: "Value for field 'Name' in object 'Bad_Guy__c' with data type 'STRING' should be a String but instead is a Integer.",
    errorCode: 'POST_BODY_PARSE_ERROR'
  }]
};
const VALIDATION_ERROR = {
  ok: false,
  status: 400,
  statusText: 'Bad Request',
  body: {
    message: 'An error occurred while trying to update the record. Please try again.',
    enhancedErrorType: 'RecordError',
    output: {
      errors: [{
        constituentField: null,
        duplicateRecordError: null,
        errorCode: 'FIELD_CUSTOM_VALIDATION_EXCEPTION',
        field: null,
        fieldLabel: null,
        message: 'The color must be yellow'
      }],
      fieldErrors: {}
    }
  }
};
const FIELD_ERROR = {
  ok: false,
  status: 400,
  statusText: 'Bad Request',
  body: {
    enhancedErrorType: 'RecordError',
    message: 'An error occurred while trying to update the record. Please try again.',
    stackTrace: 'core.connect.api.ConnectInJavaException: An error occurred while trying to update the record. Please try again.\n\tat core.connect.java.direct.JavaResourceWrapper.makeJavaErrorWithOutputRepException(JavaResourceWrapper.java:630)\n\tat core.connect.java.direct.JavaResourceWrapper.patch(JavaResourceWrapper.java:244)\n\tat sfdc.uisdk.connect.api.wrappers.direct.RecordUiDirect.updateRecord(RecordUiDirect.java:949)\n\tat ui.force.components.controllers.UiApiController$12.run(UiApiController.java:270)\n\tat ui.force.components.controllers.UiApiController$12.run(UiApiController.java:1)',
    statusCode: 400,
    output: {
      errors: [],
      fieldErrors: {
        // eslint-disable-next-line camelcase
        Email_Address__c: [{
          constituentField: null,
          duplicateRecordError: null,
          errorCode: 'INVALID_EMAIL_ADDRESS',
          field: 'Email_Address__c',
          fieldLabel: 'Email Address',
          message: 'Email Address: invalid email address: s'
        }]
      }
    }
  }
};
const REQUIRED_FIELD_MISSING = {
  ok: false,
  status: 400,
  statusText: 'Bad Request',
  body: {
    enhancedErrorType: 'RecordError',
    message: 'An error occurred while trying to update the record. Please try again.',
    output: {
      errors: [],
      fieldErrors: {
        Name: [{
          constituentField: 'Name',
          duplicateRecordError: null,
          errorCode: 'REQUIRED_FIELD_MISSING',
          field: 'Name',
          fieldLabel: 'Account Name',
          message: 'Required fields are missing: [Name]'
        }]
      }
    }
  }
};
const NOT_FOUND = {
  ok: false,
  status: 400,
  statusText: 'Bad Request',
  body: [{
    errorCode: 'NOT_FOUND',
    message: 'The requested resource does not exist'
  }]
};
const DISCONNECTED = {
  ok: false,
  status: 400,
  statusText: 'Bad Request',
  body: {
    message: 'Disconnected or Canceled'
  }
};
const RESPONSES = {
  INVALID_INPUT_COMBINATION,
  ILLEGAL_QUERY_PARAMETER_VALUE,
  POST_BODY_PARSE_ERROR,
  FIELD_ERROR,
  REQUIRED_FIELD_MISSING,
  NOT_FOUND,
  VALIDATION_ERROR,
  DISCONNECTED
};

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

class RecordInput {
  constructor() {
    this.apiName = void 0;
    this.fields = void 0;
    this.fields = {};
  }
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function getImmutable(obj) {
  return obj;
}
function getImmutableObservable(promise) {
  return {
    subscribe: config => {
      promise.then(value => {
        config.next(getImmutable(value));
      }).catch(config.error);
      return {
        unsubscribe: () => {}
      };
    }
  };
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const RECORD_UI_REPRESENTATION = window.RECORD_UI_REPRESENTATION;
const PICKLIST_REPRESENTATION = window.PICKLIST_REPRESENTATION;
const store = {
  RECORD_UI_REPRESENTATION,
  PICKLIST_REPRESENTATION
};
function getLookupActions(dataCallback) {
  return new this.constructor.adapter(dataCallback);
}
const typeUtils = {
  isPlainObject
};
function deepFreeze(value) {
  let response = value;
  if (typeUtils.isPlainObject(value)) {
    response = {};
    const valueKeysArray = Object.keys(value);
    for (let len = valueKeysArray.length, n = 0; n < len; n++) {
      const key = valueKeysArray[n];
      response[key] = deepFreeze(value[key]);
    }
  } else if (Array.isArray(value)) {
    response = value.map(val => deepFreeze(val));
  }
  return Object.freeze(response);
}
function getValueForAura(value) {
  return deepFreeze(value);
}
function getListUi() {}
function getLookupRecords(data) {
  return new this.constructor.adapter(data);
}
function checkType(value, type, required) {
  const req = required === undefined ? true : required;
  if (value === undefined) {
    throw new Error('Variable cannot be defined as undefined.');
  }
  if (value === null) {
    if (req) {
      throw new Error('Unexpected null value.');
    }
  } else if (type === Function) {
    if (!isFunction(value)) {
      throw new Error('Value is not of type function, got: ' + value + '.');
    }
  } else if (type === Array && !Array.isArray(value)) {
    throw new Error('Value does not have expected type: ' + type.name + ', got: ' + value + '.');
  } else if (type === Object ? !isPlainObject(value) : !type.prototype.isPrototypeOf(Object(value)) && type !== Array) {
    throw new Error('Value does not have expected type: ' + type.name + ', got: ' + value + '.');
  }
}
function checkArray(value, required, innerType, innerRequired) {
  checkType(value, Array, required);
  if (value !== null) {
    value.forEach(val => {
      checkType(val, innerType, innerRequired);
    });
  }
}
function isFunction(value) {
  const type = typeof value;
  if (type === 'function') {
    return true;
  }
  return false;
}
function checkPlainObject(value, required, innerType, innerRequired) {
  checkType(value, Object, required);
  if (value !== null) {
    Object.keys(value).forEach(key => {
      checkType(value[key], innerType, innerRequired);
    });
  }
}
function isPlainObject(value) {
  const objectProto = value !== null && typeof value === 'object' && Object.getPrototypeOf(value);
  return value !== null && typeof value === 'object' && (value.constructor && value.constructor.name === 'Object' || objectProto && objectProto.constructor && objectProto.constructor.name === 'Object');
}
function freeze(value) {
  let response = value;
  if (isPlainObject(value)) {
    response = {};
    Object.keys(value).forEach(key => {
      response[key] = freeze(value[key]);
    });
  } else if (Array.isArray(value)) {
    response = value.map(val => freeze(val));
  }
  return Object.freeze(response);
}
function proxyLock(value) {
  const handler = {
    get: (target, key) => {
      value = target[key];
      if (value && typeof value === 'object') {
        return proxyLock(value);
      }
      return value;
    },
    set: () => {
      return false;
    },
    deleteProperty: () => {
      return false;
    }
  };
  return new Proxy(value, handler);
}
function equivalent(value1, value2, maxDepth) {
  if (value1 === value2) {
    return true;
  } else if (typeof value1 === 'object' && typeof value2 === 'object') {
    const value1Keys = Object.keys(value1);
    return value1Keys.length === Object.keys(value2).length && (maxDepth === 0 || value1Keys.every(key => equivalent(value1[key], value2[key], maxDepth ? maxDepth - 1 : undefined)));
  } else if (Array.isArray(value1) && Array.isArray(value2)) {
    return value1.length === value2.length && (maxDepth === 0 || value1.every((value, ind) => equivalent(value, value2[ind], maxDepth ? maxDepth - 1 : undefined)));
  }
  return false;
}
function createInterface(methods) {
  checkArray(methods, true, String);
  const response = {};
  methods.forEach(method => {
    response[method] = () => {
      throw new Error('The method is not implemented: ' + method + '.');
    };
  });
  return createClass(null, null, response);
}
function createClass(inter, constructor, methods) {
  checkType(inter, Function, false);
  checkType(constructor, Function, false);
  checkPlainObject(methods, true, Function);
  const response = constructor === null ? function () {} : constructor;
  response.prototype = inter === null ? {} : Object.create(inter.prototype);
  response.prototype.constructor = response;
  Object.keys(methods).forEach(key => {
    response.prototype[key] = methods[key];
  });
  return response;
}
class LdsError extends Error {
  constructor(id, errorMessage, data) {
    super(errorMessage);
    if (id) {
      this.id = id;
    }
    this.data = data;
  }
  /*LWC compiler v9.5.3*/
}
function addAllToSet(set, values) {
  values.forEach(item => {
    set.add(item);
  });
}
function setContainsAll(set, values) {
  for (let c = 0; c < values.length; ++c) {
    if (!set.has(values[c])) {
      return false;
    }
  }
  return true;
}
class MappedQueue {
  constructor() {
    this._map = new Map();
    this._back = null;
    this._front = null;
  }
  enqueue(key, value) {
    if (this._map.has(key)) {
      this.remove(key);
    }
    const entry = {
      key,
      value,
      previous: this._back
    };
    if (this._back) {
      this._back.next = entry;
    } else {
      this._front = entry;
    }
    this._back = entry;
    this._map.set(key, entry);
  }
  dequeue() {
    const entry = this._front;
    if (!entry) {
      return undefined;
    }
    this.remove(entry.key);
    return [entry.key, entry.value];
  }
  remove(key) {
    const entry = this._map.get(key);
    if (entry) {
      this._map.delete(key);
      if (entry === this._back) {
        this._back = entry.previous;
      } else {
        entry.next.previous = entry.previous;
      }
      if (entry === this._front) {
        this._front = entry.next;
      } else {
        entry.previous.next = entry.next;
      }
    }
  }
  getSize() {
    return this._map.size;
  }
}
function handleNextObservation(observable, nextFn, errorFn, completeFn) {
  const observer = {
    done: false,
    subscription: undefined,
    finish: sub => {
      if (!observer.subscription && sub) {
        observer.subscription = sub;
      }
      if (observer.done && observer.subscription) {
        observer.subscription.unsubscribe();
      }
    },
    next: value => {
      if (!observer.done && nextFn) {
        nextFn(value);
        observer.done = true;
        observer.finish();
      }
    },
    error: error => {
      if (!observer.done && errorFn) {
        errorFn(error);
        observer.done = true;
        observer.finish();
      }
    },
    complete: () => {
      if (!observer.done && completeFn) {
        completeFn();
        observer.done = true;
        observer.finish();
      }
    }
  };
  const subscription = observable.subscribe(observer);
  observer.finish(subscription);
}
const mockFieldInfo = {
  calculated: false,
  compound: false,
  compoundComponentName: null,
  compoundFieldName: null,
  controllerName: null,
  createable: true,
  custom: true,
  dataType: 'String',
  extraTypeInfo: null,
  filterable: true,
  filteredLookupInfo: null,
  highScaleNumber: false,
  htmlFormatted: false,
  inlineHelpText: null,
  label: 'Optional Field Label',
  length: 255,
  nameField: false,
  polymorphicForeignKey: false,
  precision: 0,
  reference: false,
  referenceTargetField: null,
  referenceToInfos: [],
  relationshipName: null,
  required: false,
  scale: 0,
  searchPrefilterable: false,
  sortable: true,
  unique: false,
  updateable: true
};
function getMockFieldInfo(apiName) {
  const result = mockFieldInfo;
  result.apiName = apiName;
  return result;
}
window.RECORD_CREATE_COUNT = 0;
window.RECORD_SAVE_COUNT = 0;
function createRecordInputFilteredByEditedFields(recordInput, originalRecord) {
  if (!recordInput) {
    throw new Error('recordInput must be defined');
  }
  if (!originalRecord) {
    throw new Error('originalRecord must be defined');
  }
  const filteredRecordInput = new RecordInput();
  filteredRecordInput.apiName = originalRecord.apiName;
  Object.getOwnPropertyNames(recordInput.fields).forEach(fieldName => {
    const hasOriginalRecordFieldValue = originalRecord && originalRecord.fields && originalRecord.fields[fieldName] ? true : false;
    if (!hasOriginalRecordFieldValue || recordInput.fields[fieldName] !== originalRecord.fields[fieldName].value) {
      filteredRecordInput.fields[fieldName] = recordInput.fields[fieldName];
    }
  });
  return filteredRecordInput;
}
function generateRecordInputForUpdate(record, objectInfo) {
  const recordInput = generateRecordInputForCreate(record, objectInfo);
  if (!record.id) {
    throw new Error('record must have id for update');
  }
  recordInput.fields.Id = record.id;
  return recordInput;
}
function generateRecordInputForCreate(record, objectInfo) {
  if (!record) {
    throw new TypeError('record must be defined');
  }
  const recordInput = new RecordInput();
  recordInput.apiName = record.apiName;
  Object.getOwnPropertyNames(record.fields).forEach(fieldName => {
    if (fieldName === 'RecordTypeId') {
      recordInput.fields[fieldName] = record.fields[fieldName].value;
    }
    if (record.fields[fieldName].value === null || typeof record.fields[fieldName].value !== 'object') {
      if (objectInfo) {
        if (objectInfo.fields && objectInfo.fields[fieldName] && objectInfo.fields[fieldName].updateable === true) {
          recordInput.fields[fieldName] = record.fields[fieldName].value;
        }
      } else {
        recordInput.fields[fieldName] = record.fields[fieldName].value;
      }
    }
  });
  return recordInput;
}
async function updateRecord(recordInput) {
  checkType(recordInput, RecordInput, true);
  window.RECORD_SAVE_COUNT++;
  if (!recordInput.fields || !recordInput.fields.Id) {
    throw new Error('recordInput must have its fields.Id property set');
  }
  window.LAST_SAVED_RECORD = recordInput;
  const resultPromise = new Promise((resolve, reject) => {
    if (window.RECORD_UI_CURRENT_ERROR) {
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(() => {
        // eslint-disable-next-line no-console
        console.error('Sending fake error', window.RECORD_UI_CURRENT_ERROR);
        reject(window.RECORD_UI_CURRENT_ERROR);
      }, 500);
    } else {
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(() => {
        // eslint-disable-next-line no-console
        console.info('Record "updated"', recordInput);
        resolve({
          records: {
            [recordInput.fields.id]: recordInput
          }
        });
      }, 500);
    }
  });
  return resultPromise;
}
function createRecord(recordInput) {
  checkType(recordInput, RecordInput, true);
  window.RECORD_CREATE_COUNT++;
  window.LAST_SAVED_RECORD = JSON.parse(JSON.stringify(recordInput));
  const resultPromise = new Promise((resolve, reject) => {
    if (window.RECORD_UI_CURRENT_ERROR) {
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(() => {
        reject(window.RECORD_UI_CURRENT_ERROR);
      }, 500);
    } else {
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(() => {
        const returnRecord = recordInput;
        returnRecord.id = parseInt(Math.random() * 100000000000, 10).toString(36);
        returnRecord.eTag = '1337';
        returnRecord.childRelationships = {};
        resolve(returnRecord);
      }, 1000);
    }
  });
  return resultPromise;
}
function packageMockRecordUi(recordId, optionalFields) {
  recordId = recordId.replace(/;.+/, '');
  const record = store.RECORD_UI_REPRESENTATION.records[recordId];
  const ret = packageMissingFields({
    ...store.RECORD_UI_REPRESENTATION
  }, optionalFields);
  if (!record) {
    return Promise.reject(new Error(`record ${recordId} not found`));
  }
  return Promise.resolve(ret);
}
function packageMissingFields(recordUi, optionalFields) {
  optionalFields.forEach(qualifiedField => {
    const tokenizedField = qualifiedField.split('.');
    const entity = tokenizedField[0];
    const field = tokenizedField[1];
    const objectInfo = recordUi.objectInfos[entity];
    if (objectInfo) {
      const fieldInfo = objectInfo.fields[field];
      if (!fieldInfo) {
        recordUi.objectInfos[entity].fields[field] = getMockFieldInfo(field);
      }
    }
  });
  return recordUi;
}
function packageMockPicklistData(objectApiName, recordTypeId, fieldApiName) {
  const object = store.PICKLIST_REPRESENTATION[objectApiName];
  if (!object) {
    return Promise.reject(new Error(`no picklist values found for object ${objectApiName}`));
  } else if (!object[recordTypeId]) {
    return Promise.reject(new Error(`no picklist values found for record type ${recordTypeId} of object ${objectApiName}`));
  } else if (!object[recordTypeId][fieldApiName]) {
    return Promise.reject(new Error(`picklist values for ${fieldApiName} not found on object ${objectApiName}`));
  }
  return Promise.resolve(object[recordTypeId][fieldApiName]);
}
function packageMockPicklistDataByRecordType(objectApiName, recordTypeId) {
  const object = store.PICKLIST_REPRESENTATION[objectApiName];
  if (!object) {
    return Promise.reject(new Error(`no picklist values found for object ${objectApiName}`));
  } else if (!object[recordTypeId]) {
    return Promise.reject(new Error(`no picklist values found for record type ${recordTypeId} of object ${objectApiName}`));
  }
  return Promise.resolve({
    picklistFieldValues: object[recordTypeId]
  });
}
async function createRecordImpl(recordInput) {
  const record = await createRecord(recordInput);
  if (store.RECORD_UI_REPRESENTATION) {
    store.RECORD_UI_REPRESENTATION.records[record.id] = record;
  }
  // eslint-disable-next-line no-console
  return record;
}
async function getMockDefaults(objectApiName) {
  const result = await mockDataRetriever.fetchMockData();
  store.RECORD_UI_REPRESENTATION = result;
  const ret = {};
  let recordIdForDefaults;
  const keys = Object.keys(result.records);
  for (let i = 0; i < keys.length; i++) {
    if (result.records[keys[i]].apiName === objectApiName) {
      recordIdForDefaults = keys[i];
      break;
    }
  }
  ret.objectInfos = result.objectInfos;
  ret.record = result.records[recordIdForDefaults];
  for (const field in ret.record.fields) {
    if (typeof ret.record.fields[field].value === 'string' && ret.record.fields[field].value === '') {
      ret.record.fields[field].value = null;
    }
  }
  if (ret.record.fields.Description__c) {
    ret.record.fields.Description__c.value = null;
  }
  ret.record.id = null;
  return ret;
}
function getMockRecordUi(recordId, optionalFields) {
  let ret;
  if (store.RECORD_UI_REPRESENTATION) {
    ret = packageMockRecordUi(recordId, optionalFields);
  } else {
    ret = mockDataRetriever.fetchMockData().then(result => {
      store.RECORD_UI_REPRESENTATION = result;
      return packageMockRecordUi(recordId, optionalFields);
    });
  }
  return ret;
}
function getMockObjectInfo(objectApiName) {
  const objectInfo = store.RECORD_UI_REPRESENTATION.objectInfos[objectApiName];
  if (!objectInfo) {
    return Promise.reject(new Error(`objectInfo ${objectApiName} not found`));
  }
  return objectInfo;
}
function getMockPicklistValues(objectApiName, recordTypeId, fieldApiName) {
  let ret;
  if (window.PICKLIST_REPRESENTATION) {
    store.PICKLIST_REPRESENTATION = window.PICKLIST_REPRESENTATION;
  }
  if (store.PICKLIST_REPRESENTATION) {
    ret = packageMockPicklistData(objectApiName, recordTypeId, fieldApiName);
  } else {
    ret = mockDataRetriever.fetchMockPicklistData().then(result => {
      store.PICKLIST_REPRESENTATION = result;
      return packageMockPicklistData(objectApiName, recordTypeId, fieldApiName);
    });
  }
  return ret;
}
function getMockPicklistValuesByRecordType(objectApiName, recordTypeId) {
  let ret;
  if (window.PICKLIST_REPRESENTATION) {
    store.PICKLIST_REPRESENTATION = window.PICKLIST_REPRESENTATION;
  }
  if (store.PICKLIST_REPRESENTATION) {
    ret = packageMockPicklistDataByRecordType(objectApiName, recordTypeId);
  } else {
    ret = mockDataRetriever.fetchMockPicklistData().then(result => {
      store.PICKLIST_REPRESENTATION = result;
      return packageMockPicklistDataByRecordType(objectApiName, recordTypeId);
    });
  }
  return ret;
}
function getRecordUiObservable(recordIds, layouts, modes, optionalFields) {
  return getImmutableObservable(getMockRecordUi(recordIds[0], optionalFields));
}
function getRecordWithFieldsObservable(recordId) {
  return getMockRecordUi(recordId).then(recordUi => recordUi.records[recordId]);
}
function getObjectInfo(objectApiName) {
  return getMockObjectInfo(objectApiName);
}
function getPicklistValuesObservable(objectApiName, recordTypeId, fieldApiName) {
  return getImmutableObservable(getMockPicklistValues(objectApiName, recordTypeId, fieldApiName));
}
function getPicklistValuesByRecordTypeObservable(objectApiName, recordTypeId) {
  return getImmutableObservable(getMockPicklistValuesByRecordType(objectApiName, recordTypeId));
}
function getRecordCreateDefaultsObservable(objectApiName) {
  return getImmutableObservable(getMockDefaults(objectApiName));
}
function saveRecord() {
  return new Promise((resolve, reject) => {
    if (window.RECORD_UI_CURRENT_ERROR) {
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(() => {
        reject(window.RECORD_UI_CURRENT_ERROR);
      }, 200);
    } else {
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(resolve, 200);
    }
  });
}
function getServiceTypes() {
  const serviceRecord = config => {
    if (config.layoutTypes || config.modes) {
      throw new Error("@wire('record') with layout or mode is not implemented yet. Follow W-4045854.");
    }
    if (!config.recordId || !config.fields) {
      return undefined;
    }
    return getImmutableObservable(getRecordWithFieldsObservable(config.recordId, config.fields));
  };
  const serviceObjectInfo = config => {
    if (!config.objectApiName) {
      return undefined;
    }
    return getImmutableObservable(getObjectInfo(config.objectApiName));
  };
  const servicePicklist = config => {
    if (!config.objectApiName || !config.recordTypeId || !config.fieldApiName) {
      return undefined;
    }
    return getPicklistValuesObservable(config.objectApiName, config.recordTypeId, config.fieldApiName);
  };
  function serviceRecordUi(config) {
    if (!config.recordIds || !config.layoutTypes || !config.modes) {
      return undefined;
    }
    return getImmutableObservable(getRecordUiObservable(config.recordIds, config.layoutTypes, config.modes, config.fields));
  }
  return {
    record: serviceRecord,
    'object-info': serviceObjectInfo,
    'picklist-values': servicePicklist,
    'record-ui': serviceRecordUi
  };
}

export { LdsError, MappedQueue, RESPONSES, addAllToSet, checkArray, checkPlainObject, checkType, createClass, createInterface, createRecord, createRecordImpl, createRecordInputFilteredByEditedFields, equivalent, freeze, generateRecordInputForCreate, generateRecordInputForUpdate, getListUi, getLookupActions, getLookupRecords, getMockFieldInfo, getObjectInfo, getPicklistValuesByRecordTypeObservable, getPicklistValuesObservable, getRecordCreateDefaultsObservable, getRecordUiObservable, getRecordWithFieldsObservable, getServiceTypes, getValueForAura, handleNextObservation, isFunction, isPlainObject, proxyLock, saveRecord, setContainsAll, updateRecord };