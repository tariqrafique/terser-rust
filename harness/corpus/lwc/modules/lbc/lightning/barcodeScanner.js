import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./barcodeScanner.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { LightningElement, registerComponent as _registerComponent } from 'lwc';
import { classSet } from 'lightning/utils';
import { getBarcodeScanner } from 'lightning/mobileCapabilities';
import { normalizeString as normalize } from 'lightning/utilsPrivate';
import { features } from 'lightning/features';
import { createPrivateContext } from 'lightning/utilsInternal';
const {
  setContext,
  assertContext
} = createPrivateContext();
const DEFAULT_SIZE = 'medium';
const SCANNER_ENABLED = 'Scanner enabled';
const SCANNER_DISABLED = 'Scanner disabled';
class BarcodeScanner extends LightningElement {
  constructor() {
    super();
    this.scannerOptions = {
      barcodeTypes: ['code128', 'code39', 'code93', 'datamatrix', 'ean13', 'ean8', 'itf', 'upca', 'upce', 'pdf417', 'qr']
    };
    this.enableContinuousScan = false;
    this.enabledIconSrc = '';
    this.disabledIconSrc = '';
    this.iconSize = DEFAULT_SIZE;
    this.enabledAlternativeText = SCANNER_ENABLED;
    this.disabledAlternativeText = SCANNER_DISABLED;
    this.disabled = false;
    this._scannerAvailable = false;
    this._scannedBarcodes = null;
    this._sessionScanner = void 0;
    this._error = '';
    this._hasErrors = false;
    this._userDismissedErrorCode = 'USER_DISMISSED';
    setContext(this);
  }
  connectedCallback() {
    const sessionScanner = getBarcodeScanner();
    if (this.disabled) {
      this._scannerAvailable = false;
    } else if (sessionScanner !== null) {
      this._sessionScanner = sessionScanner;
      this._scannerAvailable = sessionScanner.isAvailable();
    }
  }
  isScannerAvailable() {
    return this._scannerAvailable;
  }
  normalizedSize() {
    return normalize(this.iconSize, {
      fallbackValue: DEFAULT_SIZE,
      validValues: ['xx-small', 'x-small', 'small', 'medium', 'large']
    });
  }
  onmousedown(e) {
    e.preventDefault();
  }
  scan() {
    this.startScanner();
  }
  get computedButtonClass() {
    const classes = classSet('slds-button');
    classes.add('slds-button_icon');
    const size = this.normalizedSize();
    switch (size) {
      case 'small':
        classes.add('slds-button_icon-small');
        break;
      case 'x-small':
        classes.add('slds-button_icon-x-small');
        break;
      case 'xx-small':
        classes.add('slds-button_icon-xx-small');
        break;
      case 'large':
      case 'medium':
      default:
    }
    return classes.toString();
  }
  startScanner() {
    this._scannedBarcodes = new Set();
    this._hasErrors = false;
    const sessionScanner = this._sessionScanner;
    if (sessionScanner != null && sessionScanner.isAvailable()) {
      sessionScanner.beginCapture(this.scannerOptions).then(result => {
        this.processScannedBarcode(result);
        if (this.enableContinuousScan) {
          this.continueScanning();
        } else {
          this.dispatchBarcodes();
          sessionScanner.endCapture();
        }
      }).catch(error => {
        this.handleError(error);
      });
    }
  }
  handleError(error) {
    if (features.enableAssertContextForBarcodeScanner) {
      assertContext(this);
    }
    if (error.code !== this._userDismissedErrorCode) {
      this.dispatchError(error);
    } else {
      this.dispatchBarcodes();
    }
    this._sessionScanner.endCapture();
  }
  continueScanning() {
    this._sessionScanner.resumeCapture().then(scannedBarcode => {
      this.processScannedBarcode(scannedBarcode);
      this.continueScanning();
    }).catch(error => {
      this.handleError(error);
    });
  }
  processScannedBarcode(result) {
    if (features.enableAssertContextForBarcodeScanner) {
      assertContext(this);
    }
    const scannedBarcode = result.value;
    if (this._scannedBarcodes.has(scannedBarcode)) {
      return;
    }
    this._scannedBarcodes.add(scannedBarcode);
  }
  dispatchBarcodes() {
    const scannedBarcodes = [...this._scannedBarcodes];
    const detail = {
      scannedBarcodes
    };
    const scanEvent = new CustomEvent('scan', {
      cancelable: true,
      detail
    });
    this.dispatchEvent(scanEvent);
  }
  dispatchError(error) {
    if (features.enableAssertContextForBarcodeScanner) {
      assertContext(this);
    }
    const detail = {
      error
    };
    const errorEvent = new CustomEvent('errors', {
      cancelable: true,
      detail
    });
    this.dispatchEvent(errorEvent);
  }
  get computedSize() {
    return this.normalizedSize();
  }
  get computedEnabledTitle() {
    return this.enabledAlternativeText || '';
  }
  get computedDisabledTitle() {
    return this.disabledAlternativeText || '';
  }
  get enabledIconSrcAvailable() {
    return this.enabledIconSrc !== '';
  }
  get disabledIconSrcAvailable() {
    return this.disabledIconSrc !== '';
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(BarcodeScanner, {
  publicProps: {
    scannerOptions: {
      config: 0
    },
    enableContinuousScan: {
      config: 0
    },
    enabledIconSrc: {
      config: 0
    },
    disabledIconSrc: {
      config: 0
    },
    iconSize: {
      config: 0
    },
    enabledAlternativeText: {
      config: 0
    },
    disabledAlternativeText: {
      config: 0
    },
    disabled: {
      config: 0
    }
  },
  track: {
    _sessionScanner: 1
  },
  fields: ["_scannerAvailable", "_scannedBarcodes", "_error", "_hasErrors", "_userDismissedErrorCode"]
});
const __lwc_component_class_internal = _registerComponent(BarcodeScanner, {
  tmpl: _tmpl,
  sel: "lightning-barcode-scanner",
  apiVersion: 66
});
export default __lwc_component_class_internal;