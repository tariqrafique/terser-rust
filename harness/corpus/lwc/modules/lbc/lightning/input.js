import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./input.html";
import { registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import labelA11yTriggerText from '@salesforce/label/LightningColorPicker.a11yTriggerText';
import labelMessageToggleActive from '@salesforce/label/LightningControl.activeCapitalized';
import labelMessageToggleInactive from '@salesforce/label/LightningControl.inactiveCapitalized';
import labelRequired from '@salesforce/label/LightningControl.required';
import labelClearInput from '@salesforce/label/LightningControl.clear';
import labelLoadingIndicator from '@salesforce/label/LightningControl.loading';
import labelNumberIncrementCounter from '@salesforce/label/LightningInputNumber.incrementCounter';
import labelNumberDecrementCounter from '@salesforce/label/LightningInputNumber.decrementCounter';
import labelHelpTextAlternativeText from '@salesforce/label/LightningInput.helptextAlternativeText';
import userTimeZone from '@salesforce/i18n/timeZone';
import formFactor from '@salesforce/client/formFactor';
import { features } from 'lightning/features';
import { classSet, formatLabel } from 'lightning/utils';
import { assert, classListMutation, reflectAttribute, isNativeComponent, isUndefinedOrNull, normalizeAriaAttribute, normalizeBoolean, normalizeString, synchronizeAttrs, decorateInputForDragon, setDecoratedDragonInputValueWithoutEvent, computeAriaInvalid, isBubblingFocusEvent, valueSetter } from 'lightning/utilsPrivate';
import { privateContext } from 'lightning/utilsInternal';
import AriaObserver from 'lightning/ariaObserver';
import { normalizeDate, normalizeDateTimeToUTC, normalizeTime, normalizeUTCDateTime } from './dateTimeUtil';
import { isAfter, isBefore } from 'lightning/internationalizationLibrary';
import { isValidNumber } from 'lightning/numberUtils';
import { FieldConstraintApiWithProxyInput, InteractingState, normalizeVariant, VARIANT, normalizeInput, isValidEmail, isValidMultipleEmails, normalizeInputModeGetterValue, normalizeInputModeSetterValue } from 'lightning/inputUtils';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
const i18n = {
  a11yTriggerText: labelA11yTriggerText,
  messageToggleActive: labelMessageToggleActive,
  messageToggleInactive: labelMessageToggleInactive,
  numberIncrementCounter: labelNumberIncrementCounter,
  numberDecrementCounter: labelNumberDecrementCounter,
  required: labelRequired,
  clear: labelClearInput,
  loading: labelLoadingIndicator,
  helpTextAlternativeText: labelHelpTextAlternativeText
};
const ARIA_CONTROLS = 'aria-controls';
const ARIA_DETAILS = 'aria-details';
const ARIA_LABEL = 'aria-label';
const ARIA_LABELLEDBY = 'aria-labelledby';
const ARIA_DESCRIBEDBY = 'aria-describedby';
const ARIA_ERRORMESSAGE = 'aria-errormessage';
const ARIA_ACTIVEDESCENDANT = 'aria-activedescendant';
const VALID_INPUT_TYPES = ['checkbox', 'checkbox-button', 'date', 'datetime', 'time', 'email', 'file', 'password', 'search', 'tel', 'url', 'number', 'text', 'radio', 'toggle', 'color', 'range', 'datetime-local', 'month', 'week'];
const VALID_NUMBER_FORMATTERS = ['decimal', 'percent', 'percent-fixed', 'currency'];
const DEFAULT_FORMATTER = VALID_NUMBER_FORMATTERS[0];
const {
  setContext,
  assertContext
} = privateContext;
class LightningInput extends LightningShadowBaseClass {
  get autocomplete() {
    if (this.isAutoCompleteSupported) {
      return this._autocomplete;
    }
    if (this.isTypeDate || this.isTypeDateTime || this.isTypeTime) {
      return 'off';
    }
    return undefined;
  }
  set autocomplete(value) {
    this._autocomplete = value;
  }
  get inputmode() {
    return normalizeInputModeGetterValue(this._normalizedInputModeOverrideValue, this.type);
  }
  set inputmode(value) {
    if (!features.enableInputModeOverride) {
      return;
    }
    this._normalizedInputModeOverrideValue = normalizeInputModeSetterValue(value);
  }
  constructor() {
    super();
    this.placeholder = void 0;
    this.name = void 0;
    this.label = void 0;
    this.messageWhenBadInput = void 0;
    this.messageWhenPatternMismatch = void 0;
    this.messageWhenRangeOverflow = void 0;
    this.messageWhenRangeUnderflow = void 0;
    this.messageWhenStepMismatch = void 0;
    this.messageWhenTooShort = void 0;
    this.messageWhenTooLong = void 0;
    this.messageWhenTypeMismatch = void 0;
    this.messageWhenValueMissing = void 0;
    this.messageToggleActive = i18n.messageToggleActive;
    this.messageToggleInactive = i18n.messageToggleInactive;
    this.ariaLabel = void 0;
    this.isIE11 = void 0;
    this._normalizedInputModeOverrideValue = void 0;
    this.dateStyle = void 0;
    this.timeStyle = void 0;
    this.dateAriaLabel = void 0;
    this.timeAriaLabel = void 0;
    this.dateAccessKey = void 0;
    this.timeAccessKey = void 0;
    this._ariaActiveDescendantElement = null;
    this._timeAriaDescribedBy = void 0;
    this._timeAriaLabelledBy = void 0;
    this._timeAriaErrorMessage = void 0;
    this._timeAriaControls = void 0;
    this._dateAriaControls = void 0;
    this._timeAriaDetails = void 0;
    this._dateAriaDetails = void 0;
    this._dateAriaDescribedBy = void 0;
    this._dateAriaLabelledBy = void 0;
    this._dateAriaErrorMessage = void 0;
    this._files = void 0;
    this._value = '';
    this._type = 'text';
    this._pattern = void 0;
    this._max = void 0;
    this._min = void 0;
    this._step = void 0;
    this._disabled = false;
    this._readOnly = false;
    this._required = false;
    this._checked = false;
    this._indeterminate = false;
    this._isLoading = false;
    this._multiple = false;
    this._timezone = false;
    this._helpMessage = null;
    this._isColorPickerPanelOpen = false;
    this._fieldLevelHelp = void 0;
    this._accesskey = void 0;
    this._maxLength = void 0;
    this._minLength = void 0;
    this._accept = void 0;
    this._variant = void 0;
    this._ariaInvalid = void 0;
    this._autocomplete = void 0;
    this._shouldShowHelpMessage = true;
    this._helpMessageChanged = false;
    this._formatter = DEFAULT_FORMATTER;
    this._initialValueSet = false;
    this._rendered = void 0;
    this._isNativeShadow = void 0;
    this._primitiveComponentRefreshNeeded = void 0;
    this._inputElementRefreshNeeded = void 0;
    this._cachedInputElement = void 0;
    this.cachedPrimitiveComponent = void 0;
    this._inputDragonDecorated = void 0;
    this._customMessageSet = void 0;
    this._constraintApi = void 0;
    this._constraintApiProxyInputUpdater = void 0;
    this.ariaObserver = void 0;
    this.interactingState = void 0;
    this._ariaControls = void 0;
    this._ariaDetails = void 0;
    this._ariaLabelledBy = void 0;
    this._ariaDescribedBy = void 0;
    this._ariaErrorMessage = void 0;
    this._role = void 0;
    this._useUpdatedCheckboxButtonBlueprint = features.enableUpdatedCheckboxButtonBlueprint;
    this.timeStepMinutes = void 0;
    this.formatFractionDigits = void 0;
    this.ariaHasPopup = void 0;
    this.ariaKeyShortcuts = void 0;
    this.ariaDisabled = void 0;
    this.ariaRoleDescription = void 0;
    this.ariaExpanded = void 0;
    this.ariaAutoComplete = void 0;
    this.ariaObserver = new AriaObserver(this);
    this._isNativeShadow = isNativeComponent(this);
    setContext(this);
  }
  connectedCallback() {
    assertContext(this);
    super.connectedCallback();
    if (!this.ariaObserver) {
      this.ariaObserver = new AriaObserver(this);
    }
    this.classList.add('slds-form-element');
    this.updateClassListForVariant();
    this.validateRequiredAttributes();
    this.interactingState = new InteractingState();
    this.interactingState.onleave(() => this.reportValidity());
  }
  disconnectedCallback() {
    this._rendered = false;
    this._initialValueSet = false;
    this._cachedInputElement = undefined;
    this.cachedPrimitiveComponent = undefined;
    if (this.ariaObserver) {
      this.ariaObserver.disconnect();
      this.ariaObserver = undefined;
    }
  }
  renderedCallback() {
    if (this.isConnected) {
      this.ariaObserver.sync(this.isNativeShadow);
      if (this._helpMessageChanged) {
        this.connectAriaDescribedBy();
        this.connectAriaErrorMessage();
        this._helpMessageChanged = false;
      }
      if (!this._rendered) {
        this.connectAriaDescribedBy();
        this.connectAriaErrorMessage();
        this.connectAriaLabelledBy();
        this.connectAriaControls();
        this.connectAriaDetails();
        this.connectAriaActiveDescendantElement();
      }
    }
    if (!this._initialValueSet && this._inputElement) {
      this._rendered = true;
      this._setInputValue(this._displayedValue);
      if (this.isTypeCheckable) {
        this._inputElement.checked = this._checked;
      }
      this._initialValueSet = true;
    }
    this._synchronizeA11y();
  }
  get timeAriaControls() {
    return this._timeAriaControls;
  }
  set timeAriaControls(references) {
    this._timeAriaControls = references;
    this.ariaObserver.connectLiveIdRef(references, reference => {
      this._timeAriaControls = reference;
    });
  }
  get timeAriaDetails() {
    return this._timeAriaDetails;
  }
  set timeAriaDetails(references) {
    this._timeAriaDetails = references;
    this.ariaObserver.connectLiveIdRef(references, reference => {
      this._timeAriaDetails = reference;
    });
  }
  get dateAriaErrorMessage() {
    return this._dateAriaErrorMessage;
  }
  set dateAriaErrorMessage(references) {
    this._dateAriaErrorMessage = references;
    this.ariaObserver.connectLiveIdRef(references, reference => {
      this._dateAriaErrorMessage = reference;
    });
  }
  get timeAriaErrorMessage() {
    return this._timeAriaErrorMessage;
  }
  set timeAriaErrorMessage(references) {
    this._timeAriaErrorMessage = references;
    this.ariaObserver.connectLiveIdRef(references, reference => {
      this._timeAriaErrorMessage = reference;
    });
  }
  get dateAriaLabelledBy() {
    return this._dateAriaLabelledBy;
  }
  set dateAriaLabelledBy(references) {
    this._dateAriaLabelledBy = references;
    this.ariaObserver.connectLiveIdRef(references, reference => {
      this._dateAriaLabelledBy = reference;
    });
  }
  get timeAriaLabelledBy() {
    return this._timeAriaLabelledBy;
  }
  set timeAriaLabelledBy(references) {
    this._timeAriaLabelledBy = references;
    this.ariaObserver.connectLiveIdRef(references, reference => {
      this._timeAriaLabelledBy = reference;
    });
  }
  get timeAriaDescribedBy() {
    return this._timeAriaDescribedBy;
  }
  set timeAriaDescribedBy(references) {
    this._timeAriaDescribedBy = references;
    this.ariaObserver.connectLiveIdRef(references, reference => {
      this._timeAriaDescribedBy = reference;
    });
  }
  get dateAriaControls() {
    return this._dateAriaControls;
  }
  set dateAriaControls(references) {
    this._dateAriaControls = references;
    this.ariaObserver.connectLiveIdRef(references, reference => {
      this._dateAriaControls = reference;
    });
  }
  get dateAriaDetails() {
    return this._dateAriaDetails;
  }
  set dateAriaDetails(references) {
    this._dateAriaDetails = references;
    this.ariaObserver.connectLiveIdRef(references, reference => {
      this._dateAriaDetails = reference;
    });
  }
  get dateAriaDescribedBy() {
    return this._dateAriaDescribedBy;
  }
  set dateAriaDescribedBy(references) {
    this._dateAriaDescribedBy = references;
    this.ariaObserver.connectLiveIdRef(references, reference => {
      this._dateAriaDescribedBy = reference;
    });
  }
  get ariaControls() {
    return this._ariaControls;
  }
  set ariaControls(references) {
    this._ariaControls = references;
    if (this._rendered) {
      this.connectAriaControls();
    }
  }
  get ariaDetails() {
    return this._ariaControls;
  }
  set ariaDetails(references) {
    this._ariaDetails = references;
    if (this._rendered) {
      this.connectAriaDetails();
    }
  }
  get ariaActiveDescendantElement() {
    return this._ariaActiveDescendantElement;
  }
  set ariaActiveDescendantElement(value) {
    if (!features.enableMobileGroupedCbAriaUpdates) {
      return;
    }
    this._ariaActiveDescendantElement = value;
    if (this._rendered) {
      this.connectAriaActiveDescendantElement();
    }
  }
  get ariaLabelledBy() {
    return this._rendered && this.isNativeShadow ? this._inputElement.getAttribute(ARIA_LABELLEDBY) : this._ariaLabelledBy;
  }
  set ariaLabelledBy(references) {
    this._ariaLabelledBy = references;
    if (this._rendered) {
      this.connectAriaLabelledBy();
    }
  }
  get ariaDescribedBy() {
    return this._rendered && this.isNativeShadow ? this._inputElement.getAttribute(ARIA_DESCRIBEDBY) : this._ariaDescribedBy;
  }
  set ariaDescribedBy(references) {
    this._ariaDescribedBy = references;
    if (this._rendered) {
      this.connectAriaDescribedBy();
    }
  }
  get ariaErrorMessage() {
    return this._rendered && this.isNativeShadow ? this._inputElement.getAttribute(ARIA_ERRORMESSAGE) : this._ariaErrorMessage;
  }
  set ariaErrorMessage(references) {
    this._ariaErrorMessage = references;
    if (this._rendered) {
      this.connectAriaErrorMessage();
    }
  }
  get isNativeShadow() {
    return this._primitiveComponent?.isNativeShadow || this._isNativeShadow;
  }
  connectAriaLabelledBy() {
    if (this._primitiveComponent) {
      this.ariaObserver.connect({
        attribute: ARIA_LABELLEDBY,
        targetNode: this._inputElement,
        relatedNodes: this._primitiveComponent.ariaLabelledByElements,
        relatedNodeIds: this._ariaLabelledBy
      });
    }
  }
  connectAriaDescribedBy() {
    if (this._primitiveComponent) {
      this.ariaObserver.connect({
        attribute: ARIA_DESCRIBEDBY,
        targetNode: this._inputElement,
        relatedNodes: this._primitiveComponent.ariaDescribedByElements,
        relatedNodeIds: this._ariaDescribedBy
      });
    }
  }
  connectAriaErrorMessage() {
    if (this._primitiveComponent) {
      this.ariaObserver.connect({
        attribute: ARIA_ERRORMESSAGE,
        targetNode: this._inputElement,
        relatedNodeIds: this._ariaErrorMessage
      });
    }
  }
  connectAriaControls() {
    if (this._primitiveComponent) {
      this.ariaObserver.connect({
        attribute: ARIA_CONTROLS,
        targetNode: this._inputElement,
        relatedNodeIds: this._ariaControls
      });
    }
  }
  connectAriaDetails() {
    if (this._primitiveComponent) {
      this.ariaObserver.connect({
        attribute: ARIA_DETAILS,
        targetNode: this._inputElement,
        relatedNodeIds: this._ariaDetails
      });
    }
  }
  connectAriaActiveDescendantElement() {
    if (features.enableMobileGroupedCbAriaUpdates && this._primitiveComponent) {
      const {
        _ariaActiveDescendantElement: elem
      } = this;
      this.ariaObserver.connect({
        attribute: ARIA_ACTIVEDESCENDANT,
        targetNode: this._inputElement,
        relatedNodes: elem !== null ? [elem] : []
      });
    }
  }
  get ariaInvalid() {
    return this._ariaInvalid;
  }
  set ariaInvalid(value) {
    const _value = typeof value == 'undefined' ? undefined : normalizeBoolean(value);
    this._ariaInvalid = _value;
  }
  get formatter() {
    if (this.isTypeNumber && this._primitiveComponent) {
      return this._primitiveComponent.formatter;
    }
    return this._formatter;
  }
  set formatter(value) {
    this._formatter = value;
    if (this.isTypeNumber && this._primitiveComponent) {
      this._primitiveComponent.formatter = this._formatter;
    }
  }
  get type() {
    return this._type;
  }
  set type(value) {
    const wasTypeSimple = this.isTypeSimple;
    const normalizedValue = normalizeString(value);
    this._type = normalizedValue === 'datetime' ? 'datetime-local' : normalizedValue;
    if (!this._validateType(normalizedValue)) {
      this._type = 'text';
    }
    if (!wasTypeSimple || !this.isTypeSimple) {
      this._primitiveComponentRefreshNeeded = true;
    }
    if (!wasTypeSimple || !this.isTypeSimple) {
      this._primitiveComponentRefreshNeeded = true;
    }
    this._primitiveComponentRefreshNeeded = true;
    this._inputElementRefreshNeeded = true;
    if (this._rendered) {
      this._initialValueSet = false;
      this.connectAriaLabelledBy();
      this.connectAriaDescribedBy();
      this.connectAriaErrorMessage();
      this.connectAriaControls();
      this.connectAriaDetails();
      this.connectAriaActiveDescendantElement();
    }
    this._updateProxyInputAttributes(['type', 'value', 'max', 'min', 'required', 'pattern']);
  }
  get isLoading() {
    return this._isLoading;
  }
  set isLoading(value) {
    this._isLoading = normalizeBoolean(value);
  }
  get pattern() {
    if (this.isTypeColor) {
      return '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$';
    }
    return this._pattern;
  }
  set pattern(value) {
    this._pattern = value;
    this._updateProxyInputAttributes('pattern');
  }
  get maxLength() {
    return this._maxLength;
  }
  set maxLength(value) {
    this._maxLength = value;
    this._updateProxyInputAttributes('maxlength');
  }
  get accept() {
    return this._accept;
  }
  set accept(value) {
    this._accept = value;
    this._updateProxyInputAttributes('accept');
  }
  get minLength() {
    return this._minLength;
  }
  set minLength(value) {
    this._minLength = value;
    this._updateProxyInputAttributes('minlength');
  }
  get max() {
    return this._max;
  }
  set max(value) {
    this._max = value;
    this._updateProxyInputAttributes('max');
  }
  get min() {
    return this._min;
  }
  set min(value) {
    this._min = value;
    this._updateProxyInputAttributes('min');
  }
  get step() {
    if (this.isTypeDateTime || this.isTypeTime) {
      return 'any';
    }
    return this._step;
  }
  set step(value) {
    if (typeof value === 'string' && value.toLowerCase() === 'any') {
      this._step = 'any';
    } else {
      this._step = isUndefinedOrNull(value) || isNaN(value) ? undefined : String(value);
    }
    this._updateProxyInputAttributes('step');
  }
  get checked() {
    const inputElement = this._inputElement;
    if (this.isTypeCheckable && this._initialValueSet && inputElement) {
      return inputElement.checked;
    }
    return this._checked;
  }
  set checked(value) {
    this._checked = normalizeBoolean(value);
    if (this._rendered) {
      const inputElement = this.isTypeCheckbox ? this._primitiveComponent : this._inputElement;
      if (inputElement) {
        inputElement.checked = this._checked;
      }
    }
    this._updateProxyInputAttributes('checked');
    reflectAttribute(this, 'checked', this._checked);
  }
  get indeterminate() {
    if (!features.enableIndeterminateForInput) {
      return false;
    }
    return this._indeterminate;
  }
  set indeterminate(value) {
    if (!features.enableIndeterminateForInput) {
      return;
    }
    this._indeterminate = normalizeBoolean(value);
    if (this._rendered && this.isTypeCheckbox) {
      const primitiveComponent = this._primitiveComponent;
      if (primitiveComponent) {
        primitiveComponent.indeterminate = this._indeterminate;
      }
    }
    reflectAttribute(this, 'indeterminate', this._indeterminate);
  }
  get multiple() {
    return this._multiple;
  }
  set multiple(value) {
    this._multiple = normalizeBoolean(value);
    this._updateProxyInputAttributes('multiple');
  }
  get value() {
    if (this.isTypeSimple && this._rendered) {
      const subcomponent = this._primitiveComponent;
      if (subcomponent) {
        return subcomponent.value;
      }
    }
    return this._value;
  }
  set value(value) {
    if (!this.isTypeFile) {
      this._value = normalizeInput(value);
      if (this._rendered) {
        if (this.isTypeSimple) {
          const subcomponent = this._primitiveComponent;
          if (subcomponent) {
            valueSetter(subcomponent, undefined, this._value);
          }
        }
        if (this._inputElement.value !== this._displayedValue) {
          this._setInputValue(this._displayedValue);
        }
      }
      this._updateProxyInputAttributes('value');
    }
  }
  get variant() {
    return this._variant || VARIANT.STANDARD;
  }
  set variant(value) {
    this._variant = normalizeVariant(value);
    this.updateClassListForVariant();
    reflectAttribute(this, 'variant', this._variant);
  }
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = normalizeBoolean(value);
    this._updateProxyInputAttributes('disabled');
    reflectAttribute(this, 'disabled', this.disabled);
  }
  get readOnly() {
    return this._readOnly;
  }
  set readOnly(value) {
    this._readOnly = normalizeBoolean(value);
    this._updateProxyInputAttributes('readonly');
    reflectAttribute(this, 'readonly', this.readOnly);
  }
  get required() {
    return this._required;
  }
  set required(value) {
    this._required = normalizeBoolean(value);
    this._updateProxyInputAttributes('required');
  }
  get timezone() {
    return this._timezone || userTimeZone;
  }
  set timezone(value) {
    this._timezone = value;
    this._updateProxyInputAttributes(['value', 'max', 'min']);
  }
  get fieldLevelHelp() {
    return this._fieldLevelHelp;
  }
  set fieldLevelHelp(value) {
    this._fieldLevelHelp = value;
  }
  get accessKey() {
    return this._accesskey;
  }
  set accessKey(newValue) {
    this._accesskey = newValue;
  }
  get files() {
    if (this.isTypeFile) {
      return this._primitiveComponent.files;
    }
    return null;
  }
  set files(value) {
    this._files = value;
  }
  get validity() {
    return this._constraint.validity;
  }
  get selectionStart() {
    if (this._inputElement && 'selectionStart' in this._inputElement) {
      return this._inputElement.selectionStart;
    }
    return undefined;
  }
  set selectionStart(index) {
    if (this._inputElement && 'selectionStart' in this._inputElement) {
      this._inputElement.selectionStart = index;
    }
  }
  get selectionEnd() {
    if (this._inputElement && 'selectionEnd' in this._inputElement) {
      return this._inputElement.selectionEnd;
    }
    return undefined;
  }
  set selectionEnd(index) {
    if (this._inputElement && 'selectionEnd' in this._inputElement) {
      this._inputElement.selectionEnd = index;
    }
  }
  get role() {
    return this._role;
  }
  set role(value) {
    if (value === 'combobox') {
      this._role = 'combobox';
    } else {
      console.warn("<lightning-input> The role attribute value is invalid. Options are: 'combobox'");
    }
  }
  checkValidity() {
    return this._constraint.checkValidity();
  }
  setCustomValidity(message) {
    this._customMessageSet = !!message;
    this._constraint.setCustomValidity(message);
  }
  reportValidity() {
    return this._constraint.reportValidity(message => {
      if (this.isTypeDesktopTime) {
        reflectAttribute(this._inputElement.comboboxComponent, 'invalid', !this.checkValidity());
      }
      if (this._rendered && !this.isNativeInput) {
        this._inputElement.showHelpMessage(message);
        if (this.isTypeDateTime && this._customMessageSet) {
          reflectAttribute(this._inputElement.getDatepicker(), 'invalid', !this.checkValidity());
          reflectAttribute(this._inputElement.getTimeCombobox(), 'invalid', !this.checkValidity());
        }
        return;
      }
      if (this._rendered && this.isTypePrimitiveInput) {
        this._shouldShowHelpMessage = false;
        this._helpMessageChanged = true;
      }
      this._helpMessage = message;
    });
  }
  resetDtInlineEditCustomValidation() {
    const isDatatableInlineEdit = typeof this.name === 'string' && this.name?.startsWith('dt-inline-edit');
    if (isDatatableInlineEdit) {
      this.setCustomValidity('');
      this.reportValidity();
    }
  }
  showHelpMessageIfInvalid() {
    this.reportValidity();
  }
  focus() {
    if (this._rendered) {
      this._inputElement.focus();
    }
  }
  blur() {
    if (this._rendered) {
      this._inputElement.blur();
    }
  }
  get primitiveSelector() {
    if (this.isTypeSimple) {
      return 'lightning-primitive-input-simple';
    }
    if (this.isTypeCheckboxButton) {
      return 'lightning-primitive-input-checkbox-button';
    }
    if (this.isTypeToggle) {
      return 'lightning-primitive-input-toggle';
    }
    if (this.isTypeColor) {
      return 'lightning-primitive-input-color';
    }
    if (this.isTypeCheckbox) {
      return 'lightning-primitive-input-checkbox';
    }
    if (this.isTypeRadio) {
      return 'lightning-primitive-input-radio';
    }
    if (this.isTypeFile) {
      return 'lightning-primitive-input-file';
    }
    return null;
  }
  get shouldShowHelpMessage() {
    return this._shouldShowHelpMessage && this._helpMessage;
  }
  get isTypePrimitiveInput() {
    return this.isTypeSimple || this.isTypeCheckboxButton || this.isTypeCheckbox || this.isTypeToggle || this.isTypeColor || this.isTypeRadio || this.isTypeFile;
  }
  get isTypeNumber() {
    return this.type === 'number';
  }
  get isTypeTelephone() {
    return this.type === 'tel';
  }
  get isTypeUrl() {
    return this.type === 'url';
  }
  get isTypeEmail() {
    return this.type === 'email';
  }
  get isTypeCheckable() {
    return this.isTypeCheckbox || this.isTypeCheckboxButton || this.isTypeRadio || this.isTypeToggle;
  }
  get isTypeToggle() {
    return this.type === 'toggle';
  }
  get isTypeText() {
    return this.type === 'text';
  }
  get isTypeCheckbox() {
    return this.type === 'checkbox';
  }
  get isTypeRadio() {
    return this.type === 'radio';
  }
  get isTypeCheckboxButton() {
    return this.type === 'checkbox-button';
  }
  get isTypeFile() {
    return this.type === 'file';
  }
  get isTypeColor() {
    return this.type === 'color';
  }
  get isTypeDate() {
    return this.type === 'date';
  }
  get isTypeDateTime() {
    return this.type === 'datetime' || this.type === 'datetime-local';
  }
  get isTypeTime() {
    return this.type === 'time';
  }
  get isTypeSearch() {
    return this.type === 'search';
  }
  get isTypeMobileDate() {
    return this.isTypeDate && !this._isDesktopBrowser();
  }
  get isTypeDesktopDate() {
    return this.isTypeDate && this._isDesktopBrowser();
  }
  get isTypeMobileDateTime() {
    return this.isTypeDateTime && !this._isDesktopBrowser();
  }
  get isTypeDesktopDateTime() {
    return this.isTypeDateTime && this._isDesktopBrowser();
  }
  get isTypeMobileTime() {
    return this.isTypeTime && !this._isDesktopBrowser();
  }
  get isTypeDesktopTime() {
    return this.isTypeTime && this._isDesktopBrowser();
  }
  get isTypeSimple() {
    const type = this.type;
    return type === 'text' || type === 'number' || type === 'email' || type === 'tel' || type === 'url' || type === 'search' || type === 'password' || type === 'range' || type === 'month' || type === 'week' || !type || !this._isDesktopBrowser() && (type === 'date' || type === 'time' || type === 'datetime' || type === 'datetime-local');
  }
  get isNativeInput() {
    return !(this.isTypeDesktopDate || this.isTypeDesktopDateTime || this.isTypeDesktopTime);
  }
  get _primitiveComponent() {
    if ((!this.cachedPrimitiveComponent || this._primitiveComponentRefreshNeeded) && !import.meta.env.SSR) {
      this.cachedPrimitiveComponent = this.template.querySelector(this.primitiveSelector);
      this._primitiveComponentRefreshNeeded = false;
    }
    return this.cachedPrimitiveComponent;
  }
  get computedAriaLabel() {
    const ariaValues = [];
    if (this.isTypeMobileDateTime) {
      ariaValues.push(this.dateAriaLabel);
      ariaValues.push(this.timeAriaLabel);
    }
    if (this.ariaLabel) {
      ariaValues.push(this.ariaLabel);
    }
    return normalizeAriaAttribute(ariaValues);
  }
  get computedColorAriaLabel() {
    const ariaValues = [];
    if (this.ariaLabel) {
      ariaValues.push(this.ariaLabel);
    }
    if (!this.ariaLabel && this.type === 'color') {
      ariaValues.push('Enter Hexadecimal value');
    }
    return normalizeAriaAttribute(ariaValues);
  }
  get computedAriaInvalid() {
    return computeAriaInvalid(this._helpMessage, this.value, this.ariaInvalid);
  }
  get isLabelHidden() {
    return this.variant === VARIANT.LABEL_HIDDEN;
  }
  get isLabelStacked() {
    return this.variant === VARIANT.LABEL_STACKED;
  }
  get accesskey() {
    return this._accesskey;
  }
  get i18n() {
    return i18n;
  }
  get computedLabelClass() {
    const classnames = classSet('slds-form-element__label');
    if (this.isTypeCheckable || this.isTypeFile) {} else if (this.isTypeToggle) {
      classnames.add('slds-m-bottom_none');
    } else {
      classnames.add('slds-no-flex');
    }
    return classnames.add({
      'slds-assistive-text': this.isLabelHidden
    }).toString();
  }
  get normalizedMax() {
    assertContext(this);
    return this._normalizeDateTimeString(this.max);
  }
  get normalizedMin() {
    assertContext(this);
    return this._normalizeDateTimeString(this.min);
  }
  get _inputElement() {
    if (!import.meta.env.SSR && (!this._cachedInputElement || this._inputElementRefreshNeeded)) {
      this._inputDragonDecorated = false;
      let inputElement;
      if (this.isTypeDesktopDate) {
        inputElement = this.template.querySelector('lightning-datepicker');
      } else if (this.isTypeDesktopDateTime) {
        inputElement = this.template.querySelector('lightning-datetimepicker');
      } else if (this.isTypeDesktopTime) {
        inputElement = this.template.querySelector('lightning-timepicker');
      } else {
        const primitiveComponent = this._primitiveComponent;
        if (primitiveComponent?.inputElement) {
          inputElement = primitiveComponent.inputElement;
          this._inputDragonDecorated = true;
          decorateInputForDragon(inputElement);
        }
      }
      if (inputElement) {
        this._inputElementRefreshNeeded = false;
        this._cachedInputElement = inputElement;
      }
    }
    return this._cachedInputElement;
  }
  get _inputTypeForValidity() {
    let inputType = 'text';
    if (this.isTypeSimple) {
      if (this.isTypeEmail) {
        inputType = 'text';
      } else if (this.isTypeNumber) {
        inputType = 'number';
      } else {
        inputType = this.type;
      }
    } else if (this.isTypeCheckable) {
      inputType = this.isTypeRadio ? 'radio' : 'checkbox';
    } else if (this.isTypeFile) {
      inputType = 'file';
    } else if (this.isTypeDateTime) {
      inputType = 'datetime-local';
    } else if (this.isTypeTime) {
      inputType = 'time';
    } else if (this.isTypeDate) {
      inputType = 'date';
    }
    return inputType;
  }
  get _displayedValue() {
    if (this.isTypeNumber || this.isTypeMobileDate || this.isTypeMobileDateTime || this.isTypeMobileTime) {
      const subcomponent = this._primitiveComponent;
      return subcomponent.getDisplayedValue();
    }
    return this._value;
  }
  get isStandardVariant() {
    return this.variant === VARIANT.STANDARD || this.variant === VARIANT.LABEL_HIDDEN;
  }
  get _ignoreRequired() {
    return this.isTypeFile && this._required && this.files && this.files.length;
  }
  get _constraint() {
    if (import.meta.env.SSR) {
      return {};
    } else if (!this._constraintApi) {
      const overrides = {
        badInput: () => {
          if (!this._rendered) {
            return false;
          }
          if (!this.isNativeInput) {
            return this._inputElement.hasBadInput();
          }
          return this._inputElement.validity.badInput;
        },
        badNumericInput: () => {
          if (this.isTypeNumber) {
            return !isValidNumber(this._primitiveComponent?.getNumberRawValue());
          }
          return false;
        },
        tooLong: () => this.isNativeInput && !this.isTypeNumber && this._rendered && this._inputElement.validity.tooLong,
        tooShort: () => this.isNativeInput && !this.isTypeNumber && this._rendered && this._inputElement.validity.tooShort,
        patternMismatch: () => this.isNativeInput && this._rendered && this._inputElement.validity.patternMismatch,
        badEmailInput: () => {
          if (this.isTypeEmail) {
            if (this._multiple) {
              return !isValidMultipleEmails(this.value);
            }
            return !isValidEmail(this.value);
          }
          return false;
        }
      };
      if (this.isTypeDesktopDateTime || this.isTypeDesktopTime || this.isTypeDesktopDate) {
        overrides.rangeOverflow = () => {
          const max = this.isTypeDesktopTime ? normalizeTime(this.max) : this.max;
          return isAfter(this.value, max);
        };
        overrides.rangeUnderflow = () => {
          const min = this.isTypeDesktopTime ? normalizeTime(this.min) : this.min;
          return isBefore(this.value, min);
        };
        overrides.stepMismatch = () => false;
      }
      if (this.isIE11) {
        overrides.stepMismatch = () => false;
      }
      this._constraintApi = new FieldConstraintApiWithProxyInput(() => {
        if (!this.isNativeInput) {
          return this._inputElement;
        }
        return this;
      }, overrides);
      this._constraintApiProxyInputUpdater = this._constraintApi.setInputAttributes({
        type: () => this._inputTypeForValidity,
        value: () => this._normalizeDateTimeString(this.value),
        checked: () => this.checked,
        maxlength: () => this.maxLength,
        minlength: () => this.minLength,
        pattern: () => this.pattern,
        max: () => this.normalizedMax,
        min: () => this.normalizedMin,
        step: () => this.step,
        accept: () => this.accept,
        multiple: () => this.multiple,
        disabled: () => this.disabled,
        readonly: () => this.readOnly,
        required: () => this.required && !this._ignoreRequired
      });
    }
    return this._constraintApi;
  }
  get hasExternalLabel() {
    return this.variant === VARIANT.LABEL_HIDDEN && this.ariaLabelledBy && this.ariaLabelledBy.length;
  }
  get helptextAlternativeText() {
    return formatLabel(i18n.helpTextAlternativeText, this.label);
  }
  get isAutoCompleteSupported() {
    return this.isTypeTelephone || this.isTypeUrl || this.isTypeSearch || this.isTypeEmail || this.isTypeText;
  }
  get templateRootNode() {
    return !import.meta.env.SSR ? this.template.host.getRootNode() : null;
  }
  handleFocus(event) {
    if (isBubblingFocusEvent(event)) {
      event.stopPropagation();
      return;
    }
    this.interactingState.enter();
    if (this.isTypeColor) {
      this._isColorPickerPanelOpen = false;
    }
    this.dispatchEvent(new CustomEvent('focus'));
  }
  handleBlur(event) {
    if (isBubblingFocusEvent(event)) {
      event.stopPropagation();
      return;
    }
    this.interactingState.leave();
    if (this._rendered && this.isTypeNumber) {
      this._setInputValue(this._displayedValue);
    }
    if (!event.relatedTarget || !this.template.contains(event.relatedTarget)) {
      this.dispatchEvent(new CustomEvent('blur'));
    }
  }
  handleCheckboxClick() {
    if (this.template.activeElement === null) {
      this.template.querySelector("[type='checkbox']").focus();
    }
  }
  handleChange(event) {
    event.stopPropagation();
    this.resetDtInlineEditCustomValidation();
    this._dispatchCommitEvent();
    this._dispatchChangeEvent();
  }
  handleCommit() {
    this._dispatchCommitEvent();
  }
  handlePrimitiveInputFileChange() {
    this._dispatchCommitEvent();
    const detail = {
      files: this.files,
      value: this._inputElement.value
    };
    this._updateProxyInputAttributes('required');
    this._updateValueAndValidityAttribute(detail.value);
    this.dispatchEvent(new CustomEvent('change', {
      composed: true,
      bubbles: true,
      detail
    }));
  }
  handlePrimitiveInputChange(event) {
    this.interactingState.enter();
    this.resetDtInlineEditCustomValidation();
    this._updateValueAndValidityAttribute(event.detail.value);
  }
  _dispatchCommitEvent() {
    this.dispatchEvent(new CustomEvent('commit'));
  }
  _dispatchChangeEventWithDetail(detail) {
    this.dispatchEvent(new CustomEvent('change', {
      composed: true,
      bubbles: true,
      detail
    }));
  }
  _validateType(type) {
    if (VALID_INPUT_TYPES.includes(type)) {
      return true;
    }
    const invalidMsg = `<lightning-input> The type attribute value "${type}" is invalid.`;
    assert(type !== 'hidden', `${invalidMsg} Use a regular <input type="hidden"> instead.`);
    assert(type !== 'submit' && type !== 'reset' && type !== 'image' && type !== 'button', `${invalidMsg} Use <lightning:button> instead.`);
    if (this.isTypeRadio) {
      assert(!this.required, `<lightning-input> The required attribute is not supported on radio inputs directly. It should be implemented at the radio group level.`);
    }
    if (type === 'phone') {
      console.warn(`${invalidMsg} Please use <lightning-input type="tel"> instead. Defaulting to text type.`);
    } else if (type === 'week' || type === 'month') {
      console.warn(`${invalidMsg} Please use <lightning-combobox> and/or <lightning-input type="number"> instead to avoid inconsistencies and breakages across browsers.`);
    } else {
      console.warn(`${invalidMsg} Defaulting to text type.`);
    }
    return false;
  }
  validateRequiredAttributes() {
    const {
      label
    } = this;
    assert(typeof label === 'string' && label.length, `<lightning-input> The required label attribute value "${label}" is invalid.`);
  }
  _setInputValue(value) {
    if (features.enableAssertContext260) {
      assertContext(this);
    }
    if (this._inputDragonDecorated) {
      setDecoratedDragonInputValueWithoutEvent(this._inputElement, value);
    } else {
      valueSetter(this._inputElement, [HTMLInputElement], value);
    }
  }
  _dispatchChangeEvent() {
    this.interactingState.enter();
    const detail = {};
    if (this.isTypeCheckable) {
      this._updateCheckedAndValidityAttribute(this._inputElement.checked);
      detail.checked = this._checked;
      if (features.enableIndeterminateForInput && this.isTypeCheckbox && this._indeterminate) {
        this._indeterminate = false;
        if (this._rendered && this._primitiveComponent) {
          this._primitiveComponent.indeterminate = false;
        }
        reflectAttribute(this, 'indeterminate', false);
      }
    }
    if (!this.isTypeCheckable) {
      if (!this.isTypeNumber) {
        detail.value = this._inputElement.value;
      }
      if (this.isTypeMobileDateTime) {
        detail.value = normalizeDateTimeToUTC(detail.value, this.timezone);
      } else if (this.isTypeMobileTime) {
        detail.value = normalizeTime(detail.value);
      }
      this._updateValueAndValidityAttribute(detail.value);
    }
    this._dispatchChangeEventWithDetail(detail);
  }
  _isDesktopBrowser() {
    return formFactor === 'Large';
  }
  _updateValueAndValidityAttribute(value) {
    this._value = value;
    this._updateProxyInputAttributes('value');
  }
  _updateCheckedAndValidityAttribute(value) {
    this._checked = value;
    this._updateProxyInputAttributes('checked');
    reflectAttribute(this, 'checked', this._checked);
  }
  _updateProxyInputAttributes(attributes) {
    if (this._constraintApiProxyInputUpdater) {
      this._constraintApiProxyInputUpdater(attributes);
    }
  }
  updateClassListForVariant() {
    classListMutation(this.classList, {
      'slds-form-element_stacked': this.variant === VARIANT.LABEL_STACKED,
      'slds-form-element_horizontal': this.variant === VARIANT.LABEL_INLINE
    });
  }
  _normalizeDateTimeString(value) {
    let result = value;
    if (this.isTypeDate) {
      result = normalizeDate(value);
    } else if (this.isTypeTime) {
      result = normalizeTime(value);
    } else if (this.isTypeDateTime) {
      result = normalizeUTCDateTime(value, this.timezone);
    }
    return result;
  }
  _updateDateOrTimePickerA11y(elem) {
    synchronizeAttrs(elem, {
      ariaLabelledByElement: this._ariaLabelledBy,
      ariaDescribedByElements: this._ariaDescribedBy,
      ariaErrorMessageElement: this._ariaErrorMessage,
      ariaControlsElement: this._ariaControls,
      ariaDetailsElements: this._ariaDetails,
      [ARIA_LABEL]: this.computedAriaLabel
    });
  }
  _updateDateTimePickerA11y(elem) {
    synchronizeAttrs(elem, {
      dateAriaLabelledBy: this.dateAriaLabelledBy,
      dateAriaDescribedBy: this.dateAriaDescribedBy,
      dateAriaControls: this.dateAriaControls,
      dateAriaLabel: this.dateAriaLabel,
      dateAriaDetails: this.dateAriaDetails,
      dateAriaErrorMessage: this.dateAriaErrorMessage,
      timeAriaLabelledBy: this.timeAriaLabelledBy,
      timeAriaDescribedBy: this.timeAriaDescribedBy,
      timeAriaControls: this.timeAriaControls,
      timeAriaLabel: this.timeAriaLabel,
      timeAriaDetails: this.timeAriaDetails,
      timeAriaErrorMessage: this.timeAriaErrorMessage
    });
  }
  _updateColorA11y(elem) {
    synchronizeAttrs(elem, {
      [ARIA_LABEL]: this.computedColorAriaLabel
    });
  }
  _synchronizeA11y() {
    const datepicker = this.template.querySelector('lightning-datepicker');
    const timepicker = this.template.querySelector('lightning-timepicker');
    const datetimepicker = this.template.querySelector('lightning-datetimepicker');
    const colorpicker = this.template.querySelector('lightning-primitive-input-color');
    if (datepicker) {
      this._updateDateOrTimePickerA11y(datepicker);
    } else if (timepicker) {
      this._updateDateOrTimePickerA11y(timepicker);
    } else if (datetimepicker) {
      this._updateDateTimePickerA11y(datetimepicker);
    } else if (colorpicker) {
      this._updateColorA11y(colorpicker);
    }
  }
  /*LWC compiler v9.5.3*/
}
LightningInput.validationOptOut = ['class'];
LightningInput.interopMap = void 0;
_registerDecorators(LightningInput, {
  publicProps: {
    placeholder: {
      config: 0
    },
    name: {
      config: 0
    },
    label: {
      config: 0
    },
    messageWhenBadInput: {
      config: 0
    },
    messageWhenPatternMismatch: {
      config: 0
    },
    messageWhenRangeOverflow: {
      config: 0
    },
    messageWhenRangeUnderflow: {
      config: 0
    },
    messageWhenStepMismatch: {
      config: 0
    },
    messageWhenTooShort: {
      config: 0
    },
    messageWhenTooLong: {
      config: 0
    },
    messageWhenTypeMismatch: {
      config: 0
    },
    messageWhenValueMissing: {
      config: 0
    },
    messageToggleActive: {
      config: 0
    },
    messageToggleInactive: {
      config: 0
    },
    ariaLabel: {
      config: 0
    },
    autocomplete: {
      config: 3
    },
    dateStyle: {
      config: 0
    },
    timeStyle: {
      config: 0
    },
    dateAriaLabel: {
      config: 0
    },
    timeAriaLabel: {
      config: 0
    },
    dateAccessKey: {
      config: 0
    },
    timeAccessKey: {
      config: 0
    },
    timeStepMinutes: {
      config: 0
    },
    inputmode: {
      config: 3
    },
    formatFractionDigits: {
      config: 0
    },
    timeAriaControls: {
      config: 3
    },
    timeAriaDetails: {
      config: 3
    },
    dateAriaErrorMessage: {
      config: 3
    },
    timeAriaErrorMessage: {
      config: 3
    },
    dateAriaLabelledBy: {
      config: 3
    },
    timeAriaLabelledBy: {
      config: 3
    },
    timeAriaDescribedBy: {
      config: 3
    },
    dateAriaControls: {
      config: 3
    },
    dateAriaDetails: {
      config: 3
    },
    dateAriaDescribedBy: {
      config: 3
    },
    ariaControls: {
      config: 3
    },
    ariaDetails: {
      config: 3
    },
    ariaActiveDescendantElement: {
      config: 3
    },
    ariaLabelledBy: {
      config: 3
    },
    ariaDescribedBy: {
      config: 3
    },
    ariaErrorMessage: {
      config: 3
    },
    ariaInvalid: {
      config: 3
    },
    ariaHasPopup: {
      config: 0
    },
    ariaKeyShortcuts: {
      config: 0
    },
    ariaDisabled: {
      config: 0
    },
    ariaRoleDescription: {
      config: 0
    },
    ariaExpanded: {
      config: 0
    },
    ariaAutoComplete: {
      config: 0
    },
    formatter: {
      config: 3
    },
    type: {
      config: 3
    },
    isLoading: {
      config: 3
    },
    pattern: {
      config: 3
    },
    maxLength: {
      config: 3
    },
    accept: {
      config: 3
    },
    minLength: {
      config: 3
    },
    max: {
      config: 3
    },
    min: {
      config: 3
    },
    step: {
      config: 3
    },
    checked: {
      config: 3
    },
    indeterminate: {
      config: 3
    },
    multiple: {
      config: 3
    },
    value: {
      config: 3
    },
    variant: {
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
    timezone: {
      config: 3
    },
    fieldLevelHelp: {
      config: 3
    },
    accessKey: {
      config: 3
    },
    files: {
      config: 3
    },
    validity: {
      config: 1
    },
    selectionStart: {
      config: 3
    },
    selectionEnd: {
      config: 3
    },
    role: {
      config: 3
    }
  },
  publicMethods: ["checkValidity", "setCustomValidity", "reportValidity", "showHelpMessageIfInvalid", "focus", "blur"],
  track: {
    _timeAriaDescribedBy: 1,
    _timeAriaLabelledBy: 1,
    _timeAriaErrorMessage: 1,
    _timeAriaControls: 1,
    _dateAriaControls: 1,
    _timeAriaDetails: 1,
    _dateAriaDetails: 1,
    _dateAriaDescribedBy: 1,
    _dateAriaLabelledBy: 1,
    _dateAriaErrorMessage: 1,
    _files: 1,
    _value: 1,
    _type: 1,
    _pattern: 1,
    _max: 1,
    _min: 1,
    _step: 1,
    _disabled: 1,
    _readOnly: 1,
    _required: 1,
    _checked: 1,
    _indeterminate: 1,
    _isLoading: 1,
    _multiple: 1,
    _timezone: 1,
    _helpMessage: 1,
    _isColorPickerPanelOpen: 1,
    _fieldLevelHelp: 1,
    _accesskey: 1,
    _maxLength: 1,
    _minLength: 1,
    _accept: 1,
    _variant: 1,
    _ariaInvalid: 1,
    _autocomplete: 1,
    _rendered: 1
  },
  fields: ["isIE11", "_normalizedInputModeOverrideValue", "_ariaActiveDescendantElement", "_shouldShowHelpMessage", "_helpMessageChanged", "_formatter", "_initialValueSet", "_isNativeShadow", "_primitiveComponentRefreshNeeded", "_inputElementRefreshNeeded", "_cachedInputElement", "cachedPrimitiveComponent", "_inputDragonDecorated", "_customMessageSet", "_constraintApi", "_constraintApiProxyInputUpdater", "ariaObserver", "interactingState", "_ariaControls", "_ariaDetails", "_ariaLabelledBy", "_ariaDescribedBy", "_ariaErrorMessage", "_role", "_useUpdatedCheckboxButtonBlueprint"]
});
const __lwc_component_class_internal = _registerComponent(LightningInput, {
  tmpl: _tmpl,
  sel: "lightning-input",
  apiVersion: 66
});
export default __lwc_component_class_internal;
LightningInput.interopMap = {
  exposeNativeEvent: {
    change: true,
    focus: true,
    blur: true
  }
};