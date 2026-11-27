import { registerDecorators as _registerDecorators } from "lwc";
import _tmpl from "./dynamicIcon.html";
/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
import { registerComponent as _registerComponent } from 'lwc';
import LightningShadowBaseClass from 'lightning/shadowBaseClassPrivate';
import { classSet } from 'lightning/utils';
import { normalizeString as normalize } from 'lightning/utilsPrivate';
import eqHtml from './eq.html';
import ellieHtml from './ellie.html';
import scoreHtml from './score.html';
import strengthHtml from './strength.html';
import trendHtml from './trend.html';
import waffleHtml from './waffle.html';
import defaultHtml from './default.html';
class LightningDynamicIcon extends LightningShadowBaseClass {
  constructor(...args) {
    super(...args);
    this.alternativeText = void 0;
    this.type = void 0;
    this.option = void 0;
  }
  render() {
    const {
      normalizedType
    } = this;
    switch (normalizedType) {
      case 'ellie':
        return ellieHtml;
      case 'eq':
        return eqHtml;
      case 'score':
        return scoreHtml;
      case 'strength':
        return strengthHtml;
      case 'trend':
        return trendHtml;
      case 'waffle':
        return waffleHtml;
      default:
        return defaultHtml;
    }
  }
  get normalizedType() {
    return normalize(this.type, {
      fallbackValue: '',
      validValues: ['ellie', 'eq', 'score', 'strength', 'trend', 'waffle']
    });
  }
  get normalizedOption() {
    const {
      normalizedType
    } = this;
    switch (normalizedType) {
      case 'eq':
        return normalize(this.option, {
          fallbackValue: 'play',
          validValues: ['play', 'stop']
        });
      case 'score':
        return normalize(this.option, {
          fallbackValue: 'positive',
          validValues: ['positive', 'negative']
        });
      case 'strength':
        return normalize(this.option, {
          fallbackValue: '0',
          validValues: ['-3', '-2', '-1', '0', '1', '2', '3']
        });
      case 'trend':
        return normalize(this.option, {
          fallbackValue: 'neutral',
          validValues: ['up', 'down', 'neutral']
        });
      default:
        return '';
    }
  }
  get computedEqClass() {
    const {
      normalizedOption
    } = this;
    const classes = classSet('slds-icon-eq');
    if (normalizedOption === 'play') {
      classes.add('slds-is-animated');
    }
    return classes.toString();
  }
  /*LWC compiler v9.5.3*/
}
_registerDecorators(LightningDynamicIcon, {
  publicProps: {
    alternativeText: {
      config: 0
    },
    type: {
      config: 0
    },
    option: {
      config: 0
    }
  }
});
const __lwc_component_class_internal = _registerComponent(LightningDynamicIcon, {
  tmpl: _tmpl,
  sel: "lightning-dynamic-icon",
  apiVersion: 66
});
export default __lwc_component_class_internal;