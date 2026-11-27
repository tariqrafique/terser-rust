import '@salesforce/i18n/locale';
import labelBadInput from '@salesforce/label/c.lightning_LightningErrorMessage_validityBadInput';
import labelPatternMismatch from '@salesforce/label/c.lightning_LightningErrorMessage_validityPatternMismatch';
import labelRangeOverflow from '@salesforce/label/c.lightning_LightningErrorMessage_validityRangeOverflow';
import labelRangeUnderflow from '@salesforce/label/c.lightning_LightningErrorMessage_validityRangeUnderflow';
import labelStepMismatch from '@salesforce/label/c.lightning_LightningErrorMessage_validityStepMismatch';
import labelTooLong from '@salesforce/label/c.lightning_LightningErrorMessage_validityTooLong';
import labelTooShort from '@salesforce/label/c.lightning_LightningErrorMessage_validityTooShort';
import labelTypeMismatch from '@salesforce/label/c.lightning_LightningErrorMessage_validityTypeMismatch';
import labelValueMissing from '@salesforce/label/c.lightning_LightningErrorMessage_validityValueMissing';

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

let idCounter = 0;
function generateUniqueId(prefix = 'input') {
  idCounter++;
  return `${prefix}-${idCounter}`;
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

class EventEmitter {
  constructor() {
    this.registry = {};
  }
  on(name, listener) {
    this.registry[name] = this.registry[name] || [];
    this.registry[name].push(listener);
    return this;
  }
  once(name, listener) {
    const doOnce = function () {
      listener.apply(null, arguments);
      this.removeListener(name, doOnce);
    }.bind(this);
    this.on(name, doOnce);
    return this;
  }
  emit(name) {
    const args = Array.prototype.slice.call(arguments, 1);
    const listeners = this.registry[name];
    let count = 0;
    if (listeners) {
      listeners.forEach(listener => {
        count += 1;
        listener.apply(null, args);
      });
    }
    return count > 0;
  }
  removeListener(name, listener) {
    const listeners = this.registry[name];
    if (listeners) {
      for (let i = 0, len = listeners.length; i < len; i += 1) {
        if (listeners[i] === listener) {
          listeners.splice(i, 1);
          return this;
        }
      }
    }
    return this;
  }
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function normalizeString(value, config = {}) {
  const {
    fallbackValue = '',
    validValues,
    toLowerCase = true
  } = config;
  let normalized = typeof value === 'string' && value.trim() || '';
  normalized = toLowerCase ? normalized.toLowerCase() : normalized;
  if (validValues && validValues.indexOf(normalized) === -1) {
    normalized = fallbackValue;
  }
  return normalized;
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

class InteractingState {
  constructor(options) {
    const duration = options && options.duration >= 0 ? options.duration : 2000;
    this.eventemitter = new EventEmitter();
    this._interacting = false;
    this._debouncedLeave = debounce(this.leave.bind(this), duration);
    this._debounceInteraction = options && options.debounceInteraction;
    this._interactedRecently = false;
    if (this._debounceInteraction) {
      this._debouncedEmitLeave = debounce(() => {
        if (!this._interacting) {
          this._interactedRecently = false;
          this.eventemitter.emit('leave');
        }
      }, 200);
      this._debouncedEmitEnter = () => {
        if (!this._interactedRecently) {
          this._interactedRecently = true;
          this.eventemitter.emit('enter');
        }
      };
    }
  }
  isInteracting() {
    return this._interacting;
  }
  enter() {
    if (!this._interacting) {
      this._interacting = true;
      if (this._debounceInteraction) {
        this._debouncedEmitEnter();
      } else {
        this.eventemitter.emit('enter');
      }
    }
  }
  onenter(handler) {
    this.eventemitter.on('enter', handler);
  }
  leave() {
    if (this._interacting) {
      this._interacting = false;
      if (this._debounceInteraction) {
        this._debouncedEmitLeave();
      } else {
        this.eventemitter.emit('leave');
      }
    }
  }
  onleave(handler) {
    this.eventemitter.on('leave', handler);
  }
  interacting() {
    this.enter();
    this._debouncedLeave();
  }
}
function debounce(func, delay, options) {
  const _options = options || {};
  let invokeLeading = _options.leading;
  let timer;
  return function debounced() {
    const args = Array.prototype.slice.apply(arguments);
    if (invokeLeading) {
      func.apply(this, args);
      invokeLeading = false;
    }
    clearTimeout(timer);
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    timer = setTimeout(function () {
      func.apply(this, args);
      invokeLeading = _options.leading;
    }, delay);
  };
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const constraintsSortedByPriority = ['customError', 'badInput', 'patternMismatch', 'rangeOverflow', 'rangeUnderflow', 'stepMismatch', 'tooLong', 'tooShort', 'typeMismatch', 'valueMissing'];
const defaultLabels = {
  badInput: labelBadInput,
  customError: labelBadInput,
  patternMismatch: labelPatternMismatch,
  rangeOverflow: labelRangeOverflow,
  rangeUnderflow: labelRangeUnderflow,
  stepMismatch: labelStepMismatch,
  tooLong: labelTooLong,
  tooShort: labelTooShort,
  typeMismatch: labelTypeMismatch,
  valueMissing: labelValueMissing
};
function resolveBestMatch(validity) {
  let validityState;
  if (validity && validity.valid === false) {
    validityState = 'badInput';
    constraintsSortedByPriority.some(stateName => {
      if (validity[stateName] === true) {
        validityState = stateName;
        return true;
      }
      return false;
    });
  }
  return validityState;
}
function computeConstraint(valueProvider, constraint) {
  const provider = valueProvider[constraint];
  if (typeof provider === 'function') {
    return provider();
  }
  if (typeof provider === 'boolean') {
    return provider;
  }
  return false;
}
function newValidityState(constraintsProvider) {
  class ValidityState {
    get valueMissing() {
      return computeConstraint(constraintsProvider, 'valueMissing');
    }
    get typeMismatch() {
      return computeConstraint(constraintsProvider, 'typeMismatch');
    }
    get patternMismatch() {
      return computeConstraint(constraintsProvider, 'patternMismatch');
    }
    get tooLong() {
      return computeConstraint(constraintsProvider, 'tooLong');
    }
    get tooShort() {
      return computeConstraint(constraintsProvider, 'tooShort');
    }
    get rangeUnderflow() {
      return computeConstraint(constraintsProvider, 'rangeUnderflow');
    }
    get rangeOverflow() {
      return computeConstraint(constraintsProvider, 'rangeOverflow');
    }
    get stepMismatch() {
      return computeConstraint(constraintsProvider, 'stepMismatch');
    }
    get customError() {
      return computeConstraint(constraintsProvider, 'customError');
    }
    get badInput() {
      return computeConstraint(constraintsProvider, 'badInput');
    }
    get valid() {
      return !(this.valueMissing || this.typeMismatch || this.patternMismatch || this.tooLong || this.tooShort || this.rangeUnderflow || this.rangeOverflow || this.stepMismatch || this.customError || this.badInput);
    }
  }
  return new ValidityState();
}
function buildSyntheticValidity(constraintProvider) {
  return Object.freeze(newValidityState(constraintProvider));
}
function getErrorMessage(validity, labelMap) {
  const key = resolveBestMatch(validity);
  if (key) {
    return labelMap[key] ? labelMap[key] : defaultLabels[key];
  }
  return '';
}
class FieldConstraintApi {
  constructor(inputComponentProvider, constraintProviders) {
    this._inputComponentProvider = inputComponentProvider;
    this._constraintsProvider = Object.assign({}, constraintProviders);
    if (!this._constraintsProvider.customError) {
      this._constraintsProvider.customError = () => typeof this._customValidityMessage === 'string' && this._customValidityMessage !== '';
    }
  }
  get validity() {
    if (!this._constraint) {
      this._constraint = buildSyntheticValidity(this._constraintsProvider);
    }
    return this._constraint;
  }
  checkValidity() {
    const isValid = this.validity.valid;
    if (!isValid) {
      if (this.inputComponent) {
        this.inputComponent.dispatchEvent(new CustomEvent('invalid', {
          cancellable: true
        }));
      }
    }
    return isValid;
  }
  reportValidity(callback) {
    const valid = this.checkValidity();
    if (this.inputComponent) {
      this.inputComponent.classList.toggle('slds-has-error', !valid);
      if (callback) {
        callback(this.validationMessage);
      }
    }
    return valid;
  }
  setCustomValidity(message) {
    this._customValidityMessage = message;
  }
  get validationMessage() {
    return getErrorMessage(this.validity, {
      customError: this._customValidityMessage,
      badInput: this.inputComponent.messageWhenBadInput,
      patternMismatch: this.inputComponent.messageWhenPatternMismatch,
      rangeOverflow: this.inputComponent.messageWhenRangeOverflow,
      rangeUnderflow: this.inputComponent.messageWhenRangeUnderflow,
      stepMismatch: this.inputComponent.messageWhenStepMismatch,
      tooShort: this.inputComponent.messageWhenTooShort,
      tooLong: this.inputComponent.messageWhenTooLong,
      typeMismatch: this.inputComponent.messageWhenTypeMismatch,
      valueMissing: this.inputComponent.messageWhenValueMissing
    });
  }
  get inputComponent() {
    if (!this._inputComponentElement) {
      this._inputComponentElement = this._inputComponentProvider();
    }
    return this._inputComponentElement;
  }
}
class FieldConstraintApiWithProxyInput {
  constructor(inputComponent, overrides = {}, inputElementName = 'input') {
    this._inputComponent = inputComponent;
    this._overrides = overrides;
    this._proxyInput = document.createElement(inputElementName);
  }
  setInputAttributes(attributes) {
    this._attributes = attributes;
    this._attributeUpdater = attributeNames => {
      if (!attributes) {
        return;
      }
      if (typeof attributeNames === 'string') {
        this._setAttribute(attributeNames, attributes[attributeNames]());
      } else {
        attributeNames.forEach(attributeName => {
          this._setAttribute(attributeName, attributes[attributeName]());
        });
      }
    };
    return this._attributeUpdater;
  }
  get validity() {
    return this._constraintApi.validity;
  }
  checkValidity() {
    return this._constraintApi.checkValidity();
  }
  reportValidity(callback) {
    return this._constraintApi.reportValidity(callback);
  }
  setCustomValidity(message) {
    this._constraintApi.setCustomValidity(message);
    this._proxyInput.setCustomValidity(message);
  }
  get validationMessage() {
    return this._constraintApi.validationMessage;
  }
  _setAttribute(attributeName, value) {
    if (value !== null && value !== undefined && value !== false) {
      if (attributeName === 'value') {
        if (this._proxyInput.type === 'file') {
          return;
        }
        this._proxyInput.value = value;
      } else {
        this._proxyInput.setAttribute(attributeName, value);
      }
    } else {
      this._removeAttribute(attributeName);
    }
  }
  _removeAttribute(attributeName) {
    this._proxyInput.removeAttribute(attributeName);
  }
  get _constraintApi() {
    if (!this._privateConstraintApi) {
      this._updateAllAttributes();
      const computeConstraintWithProxyInput = constraintName => {
        const constraintOverride = this._overrides[constraintName];
        const isDisabledOrReadOnly = this._proxyInput.hasAttribute('disabled') || this._proxyInput.hasAttribute('readonly');
        if (typeof constraintOverride === 'function') {
          return !isDisabledOrReadOnly && constraintOverride();
        }
        return !isDisabledOrReadOnly && this._proxyInput.validity[constraintName];
      };
      const constraintsProvider = constraintsSortedByPriority.reduce((provider, constraint) => {
        provider[constraint] = computeConstraintWithProxyInput.bind(this, constraint);
        return provider;
      }, {});
      this._privateConstraintApi = new FieldConstraintApi(this._inputComponent, constraintsProvider);
    }
    return this._privateConstraintApi;
  }
  _updateAllAttributes() {
    if (this._attributes) {
      Object.entries(this._attributes).forEach(([key, valueFunction]) => {
        this._setAttribute(key, valueFunction());
      });
    }
  }
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const VARIANT = {
  STANDARD: 'standard',
  LABEL_HIDDEN: 'label-hidden',
  LABEL_STACKED: 'label-stacked',
  LABEL_INLINE: 'label-inline'
};
function normalizeVariant(value) {
  return normalizeString(value, {
    fallbackValue: VARIANT.STANDARD,
    validValues: [VARIANT.STANDARD, VARIANT.LABEL_HIDDEN, VARIANT.LABEL_STACKED, VARIANT.LABEL_INLINE]
  });
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function isEmptyString(s) {
  return s === undefined || s === null || typeof s === 'string' && s.trim() === '';
}

export { FieldConstraintApi, FieldConstraintApiWithProxyInput, InteractingState, VARIANT, buildSyntheticValidity, debounce, generateUniqueId, getErrorMessage, isEmptyString, normalizeVariant };