import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./inputLocation.html";
import { registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

import labelCoordinateIsRequired from '@salesforce/label/c.lightning_LightningInputLocation_coordinateIsRequired';
import labelInvalidLatitude from '@salesforce/label/c.lightning_LightningInputLocation_invalidLatitude';
import labelInvalidLongitude from '@salesforce/label/c.lightning_LightningInputLocation_invalidLongitude';
import labelLatitude from '@salesforce/label/c.lightning_LightningInputLocation_latitude';
import labelLongitude from '@salesforce/label/c.lightning_LightningInputLocation_longitude';
import { LightningElement } from 'lwc';
import { classSet } from 'c/utils';
import { assert, normalizeBoolean, normalizeString, classListMutation } from 'c/utilsPrivate';
import { validateCoordinate } from './geolocation';
import { isEmptyString, InteractingState, normalizeVariant, FieldConstraintApi, VARIANT } from 'c/inputUtils';
const i18n = {
  coordinateIsRequired: labelCoordinateIsRequired,
  invalidLatitude: labelInvalidLatitude,
  invalidLongitude: labelInvalidLongitude,
  latitude: labelLatitude,
  longitude: labelLongitude
};
class cInputLocation extends LightningElement {
  constructor(...args) {
    super(...args);
    this.label = void 0;
    this.fieldLevelHelp = void 0;
    this._latitude = '';
    this._longitude = '';
    this._disabled = false;
    this._readonly = false;
    this._required = false;
    this._variant = void 0;
  }
  connectedCallback() {
    this._connected = true;
    this.interactingState = new InteractingState({
      debounceInteraction: true
    });
    this.interactingState.onenter(() => {
      this.dispatchEvent(new CustomEvent('focus'));
    });
    this.interactingState.onleave(() => {
      this.reportValidity();
      this.dispatchEvent(new CustomEvent('blur'));
    });
    this.classList.add('slds-form-element', 'slds-form-compound');
    this.updateClassList();
  }
  updateClassList() {
    classListMutation(this.classList, {
      'slds-form-element_stacked': this.variant === VARIANT.LABEL_STACKED,
      'slds-form-element_horizontal': this.variant === VARIANT.LABEL_INLINE
    });
  }
  disconnectedCallback() {
    this._connected = false;
  }
  get latitude() {
    return this._latitude;
  }
  set latitude(value) {
    if (value != null) {
      value = value.toString();
    }
    this._latitude = normalizeString(value);
  }
  get longitude() {
    return this._longitude;
  }
  set longitude(value) {
    if (value != null) {
      value = value.toString();
    }
    this._longitude = normalizeString(value);
  }
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = normalizeBoolean(value);
  }
  get readOnly() {
    return this._readonly;
  }
  set readOnly(value) {
    this._readonly = normalizeBoolean(value);
  }
  get required() {
    return this._required;
  }
  set required(value) {
    this._required = normalizeBoolean(value);
  }
  get variant() {
    return this._variant || VARIANT.STANDARD;
  }
  set variant(value) {
    this._variant = normalizeVariant(value);
    this.updateClassList();
  }
  focus() {
    if (this._connected) {
      this.getCoordinateElement('latitude').focus();
    }
  }
  blur() {
    if (this._connected) {
      this.getCoordinateElement('latitude').blur();
      this.getCoordinateElement('longitude').blur();
    }
  }
  get validity() {
    return this._combinedConstraint.validity;
  }
  checkValidity() {
    return this._combinedConstraint.checkValidity();
  }
  showHelpMessageIfInvalid() {
    this.reportValidity();
  }
  setCustomValidityForField(message, fieldName) {
    assert(['latitude', 'longitude'].indexOf(fieldName) >= 0, '"fieldName" must be "latitude" or "longitude"');
    this._coordinateConstraints[fieldName].setCustomValidity(message);
  }
  reportValidity() {
    const valid = this.checkValidity();
    if (!this._connected) {
      return valid;
    }
    Object.keys(this._coordinateConstraints).forEach(coordinate => {
      this._reportValidityForCoordinate(coordinate);
    });
    return valid;
  }
  get i18n() {
    return i18n;
  }
  get isLabelHidden() {
    return this.variant === VARIANT.LABEL_HIDDEN;
  }
  get computedLegendClass() {
    return classSet('slds-form-element__label slds-form-element__legend').add({
      'slds-assistive-text': this.isLabelHidden
    }).toString();
  }
  handleLatitudeBlur() {
    this.interactingState.leave();
    this._reportValidityForCoordinate('latitude');
  }
  handleLongitudeBlur() {
    this.interactingState.leave();
    this._reportValidityForCoordinate('longitude');
  }
  handleFocus() {
    this.interactingState.enter();
  }
  handleLatitudeChange(event) {
    this.handleChange('latitude', event);
  }
  handleLongitudeChange(event) {
    this.handleChange('longitude', event);
  }
  handleChange(coordinate, event) {
    event.stopPropagation();
    const value = event.detail.value;
    if (this[coordinate] === value) {
      return;
    }
    if (coordinate === 'longitude') {
      this._longitude = value;
    } else if (coordinate === 'latitude') {
      this._latitude = value;
    }
    this.dispatchEvent(new CustomEvent('change', {
      composed: true,
      bubbles: true,
      detail: {
        latitude: this.latitude,
        longitude: this.longitude
      }
    }));
  }
  get _coordinateConstraints() {
    if (!this._coordinateConstraintApis) {
      this._coordinateConstraintApis = ['latitude', 'longitude'].reduce((constraints, coordinate) => {
        const constraintProviders = {
          badInput: () => !this.disabled && !isEmptyString(this[coordinate]) && !validateCoordinate(coordinate, this[coordinate]),
          valueMissing: () => !this.disabled && this.required && isEmptyString(this[coordinate])
        };
        constraints[coordinate] = new FieldConstraintApi(this.getCoordinateElement.bind(this, coordinate), constraintProviders);
        return constraints;
      }, {});
    }
    return this._coordinateConstraintApis;
  }
  get _combinedConstraint() {
    if (!this._combinedConstraintApi) {
      const {
        _coordinateConstraints
      } = this;
      const checkCoordinates = property => Object.values(_coordinateConstraints).some(coordinateConstraint => coordinateConstraint.validity[property]);
      this._combinedConstraintApi = new FieldConstraintApi(() => this, {
        customError: () => checkCoordinates('customError'),
        badInput: () => checkCoordinates('badInput'),
        valueMissing: () => checkCoordinates('valueMissing')
      });
    }
    return this._combinedConstraintApi;
  }
  getCoordinateElement(fieldName) {
    const propertyName = `_${fieldName}Element`;
    if (!this[propertyName]) {
      this[propertyName] = this.template.querySelector(`lightning-input[data-${fieldName}]`);
    }
    return this[propertyName];
  }
  _reportValidityForCoordinate(coordinate) {
    this._coordinateConstraints[coordinate].reportValidity(helpMessage => {
      const coordinateElement = this.getCoordinateElement(coordinate);
      coordinateElement.setCustomValidity(helpMessage);
      coordinateElement.reportValidity();
    });
  }
  /*LWC compiler v9.5.3*/
}
cInputLocation.delegatesFocus = true;
_registerDecorators(cInputLocation, {
  publicProps: {
    label: {
      config: 0
    },
    fieldLevelHelp: {
      config: 0
    },
    latitude: {
      config: 3
    },
    longitude: {
      config: 3
    },
    disabled: {
      config: 3
    },
    readOnly: {
      config: 3
    },
    required: {
      config: 3
    },
    variant: {
      config: 3
    },
    validity: {
      config: 1
    }
  },
  publicMethods: ["focus", "blur", "checkValidity", "showHelpMessageIfInvalid", "setCustomValidityForField", "reportValidity"],
  track: {
    _latitude: 1,
    _longitude: 1,
    _disabled: 1,
    _readonly: 1,
    _required: 1,
    _variant: 1
  }
});
const __lwc_component_class_internal = _registerComponent(cInputLocation, {
  tmpl: _tmpl,
  sel: "c-input-location",
  apiVersion: 66
});
export default __lwc_component_class_internal;