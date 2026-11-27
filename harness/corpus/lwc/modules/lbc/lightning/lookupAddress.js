import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./lookupAddress.html";
import { registerComponent as _registerComponent } from "lwc";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import lang from '@salesforce/i18n/lang';
import labelRequired from '@salesforce/label/LightningControl.required';
import labelHelpTextAlternativeText from '@salesforce/label/LightningInput.helptextAlternativeText';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { toHighlightParts } from './highlight';
import { classSet, formatLabel } from 'lightning/utils';
import { FieldConstraintApi, InteractingState, isEmptyString, normalizeVariant, VARIANT, debounce } from 'lightning/inputUtils';
import { registerMessageHandler, unregisterMessageHandler, createMessage, postMessage } from 'lightning/messageDispatcher';
import { normalizeBoolean, synchronizeAttrs } from 'lightning/utilsPrivate';
import { buildMapSourceUrl } from 'lightning/mapUtils';
import AriaObserver from 'lightning/ariaObserver';
import { INTERNAL_GOOGLE_LOGO, POWERED_BY_GOOGLE } from './googleLogo';
import { getLocation } from './location';
const DEFAULT_TYPES = ['geocode'];
const DEBOUNCE_PERIOD = 250;
const MAX_FILTER_ARR_LEN = 5;
const COUNTRY_CODE_LEN = 2;
const EVENT_NAME = {
  INITIALIZE_PLACE_API: 'initialize',
  QUERY_PLACE_AUTOCOMPLETE: 'queryAddress',
  QUERY_PLACE_DETAIL: 'selectAddress',
  PLACE_AUTOCOMPLETE: 'force:showAddressSuggestions',
  PLACE_DETAIL: 'force:saveAddressLookup',
  PLACE_API_READY: 'place-api-ready'
};
const i18n = {
  required: labelRequired,
  helpTextAlternativeText: labelHelpTextAlternativeText
};
class LightningLookupAddress extends LightningShadowBaseClass {
  constructor() {
    super();
    this.label = void 0;
    this.inputText = '';
    this.placeholder = void 0;
    this.name = void 0;
    this.autocomplete = void 0;
    this._inputIconName = 'utility:search';
    this._items = void 0;
    this._showActivityIndicator = void 0;
    this._variant = void 0;
    this._disabled = void 0;
    this._isLoaded = false;
    this._helpMessage = void 0;
    this._ariaDescribedBy = '';
    this._required = false;
    this._fieldLevelHelp = void 0;
    this._googleLogoUrl = void 0;
    this._googleLogoText = POWERED_BY_GOOGLE;
    this._labelForId = void 0;
    this.interactingState = void 0;
    this._countryLookupFilter = [];
    this.placeIconName = 'utility:checkin';
    this.apiDomain = `*`;
    this.apiSrc = buildMapSourceUrl({
      resource: 'placeApi',
      locale: lang
    });
    this.createAriaObserver();
  }
  connectedCallback() {
    super.connectedCallback();
    this._items = [];
    this._dispatchId = !import.meta.env.SSR ? registerMessageHandler(event => {
      this.handleMessage(event);
    }) : null;
    this._debouncedTextInput = debounce(text => {
      this._requestSuggestions(text);
    }, DEBOUNCE_PERIOD);
    this.createAriaObserver();
    this.interactingState = new InteractingState();
    this.interactingState.onleave(() => this.showHelpMessageIfInvalid());
  }
  disconnectedCallback() {
    if (this._dispatchId) {
      unregisterMessageHandler(this._dispatchId);
    }
    if (this.ariaObserver) {
      this.ariaObserver.disconnect();
      this.ariaObserver = undefined;
    }
  }
  get isLoaded() {
    return this.alwaysRender || this._isLoaded;
  }
  get alwaysRender() {
    return this._alwaysRender || false;
  }
  set alwaysRender(value) {
    this._alwaysRender = normalizeBoolean(value);
  }
  get variant() {
    return this._variant || VARIANT.STANDARD;
  }
  set variant(value) {
    this._variant = normalizeVariant(value);
  }
  get required() {
    return this._required;
  }
  set required(value) {
    this._required = normalizeBoolean(value);
  }
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = normalizeBoolean(value);
    if (this._disabled && this._dropdownVisible) {
      this.closeDropdown();
    }
  }
  get countryLookupFilter() {
    return this._countryLookupFilter;
  }
  set countryLookupFilter(value) {
    const isValidCountryFilter = Array.isArray(value) && value.length <= MAX_FILTER_ARR_LEN && value.every(countryCode => typeof countryCode === 'string' && countryCode.length === COUNTRY_CODE_LEN);
    if (isValidCountryFilter) {
      this._countryLookupFilter = value;
    } else {
      console.warn('Invalid countryLookupFilter: Must be an array of 2-character strings (max length 5). Defaulting to []');
      this._countryLookupFilter = [];
    }
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
  renderedCallback() {
    const label = this.template.querySelector('label');
    if (label) {
      synchronizeAttrs(label, {
        for: this._labelForId
      });
      label.setAttribute('for', this._labelForId);
    }
    if (this.isConnected) {
      this.connectAriaDescribedBy();
      this.ariaObserver.sync();
    }
  }
  handleComboboxReady(e) {
    this._labelForId = e.detail.id;
  }
  handleMessage(data) {
    this._showActivityIndicator = false;
    if (!this._googleLogoUrl) {
      this._googleLogoUrl = INTERNAL_GOOGLE_LOGO;
    }
    if (data.event === EVENT_NAME.PLACE_AUTOCOMPLETE) {
      this._processAutoComplete(data.arguments.addresses);
    } else if (data.event === EVENT_NAME.PLACE_DETAIL) {
      this.dispatchChangeEvent(data.arguments);
    } else if (data.event === EVENT_NAME.PLACE_API_READY) {
      this._isLoaded = true;
    }
  }
  _requestSuggestions(matchString) {
    if (matchString) {
      this._showActivityIndicator = true;
      this.sendMessage(EVENT_NAME.QUERY_PLACE_AUTOCOMPLETE, {
        matchString,
        countryFilter: this.countryLookupFilter
      });
    } else {
      this._items = [];
    }
  }
  handleTextInput(evt) {
    const {
      detail: {
        text
      }
    } = evt;
    this.inputText = text;
    this._debouncedTextInput(text);
    this.dispatchEvent(new CustomEvent('privateuserinput', {
      detail: {
        value: text
      }
    }));
  }
  handleIframeLoad(event) {
    this._handler = event.detail.callbacks.postToWindow;
    getLocation().then(location => {
      this.sendMessage(EVENT_NAME.INITIALIZE_PLACE_API, {
        types: DEFAULT_TYPES,
        location
      });
    });
  }
  sendMessage(event, params) {
    if (this._handler) {
      const message = createMessage(this._dispatchId, event, params || {});
      postMessage(this._handler, message, '*');
    }
  }
  handleSelect(evt) {
    const {
      value
    } = evt.detail;
    if (value) {
      this._showActivityIndicator = true;
      this.sendMessage(EVENT_NAME.QUERY_PLACE_DETAIL, {
        addressCmpId: this._dispatchId,
        placeId: value
      });
    }
  }
  _processAutoComplete(suggestions) {
    this._showActivityIndicator = false;
    this._items = [];
    if (suggestions) {
      this._items = suggestions.map(suggestion => {
        const mainText = suggestion.structured_formatting.main_text;
        const secondaryText = suggestion.structured_formatting.secondary_text;
        const matchedSubstrings = suggestion.structured_formatting.main_text_matched_substrings;
        const parts = toHighlightParts(mainText, matchedSubstrings);
        return {
          type: 'option-card',
          text: parts,
          iconName: this.placeIconName,
          subText: secondaryText,
          value: suggestion.place_id
        };
      });
    }
  }
  dispatchChangeEvent(address) {
    if (!import.meta.env.SSR) {
      this.dispatchEvent(new CustomEvent('change', {
        detail: {
          address
        }
      }));
    }
  }
  get _constraint() {
    if (!this._constraintApi) {
      this._constraintApi = new FieldConstraintApi(() => this, {
        valueMissing: () => !this.disabled && this.required && isEmptyString(this.inputText)
      });
    }
    return this._constraintApi;
  }
  get validity() {
    return this._constraint.validity;
  }
  checkValidity() {
    return this._constraint.checkValidity();
  }
  setCustomValidity(message) {
    this._constraint.setCustomValidity(message);
  }
  reportValidity() {
    if (!import.meta.env.SSR) {
      return this._constraint.reportValidity(message => {
        this._helpMessage = message;
      });
    }
    return null;
  }
  showHelpMessageIfInvalid() {
    this.reportValidity();
  }
  get fieldLevelHelp() {
    return this._fieldLevelHelp;
  }
  set fieldLevelHelp(value) {
    this._fieldLevelHelp = value;
  }
  get helptextAlternativeText() {
    return formatLabel(i18n.helpTextAlternativeText, this.label);
  }
  get ariaDescribedBy() {
    return this._ariaDescribedBy;
  }
  set ariaDescribedBy(describedBy) {
    this._ariaDescribedBy = describedBy;
    this.connectAriaDescribedBy();
  }
  get innerInput() {
    return !import.meta.env.SSR ? this.template?.querySelector('lightning-base-combobox')?.shadowRoot?.querySelector('input') : null;
  }
  createAriaObserver() {
    if (!this.ariaObserver && !import.meta.env.SSR) {
      this.ariaObserver = new AriaObserver(this);
      this.ariaObserver.root = this.template.getRootNode();
      this.connectAriaDescribedBy();
    }
  }
  connectAriaDescribedBy() {
    const helpMessage = !import.meta.env.SSR ? this.template.querySelector('[data-help-message]') : null;
    this.ariaObserver.connect({
      targetNode: this.innerInput,
      attribute: 'aria-describedby',
      relatedNodeIds: this.ariaDescribedBy,
      relatedNodes: helpMessage
    });
  }
  handleFocus() {
    this.interactingState.enter();
    this.dispatchEvent(new CustomEvent('focus'));
  }
  handleBlur() {
    this.interactingState.leave();
    this.dispatchEvent(new CustomEvent('blur'));
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningLookupAddress, {
  publicProps: {
    label: {
      config: 0
    },
    inputText: {
      config: 0
    },
    placeholder: {
      config: 0
    },
    name: {
      config: 0
    },
    autocomplete: {
      config: 0
    },
    alwaysRender: {
      config: 3
    },
    variant: {
      config: 3
    },
    required: {
      config: 3
    },
    disabled: {
      config: 3
    },
    countryLookupFilter: {
      config: 3
    },
    validity: {
      config: 1
    },
    fieldLevelHelp: {
      config: 3
    },
    ariaDescribedBy: {
      config: 3
    }
  },
  publicMethods: ["checkValidity", "setCustomValidity", "reportValidity", "showHelpMessageIfInvalid"],
  track: {
    _inputIconName: 1,
    _items: 1,
    _showActivityIndicator: 1,
    _variant: 1,
    _disabled: 1,
    _isLoaded: 1,
    _helpMessage: 1
  },
  fields: ["_ariaDescribedBy", "_required", "_fieldLevelHelp", "_googleLogoUrl", "_googleLogoText", "_labelForId", "interactingState", "_countryLookupFilter", "placeIconName", "apiDomain", "apiSrc"]
});
const __lwc_component_class_internal = _registerComponent(LightningLookupAddress, {
  tmpl: _tmpl,
  sel: "lightning-lookup-address",
  apiVersion: 66
});
export default __lwc_component_class_internal;