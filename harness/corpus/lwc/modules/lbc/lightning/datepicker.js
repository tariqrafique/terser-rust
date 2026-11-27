import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./datepicker.html";
import { registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import labelInvalidDate from '@salesforce/label/LightningDateTimePicker.invalidDate';
import labelRangeOverflow from '@salesforce/label/LightningDateTimePicker.rangeOverflow';
import labelRangeUnderflow from '@salesforce/label/LightningDateTimePicker.rangeUnderflow';
import labelMinRangeMessage from '@salesforce/label/LightningDateTimePicker.minRangeMessage';
import labelMaxRangeMessage from '@salesforce/label/LightningDateTimePicker.maxRangeMessage';
import labelMinAndMaxRangeMessage from '@salesforce/label/LightningDateTimePicker.minAndMaxRangeMessage';
import labelRequired from '@salesforce/label/LightningControl.required';
import labelValueMissingWithDateFormat from '@salesforce/label/LightningDateTimePicker.valueMissingWithDateFormat';
import labelCustomErrorWithDateFormat from '@salesforce/label/LightningDateTimePicker.customErrorWithDateFormat';
import labelSelectDateFor from '@salesforce/label/LightningDateTimePicker.selectDateFor';
import labelHelpTextAlternativeText from '@salesforce/label/LightningInput.helptextAlternativeText';
import labelDateFormatExampleText from '@salesforce/label/LightningDateTimePicker.dateFormatExampleText';
import formFactor from '@salesforce/client/formFactor';
import orgHasA11yResizeReflow from '@salesforce/accessCheck/A11yResizeReflow.orgHasA11yResizeReflow';
import { features } from 'lightning/features';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { normalizeISODate, parseFormattedDate } from 'lightning/internationalizationLibrary';
import { startPositioning, stopPositioning, Direction } from 'lightning/positionLibrary';
import { classSet, formatLabel } from 'lightning/utils';
import { normalizeBoolean, normalizeAriaAttribute, normalizeString, synchronizeAttrs, getRealDOMId, computeAriaInvalid, reflectAttribute } from 'lightning/utilsPrivate';
import { generateUniqueId, normalizeVariant, VARIANT } from 'lightning/inputUtils';
import { handleKeyDownOnDatePickerIcon, handleBasicKeyDownBehaviour } from './keyboard';
import AriaObserver from 'lightning/ariaObserver';
const i18n = {
  invalidDate: labelInvalidDate,
  rangeOverflow: labelRangeOverflow,
  rangeUnderflow: labelRangeUnderflow,
  minRangeMessage: labelMinRangeMessage,
  maxRangeMessage: labelMaxRangeMessage,
  minAndMaxRangeMessage: labelMinAndMaxRangeMessage,
  required: labelRequired,
  selectDateFor: labelSelectDateFor,
  helpTextAlternativeText: labelHelpTextAlternativeText,
  valueMissingWithDateFormat: labelValueMissingWithDateFormat,
  customErrorWithDateFormat: labelCustomErrorWithDateFormat,
  dateFormatExampleText: labelDateFormatExampleText
};
const ARIA_CONTROLS = 'aria-controls';
const ARIA_DETAILS = 'aria-details';
const ARIA_LABEL = 'aria-label';
const ARIA_DISABLED = 'aria-disabled';
const ARIA_LABELLEDBY = 'aria-labelledby';
const ARIA_DESCRIBEDBY = 'aria-describedby';
const ARIA_INVALID = 'aria-invalid';
const ARIA_ERRORMESSAGE = 'aria-errormessage';
const DATE_STYLE = {
  SHORT: 'short',
  MEDIUM: 'medium',
  LONG: 'long'
};
const DATE_EXAMPLE = '2024-12-31';
class LightningDatePicker extends LightningShadowBaseClass {
  connectAriaErrorMessage() {
    if (this.ariaObserver && this._rendered) {
      this.ariaObserver.connect({
        attribute: ARIA_ERRORMESSAGE,
        targetSelector: 'input',
        relatedNodeIds: this._ariaErrorMessage
      });
    }
  }
  get ariaErrorMessageElement() {
    return this._ariaErrorMessage;
  }
  set ariaErrorMessageElement(el) {
    this._ariaErrorMessage = el;
    this.connectAriaErrorMessage();
  }
  get rootAriaNode() {
    if (this.ariaObserver) {
      return this.ariaObserver.root;
    }
    return null;
  }
  set rootAriaNode(root) {
    if (this.ariaObserver) {
      this.ariaObserver.root = root;
    }
  }
  setNormalisedIsoDateMin() {
    const normalizedDate = normalizeISODate(this._userMinValue, this._dateStyle);
    if (normalizedDate.isoValue) {
      this._min = normalizedDate.isoValue;
      this._displayMin = normalizedDate.displayValue;
    }
  }
  get min() {
    return this._min;
  }
  set min(value) {
    this._min = value;
    this._displayMin = value;
    this._userMinValue = value;
    this.setNormalisedIsoDateMin();
  }
  setNormalisedIsoDateMax() {
    const normalizedDate = normalizeISODate(this._userMaxValue, this._dateStyle);
    if (normalizedDate.isoValue) {
      this._max = normalizedDate.isoValue;
      this._displayMax = normalizedDate.displayValue;
    }
  }
  get max() {
    return this._max;
  }
  set max(value) {
    this._max = value;
    this._displayMax = value;
    this._userMaxValue = value;
    this.setNormalisedIsoDateMax();
  }
  get messageWhenValueMissing() {
    if (this._messageWhenValueMissing) {
      return formatLabel(this.i18n.customErrorWithDateFormat, this._messageWhenValueMissing, this.dateFormatExample);
    }
    return formatLabel(this.i18n.valueMissingWithDateFormat, this.dateFormatExample);
  }
  set messageWhenValueMissing(message) {
    this._messageWhenValueMissing = message;
  }
  get messageWhenBadInput() {
    if (this._messageWhenBadInput) {
      return formatLabel(this.i18n.customErrorWithDateFormat, this._messageWhenBadInput, this.dateFormatExample);
    }
    return formatLabel(this.i18n.invalidDate, this.dateFormatExample);
  }
  set messageWhenBadInput(message) {
    this._messageWhenBadInput = message;
  }
  get messageWhenRangeOverflow() {
    if (this._messageWhenRangeOverflow) {
      return formatLabel(this.i18n.customErrorWithDateFormat, this._messageWhenRangeOverflow, this.dateFormatExample);
    }
    return formatLabel(this.i18n.rangeOverflow, this._displayMax);
  }
  set messageWhenRangeOverflow(message) {
    this._messageWhenRangeOverflow = message;
  }
  get messageWhenRangeUnderflow() {
    if (this._messageWhenRangeUnderflow) {
      return formatLabel(this.i18n.customErrorWithDateFormat, this._messageWhenRangeUnderflow, this.dateFormatExample);
    }
    return formatLabel(this.i18n.rangeUnderflow, this._displayMin);
  }
  set messageWhenRangeUnderflow(message) {
    this._messageWhenRangeUnderflow = message;
  }
  get ariaLabel() {
    return this._ariaLabel;
  }
  set ariaLabel(val) {
    this._ariaLabel = val;
    this.synchronizeA11y();
  }
  get ariaDisabled() {
    return this._ariaDisabled;
  }
  set ariaDisabled(val) {
    this._ariaDisabled = val;
    this.synchronizeA11y();
  }
  set ariaLabelledByElement(el) {
    this._ariaLabelledBy = el;
    if (this.ariaObserver) {
      this.ariaObserver.connect({
        attribute: ARIA_LABELLEDBY,
        targetSelector: 'input',
        relatedNodeIds: getRealDOMId(this._ariaLabelledBy)
      });
    }
  }
  get ariaLabelledByElement() {
    return this._ariaLabelledBy;
  }
  set ariaControlsElement(el) {
    this._ariaControls = el;
    if (this.ariaObserver) {
      this.ariaObserver.connect({
        attribute: ARIA_CONTROLS,
        targetSelector: 'input',
        relatedNodeIds: getRealDOMId(this.ariaControlsElement)
      });
    }
  }
  get ariaControlsElement() {
    return this._ariaControls;
  }
  set ariaDetailsElements(el) {
    this._ariaDetails = el;
    if (this.ariaObserver) {
      this.ariaObserver.connect({
        attribute: ARIA_DETAILS,
        targetSelector: 'input',
        relatedNodeIds: getRealDOMId(this.ariaDetailsElements)
      });
    }
  }
  get ariaDetailsElements() {
    return this._ariaDetails;
  }
  set ariaDescribedByElements(el) {
    if (Array.isArray(el)) {
      this._ariaDescribedBy = el;
    } else {
      this._ariaDescribedBy = [el];
    }
    if (!features.enableDatepickerAriaDescribedByDedup) {
      this._ariaDescribedBy.push(this.errorMessageElement);
    }
    this.connectAriaDescribedBy();
  }
  get ariaDescribedByElements() {
    return this._ariaDescribedBy;
  }
  synchronizeA11y() {
    if (!this._rendered) {
      return;
    }
    const input = this.template.querySelector('input');
    if (!input) {
      return;
    }
    synchronizeAttrs(input, {
      [ARIA_LABEL]: this._ariaLabel,
      [ARIA_DISABLED]: this._ariaDisabled,
      [ARIA_INVALID]: this.computedAriaInvalid
    });
    const calendarButton = this.template.querySelector('lightning-button-icon');
    calendarButton.ariaDescribedBy = this.computedDatepickerButtonAriaDescribedby;
    if (this.isConnected) {
      this.connectAriaDescribedBy();
      this.connectAriaErrorMessage();
      this.ariaObserver.sync();
    }
  }
  renderedCallback() {
    if (this.showFormatHelpText && !this.pointerEventAdded) {
      document.addEventListener('pointerdown', this.handlePointerDown);
      document.addEventListener('pointerup', this.handlePointerUp);
      this.pointerEventAdded = true;
    } else if (!this.showFormatHelpText && this.pointerEventAdded) {
      document.removeEventListener('pointerdown', this.handlePointerDown);
      document.removeEventListener('pointerup', this.handlePointerUp);
      this.pointerEventAdded = false;
    }
    this._rendered = true;
    this.synchronizeA11y();
  }
  get value() {
    return this._value;
  }
  set value(newValue) {
    const normalizedDate = normalizeISODate(newValue, this.dateStyle);
    this._value = normalizedDate.isoValue;
    this._displayValue = normalizedDate.displayValue;
  }
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = normalizeBoolean(value);
    reflectAttribute(this, 'disabled', this._disabled);
  }
  get readOnly() {
    return this._readonly;
  }
  set readOnly(value) {
    this._readonly = normalizeBoolean(value);
    reflectAttribute(this, 'readonly', this._readonly);
  }
  get required() {
    return this._required;
  }
  set required(value) {
    this._required = normalizeBoolean(value);
  }
  set fieldLevelHelp(value) {
    this._fieldLevelHelp = value;
  }
  get fieldLevelHelp() {
    return this._fieldLevelHelp;
  }
  get variant() {
    return this._variant || VARIANT.STANDARD;
  }
  set variant(value) {
    this._variant = normalizeVariant(value);
    reflectAttribute(this, 'variant', value);
  }
  focus() {
    if (this.connected) {
      this.inputElement.focus();
    }
  }
  blur() {
    if (this.connected) {
      this.inputElement.blur();
    }
  }
  showHelpMessage(message) {
    if (!message) {
      this.classList.remove('slds-has-error');
      this._errorMessage = '';
    } else {
      this.classList.add('slds-has-error');
      this._errorMessage = message;
    }
  }
  hasBadInput() {
    return !!this._displayValue && this._value === null;
  }
  get dateStyle() {
    return this._dateStyle;
  }
  set dateStyle(value) {
    this._dateStyle = normalizeString(value, {
      fallbackValue: DATE_STYLE.MEDIUM,
      validValues: [DATE_STYLE.SHORT, DATE_STYLE.MEDIUM, DATE_STYLE.LONG]
    });
    const normalizedDate = normalizeISODate(this._value, this._dateStyle);
    this._displayValue = normalizedDate.displayValue;
    this.setNormalisedIsoDateMax();
    this.setNormalisedIsoDateMin();
  }
  constructor() {
    super();
    this._disabled = false;
    this._readonly = false;
    this._required = false;
    this._value = null;
    this._calendarVisible = false;
    this._displayValue = null;
    this._errorMessage = '';
    this._fieldLevelHelp = void 0;
    this._variant = void 0;
    this.accessKey = void 0;
    this._min = void 0;
    this._max = void 0;
    this._messageWhenValueMissing = void 0;
    this._userMaxValue = void 0;
    this._userMinValue = void 0;
    this._displayMin = void 0;
    this._displayMax = void 0;
    this._dateStyle = DATE_STYLE.MEDIUM;
    this.showFormatHelpText = false;
    this.clickedOutsideDatepicker = void 0;
    this.label = void 0;
    this.name = void 0;
    this.placeholder = void 0;
    this.externalErrorMessage = void 0;
    this.parentErrorMessageElement = void 0;
    this.autocomplete = 'off';
    this._ariaLabelledBy = void 0;
    this._ariaControls = void 0;
    this._ariaDetails = void 0;
    this._ariaDescribedBy = [];
    this._ariaErrorMessage = void 0;
    this.handlePointerDown = event => {
      const datePickerSelector = '.slds-dropdown-trigger';
      let datepickerClosestTarget = null;
      if (event.target && typeof event.target.closest === 'function') {
        datepickerClosestTarget = event.target.closest(datePickerSelector);
      } else if (event.relatedTarget && typeof event.relatedTarget.closest === 'function') {
        datepickerClosestTarget = event.relatedTarget.closest(datePickerSelector);
      }
      if (this.showFormatHelpText && !datepickerClosestTarget) {
        this.clickedOutsideDatepicker = true;
      }
    };
    this.handlePointerUp = () => {
      if (this.clickedOutsideDatepicker) {
        this.showFormatHelpText = false;
        this.clickedOutsideDatepicker = false;
      }
    };
    this.uniqueId = generateUniqueId();
    this.ariaObserver = new AriaObserver(this);
  }
  connectedCallback() {
    super.connectedCallback();
    this.connected = true;
    if (!this.ariaObserver) {
      this.ariaObserver = new AriaObserver(this);
    }
    this.keyboardInterface = this.datepickerKeyboardInterface();
  }
  disconnectedCallback() {
    this.connected = false;
    this._rendered = false;
    if (this.ariaObserver) {
      this.ariaObserver.disconnect();
      this.ariaObserver = undefined;
    }
  }
  get computedClassFormatText() {
    return classSet('slds-form-element__help').add({
      'slds-assistive-text': !this.showFormatHelpText
    });
  }
  get computedShowDateFormat() {
    return !this.errorMessage && !this.externalErrorMessage;
  }
  get dateFormatExample() {
    return normalizeISODate(DATE_EXAMPLE, this.dateStyle).displayValue;
  }
  get dateFormatText() {
    return formatLabel(this.i18n.dateFormatExampleText, this.dateFormatExample);
  }
  get i18n() {
    return i18n;
  }
  get isLabelHidden() {
    return this.variant === VARIANT.LABEL_HIDDEN;
  }
  get computedLabelClass() {
    return classSet('slds-form-element__label').add({
      'slds-assistive-text': this.isLabelHidden
    }).toString();
  }
  get errorMessageElement() {
    return this.template.querySelector('[data-error-message]');
  }
  get rangeMessageElement() {
    return this.template.querySelector('[data-range-message]');
  }
  get dateFormatElement() {
    return this.template.querySelector('[data-date-format]');
  }
  get computedUniqueRangeMessageElementId() {
    const el = this.template.querySelector('[data-range-message]');
    return getRealDOMId(el);
  }
  get isRangeMessageVisible() {
    return this.min || this.max;
  }
  get isCalendarVisible() {
    return this._calendarVisible;
  }
  get displayValue() {
    return this._displayValue;
  }
  get errorMessage() {
    return this._errorMessage;
  }
  get computedIconDisabledState() {
    return this.disabled || this.readOnly;
  }
  get ariaDescribedByElementsInternal() {
    const elements = [];
    if (this.errorMessage) {
      elements.push(this.errorMessageElement);
    } else {
      elements.push(this.dateFormatElement);
    }
    if (this.isRangeMessageVisible) {
      elements.push(this.rangeMessageElement);
    }
    return elements;
  }
  get computedAriaDescribedby() {
    const ariaValues = [];
    this._ariaDescribedBy.forEach(item => {
      const id = getRealDOMId(item);
      if (id) {
        ariaValues.push(id);
      }
    });
    return normalizeAriaAttribute(ariaValues);
  }
  connectAriaDescribedBy() {
    if (this.ariaObserver && this._rendered) {
      this.ariaObserver.connect({
        attribute: ARIA_DESCRIBEDBY,
        targetSelector: 'input',
        relatedNodeIds: this.computedAriaDescribedby,
        relatedNodes: [...this.ariaDescribedByElementsInternal, this.parentErrorMessageElement]
      });
    }
  }
  get computedDatepickerButtonAriaDescribedby() {
    if (this.isRangeMessageVisible) {
      return this.computedUniqueRangeMessageElementId;
    }
    return '';
  }
  get computedSelectDateLabel() {
    return formatLabel(this.i18n.selectDateFor, this.label);
  }
  get rangeMessage() {
    if (this.min && !this.max) {
      return formatLabel(this.i18n.minRangeMessage, this._displayMin);
    } else if (this.max && !this.min) {
      return formatLabel(this.i18n.maxRangeMessage, this._displayMax);
    } else if (this.min && this.max) {
      return formatLabel(this.i18n.minAndMaxRangeMessage, this._displayMin, this._displayMax);
    }
    return '';
  }
  handleInputChange(event) {
    event.stopPropagation();
    this._displayValue = event.currentTarget.value;
    this._value = parseFormattedDate(this._displayValue).value;
    this.dispatchChangeEvent();
  }
  handleInput() {
    this._displayValue = this.inputElement.value;
    this.hideCalendarAndFocusTrigger();
  }
  handleInputBlur() {
    if (this._value !== null) {
      const normalizedDate = normalizeISODate(this._value, this.dateStyle);
      this._displayValue = normalizedDate.displayValue;
    }
    this.onFocusOut();
  }
  handleInputClick(event) {
    if (this.readOnly) {
      return;
    }
    this.calendarTrigger = event.target;
    this.showCalendar();
  }
  onFocusIn() {
    if (this._pendingFocusOut) {
      this._pendingFocusOut = false;
    }
    if (!this._focused) {
      this.dispatchEvent(new CustomEvent('focus'));
    }
    this._focused = true;
    this.showFormatHelpText = true;
    this.clickedOutsideDatepicker = false;
  }
  onFocusOut() {
    this._pendingFocusOut = true;
    requestAnimationFrame(() => {
      if (this._pendingFocusOut) {
        this._focused = false;
        this.hideCalendar();
        this.dispatchEvent(new CustomEvent('blur'));
      }
    });
    if (!this.clickedOutsideDatepicker) {
      this.showFormatHelpText = false;
    }
  }
  handleDatePickerIconClick(event) {
    if (this.readOnly || this.disabled) {
      return;
    }
    this.calendarTrigger = event.target;
    this.showAndFocusCalendar();
  }
  handleInputKeydown(event) {
    this.calendarTrigger = event.target;
    handleBasicKeyDownBehaviour(event, this.keyboardInterface);
  }
  handleDatePickerIconKeyDown(event) {
    this.calendarTrigger = event.target;
    handleKeyDownOnDatePickerIcon(event, this.keyboardInterface);
  }
  handleCalendarKeyDown(event) {
    handleBasicKeyDownBehaviour(event, this.keyboardInterface);
  }
  handleDateSelect(event) {
    event.stopPropagation();
    this._value = event.detail.value;
    this._displayValue = normalizeISODate(this._value, this.dateStyle).displayValue;
    this.hideCalendarAndFocusTrigger();
    this.dispatchChangeEvent();
  }
  showAndFocusCalendar() {
    this.showCalendar();
    requestAnimationFrame(() => {
      this.focusCalendar();
    });
  }
  hideCalendarAndFocusTrigger() {
    this.hideCalendar();
    if (this.calendarTrigger) {
      if (this.calendarTrigger === this.calendarButtonElement) {
        this.inputElement.focus();
      } else {
        this.calendarTrigger.focus();
      }
    }
  }
  focusCalendar() {
    const calendar = this.template.querySelector('lightning-calendar');
    if (calendar) {
      calendar.focus();
    }
  }
  startPositioning() {
    const reflowResizeConfig = this.isReflowResizeActivated ? {
      keepInViewport: true,
      autoShrinkHeight: true
    } : {};
    if (this.isReflowResizeActivated) {
      const datePickerContainer = this.lightningCalendarElement.shadowRoot.querySelector('.slds-datepicker');
      datePickerContainer.style.overflow = 'auto';
      datePickerContainer.style.maxHeight = '100vh';
    }
    if (!this._relationship) {
      this._relationship = startPositioning(this, {
        target: () => this.template.querySelector('div.slds-form-element__control'),
        element: () => this.template.querySelector('lightning-calendar').shadowRoot.querySelector('div'),
        align: {
          horizontal: Direction.Right,
          vertical: Direction.Top
        },
        targetAlign: {
          horizontal: Direction.Right,
          vertical: Direction.Bottom
        },
        autoFlip: true,
        leftAsBoundary: true,
        ...reflowResizeConfig
      });
    } else {
      this._relationship.reposition();
    }
  }
  stopPositioning() {
    if (this._relationship) {
      stopPositioning(this._relationship);
      this._relationship = null;
    }
  }
  showCalendar() {
    if (!this.isCalendarVisible) {
      this.rootElement.classList.add('slds-is-open');
      this._calendarVisible = true;
    }
  }
  hideCalendar() {
    if (this.isCalendarVisible) {
      this.rootElement.classList.remove('slds-is-open');
      this.stopPositioning();
      this._calendarVisible = false;
    }
  }
  get rootElement() {
    return this.template.querySelector('div');
  }
  get inputElement() {
    return this.template.querySelector('input');
  }
  get calendarButtonElement() {
    return this.template.querySelector('lightning-button-icon');
  }
  get lightningCalendarElement() {
    return this.template.querySelector('lightning-calendar');
  }
  get isReflowResizeActivated() {
    return this.lightningCalendarElement && window.innerWidth < 684 && formFactor === 'Large' && orgHasA11yResizeReflow;
  }
  dispatchChangeEvent() {
    this.dispatchEvent(new CustomEvent('change', {
      composed: true,
      bubbles: true,
      detail: {
        value: this._value
      }
    }));
  }
  datepickerKeyboardInterface() {
    const that = this;
    return {
      showCalendar() {
        that.showAndFocusCalendar();
      },
      hideCalendar() {
        that.hideCalendarAndFocusTrigger();
      },
      isCalendarVisible() {
        return that.isCalendarVisible;
      }
    };
  }
  get hasExternalLabel() {
    return this.variant === VARIANT.LABEL_HIDDEN && this.ariaLabelledByElement && this.ariaLabelledByElement.length;
  }
  get computedAriaInvalid() {
    const dataAriaInvalid = !import.meta.env.SSR ? this.template.host.getAttribute('data-aria-invalid') : null;
    const isAriaInvalid = dataAriaInvalid || this._errorMessage;
    return computeAriaInvalid(isAriaInvalid, this.hasBadInput() || '');
  }
  get helptextAlternativeText() {
    return formatLabel(i18n.helpTextAlternativeText, this.label);
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningDatePicker, {
  publicProps: {
    accessKey: {
      config: 0
    },
    label: {
      config: 0
    },
    name: {
      config: 0
    },
    placeholder: {
      config: 0
    },
    externalErrorMessage: {
      config: 0
    },
    parentErrorMessageElement: {
      config: 0
    },
    autocomplete: {
      config: 0
    },
    ariaErrorMessageElement: {
      config: 3
    },
    rootAriaNode: {
      config: 3
    },
    min: {
      config: 3
    },
    max: {
      config: 3
    },
    messageWhenValueMissing: {
      config: 3
    },
    messageWhenBadInput: {
      config: 3
    },
    messageWhenRangeOverflow: {
      config: 3
    },
    messageWhenRangeUnderflow: {
      config: 3
    },
    ariaLabel: {
      config: 3
    },
    ariaDisabled: {
      config: 3
    },
    ariaLabelledByElement: {
      config: 3
    },
    ariaControlsElement: {
      config: 3
    },
    ariaDetailsElements: {
      config: 3
    },
    ariaDescribedByElements: {
      config: 3
    },
    value: {
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
    fieldLevelHelp: {
      config: 3
    },
    variant: {
      config: 3
    },
    dateStyle: {
      config: 3
    },
    inputElement: {
      config: 1
    }
  },
  publicMethods: ["focus", "blur", "showHelpMessage", "hasBadInput"],
  track: {
    _disabled: 1,
    _readonly: 1,
    _required: 1,
    _value: 1,
    _calendarVisible: 1,
    _displayValue: 1,
    _errorMessage: 1,
    _fieldLevelHelp: 1,
    _variant: 1
  },
  fields: ["_min", "_max", "_messageWhenValueMissing", "_userMaxValue", "_userMinValue", "_displayMin", "_displayMax", "_dateStyle", "showFormatHelpText", "clickedOutsideDatepicker", "_ariaLabelledBy", "_ariaControls", "_ariaDetails", "_ariaDescribedBy", "_ariaErrorMessage", "handlePointerDown", "handlePointerUp"]
});
const __lwc_component_class_internal = _registerComponent(LightningDatePicker, {
  tmpl: _tmpl,
  sel: "lightning-datepicker",
  apiVersion: 66
});
export default __lwc_component_class_internal;