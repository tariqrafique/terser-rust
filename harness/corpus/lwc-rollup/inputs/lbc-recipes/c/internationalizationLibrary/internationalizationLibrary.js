import numberFormat$1 from '@salesforce/i18n/number.numberFormat';
import percentFormat from '@salesforce/i18n/number.percentFormat';
import currencyFormat from '@salesforce/i18n/number.currencyFormat';
import currency from '@salesforce/i18n/currency';
import locale from '@salesforce/i18n/locale';
import { getLocalizationService } from 'lightning/configProvider';
import salesforceLanguage from '@salesforce/i18n/lang';
import mediumDateFormat from '@salesforce/i18n/dateTime.mediumDateFormat';
import mediumTimeFormat from '@salesforce/i18n/dateTime.mediumTimeFormat';

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/* eslint-disable */
var data$1 = {
  AE: {
    fmt: '%A%n%S%n%K',
    require: 'AS',
    input: 'ASK'
  },
  AL: {
    fmt: '%A%n%Z%n%C%n%K',
    require: 'AZC',
    input: 'AZCK'
  },
  EC: {
    _ref: 'AL'
  },
  MU: {
    _ref: 'AL'
  },
  OM: {
    _ref: 'AL'
  },
  AM: {
    fmt: '%A%n%Z%n%C%n%S%n%K',
    require: 'AZCS',
    input: 'AZK'
  },
  AR: {
    fmt: '%A%n%Z %C%n%S%n%K',
    require: 'AZCS',
    input: 'AZCSK'
  },
  CL: {
    _ref: 'AR'
  },
  CV: {
    _ref: 'AR'
  },
  MY: {
    _ref: 'AR'
  },
  UZ: {
    _ref: 'AR'
  },
  AT: {
    fmt: '%A%n%Z %C%n%K',
    require: 'AZC',
    input: 'AZCK'
  },
  BA: {
    _ref: 'AT'
  },
  BG: {
    _ref: 'AT'
  },
  CH: {
    _ref: 'AT'
  },
  DE: {
    _ref: 'AT'
  },
  DK: {
    _ref: 'AT'
  },
  DO: {
    _ref: 'AT'
  },
  DZ: {
    _ref: 'AT'
  },
  EE: {
    _ref: 'AT'
  },
  ET: {
    _ref: 'AT'
  },
  FR: {
    _ref: 'AT'
  },
  GE: {
    _ref: 'AT'
  },
  GR: {
    _ref: 'AT'
  },
  IL: {
    _ref: 'AT'
  },
  KW: {
    _ref: 'AT'
  },
  LA: {
    _ref: 'AT'
  },
  LR: {
    _ref: 'AT'
  },
  IS: {
    _ref: 'AT'
  },
  MA: {
    _ref: 'AT'
  },
  MG: {
    _ref: 'AT'
  },
  MK: {
    _ref: 'AT'
  },
  MZ: {
    _ref: 'AT'
  },
  NL: {
    _ref: 'AT'
  },
  NO: {
    _ref: 'AT'
  },
  PL: {
    _ref: 'AT'
  },
  PT: {
    _ref: 'AT'
  },
  PY: {
    _ref: 'AT'
  },
  RO: {
    _ref: 'AT'
  },
  RS: {
    _ref: 'AT'
  },
  SK: {
    _ref: 'AT'
  },
  TJ: {
    _ref: 'AT'
  },
  TN: {
    _ref: 'AT'
  },
  TZ: {
    _ref: 'AT'
  },
  WF: {
    _ref: 'AT'
  },
  AU: {
    fmt: '%A%n%C %S %Z%n%K',
    require: 'ACSZ',
    input: 'ACSZK'
  },
  CA: {
    _ref: 'AU'
  },
  AZ: {
    fmt: '%A%n%Z %C%n%K',
    require: 'AZC',
    input: 'AZCK'
  },
  AF: {
    fmt: '%A%n%C%n%Z%n%K',
    require: 'ACZ',
    input: 'ACZK'
  },
  FK: {
    _ref: 'AF'
  },
  GB: {
    fmt: '%A%n%C%n%S%n%Z%n%K',
    require: 'ACZ',
    input: 'ACSZK'
  },
  KE: {
    _ref: 'AF'
  },
  LK: {
    _ref: 'AF'
  },
  ZA: {
    _ref: 'AF'
  },
  SH: {
    _ref: 'AF'
  },
  SZ: {
    _ref: 'AF'
  },
  US: {
    fmt: '%A%n%C, %S %Z%n%K',
    require: 'ACSZ',
    input: 'ACSZK'
  },
  BB: {
    _ref: 'US'
  },
  BS: {
    _ref: 'US'
  },
  SO: {
    _ref: 'US'
  },
  ES: {
    fmt: '%A%n%Z %C %S%n%K',
    require: 'AZCS',
    input: 'AZCSK'
  },
  IT: {
    _ref: 'ES'
  },
  UY: {
    _ref: 'ES'
  },
  ID: {
    fmt: '%A%n%C%n%S %Z%n%K',
    require: 'ACSZ',
    input: 'ACSZK'
  },
  IE: {
    _ref: 'ID'
  },
  TH: {
    _ref: 'ID'
  },
  VN: {
    _ref: 'ID'
  },
  HU: {
    fmt: '%C%n%A%n%Z%n%K',
    require: 'CAZ',
    input: 'CAZK'
  },
  BH: {
    fmt: '%A%n%C %Z%n%K',
    require: 'ACZ',
    input: 'ACZK'
  },
  BM: {
    _ref: 'BH'
  },
  BN: {
    _ref: 'BH'
  },
  BT: {
    _ref: 'BH'
  },
  KH: {
    _ref: 'BH'
  },
  LB: {
    _ref: 'BH'
  },
  JO: {
    _ref: 'BH'
  },
  MT: {
    _ref: 'BH'
  },
  NP: {
    _ref: 'BH'
  },
  NZ: {
    _ref: 'BH'
  },
  SA: {
    _ref: 'BH'
  },
  BD: {
    fmt: '%A%n%C - %Z%n%K',
    require: 'ACZ',
    input: 'ACZK'
  },
  BR: {
    fmt: '%A%n%C-%S%n%Z%n%K',
    require: 'ACSZ',
    input: 'ACSZK'
  },
  CN: {
    fmt: '%K%n%S %C%n%A%n%Z',
    require: 'CAZ',
    input: 'KSCAZ'
  },
  HK: {
    fmt: '%K%S%C%n%A%n%Z',
    require: 'CA',
    input: 'KSCAZ'
  },
  CO: {
    fmt: '%A%n%C, %S, %Z%n%K',
    require: 'ACSZ',
    input: 'ACSZK'
  },
  CR: {
    fmt: '%A%n%S, %C%n%Z%n%K',
    require: 'ACSZ',
    input: 'ASCZK'
  },
  EG: {
    fmt: '%A%n%C%n%S%n%Z%n%K',
    require: 'ACSZ',
    input: 'ACSZK'
  },
  RU: {
    _ref: 'EG'
  },
  UA: {
    _ref: 'EG'
  },
  FI: {
    fmt: '%A%n%Z %C%n%K',
    require: 'AZC',
    input: 'AZCK'
  },
  GT: {
    fmt: '%A%n%Z-%C%n%K',
    require: 'AZC',
    input: 'AZCK'
  },
  HN: {
    fmt: '%A%n%C, %S%n%Z%n%K',
    require: 'ACSZ',
    input: 'ACSZK'
  },
  IQ: {
    _ref: 'HN'
  },
  HR: {
    fmt: '%A%n%Z %C%n%K',
    require: 'AZC',
    input: 'AZCK'
  },
  HT: {
    fmt: '%A%n%Z %C%n%K',
    require: 'AZC',
    input: 'AZCK'
  },
  IN: {
    fmt: '%A%n%C %Z%n%S%n%K',
    require: 'ACZS',
    input: 'ACZSK'
  },
  NG: {
    _ref: 'IN'
  },
  PE: {
    _ref: 'IN'
  },
  IR: {
    fmt: '%S%n%C%n%A%n%Z%n%K',
    require: 'SCAZ',
    input: 'SCAZK'
  },
  JM: {
    fmt: '%A%n%C%n%S%n%K',
    require: 'ACS',
    input: 'ACSK'
  },
  PA: {
    _ref: 'JM'
  },
  SC: {
    _ref: 'JM'
  },
  SR: {
    _ref: 'JM'
  },
  JP: {
    fmt: '%K%n' + String.fromCharCode(12306) + '%Z%n%S %C%n%A',
    require: 'ZCA',
    input: 'KZSCA'
  },
  EN_JP: {
    fmt: '%A%n%C %S%n%Z %K',
    require: 'ACSZ',
    input: 'ACSZK'
  },
  KG: {
    fmt: '%Z %C%n%A%n%S%n%K',
    require: 'ZCA',
    input: 'ZCAK'
  },
  KR: {
    fmt: '%S %C%n%A%n%Z%n%K',
    require: 'SCAZ',
    input: 'SCAZK'
  },
  KY: {
    fmt: '%A%n%S %Z%n%K',
    require: 'ASZ',
    input: 'ASZK'
  },
  KZ: {
    fmt: '%Z%n%S%n%C%n%A%n%K',
    require: 'ZSCA',
    input: 'ZSCAK'
  },
  LT: {
    fmt: '%A%n%Z %C%n%K',
    require: 'AZC',
    input: 'AZCK'
  },
  LV: {
    fmt: '%A%n%C, %Z%n%K',
    require: 'ACZ',
    input: 'ACZK'
  },
  MM: {
    _ref: 'LV'
  },
  MC: {
    fmt: '%A%n%Z %C%n%K',
    require: 'AZC',
    input: 'AZCK'
  },
  MD: {
    fmt: '%A%n%Z %C%n%K',
    require: 'AZC',
    input: 'AZCK'
  },
  MW: {
    fmt: '%A%n%C%n%K',
    require: 'AC',
    input: 'ACK'
  },
  MX: {
    fmt: '%A%n%Z %C, %S%n%K',
    require: 'AZCS',
    input: 'AZCSK'
  },
  NI: {
    fmt: '%A%n%Z%n%C, %S%n%K',
    require: 'AZCS',
    input: 'AZCSK'
  },
  PG: {
    fmt: '%A%n%C %Z %S%n%K',
    require: 'ACZS',
    input: 'ACZSK'
  },
  PH: {
    fmt: '%A, %C%n%Z %S%n%K',
    require: 'ACZS',
    input: 'ACZSK'
  },
  PK: {
    fmt: '%A%n%C-%Z%n%K',
    require: 'ACZ',
    input: 'ACZK'
  },
  PR: {
    fmt: '%A%n%C %Z%n%K',
    require: 'ACZ',
    input: 'ACZK'
  },
  SE: {
    fmt: '%A%n%Z %C%n%K',
    require: 'AZC',
    input: 'AZCK'
  },
  SG: {
    fmt: '%A%n%C %Z%n%S%n%K',
    require: 'AZ',
    input: 'AZK'
  },
  SI: {
    fmt: '%A%n%Z %C%n%K',
    require: 'AZC',
    input: 'AZCK'
  },
  SV: {
    fmt: '%A%n%Z-%C%n%S%n%K',
    require: 'AZCS',
    input: 'AZCSK'
  },
  TR: {
    fmt: '%A%n%Z %C/%S%n%K',
    require: 'AZC',
    input: 'AZCK'
  },
  TW: {
    fmt: '%K%n%Z%n%S %C%n%A',
    require: 'ZSCA',
    input: 'KZSCA'
  },
  VE: {
    fmt: '%A%n%C %Z, %S%n%K',
    require: 'ACZS',
    input: 'ACZSK'
  }
};
var languageCodeToCountry = {
  languageCode: {
    ar: 'AE',
    af: 'ZA',
    bg: 'BG',
    bn: 'BN',
    bs: 'BA',
    ca: 'ES',
    cs: 'CZ',
    cy: 'GB',
    da: 'DK',
    de: 'DE',
    el: 'GR',
    es: 'ES',
    et: 'ET',
    eu: 'ES',
    fi: 'FI',
    fr: 'FR',
    ga: 'IE',
    gu: 'IN',
    hi: 'IN',
    hr: 'HR',
    hu: 'HU',
    hy: 'HY',
    in: 'ID',
    is: 'IS',
    it: 'IT',
    iw: 'IL',
    ja: 'JP',
    ka: 'GE',
    kn: 'IN',
    ko: 'KR',
    lb: 'LU',
    lt: 'IT',
    lv: 'LV',
    mk: 'MK',
    ml: 'IN',
    mr: 'IN',
    ms: 'MY',
    mt: 'MT',
    nl: 'NL',
    no: 'NO',
    pl: 'PL',
    pt: 'PT',
    rm: 'DE',
    ro: 'RO',
    ru: 'RU',
    sh: 'BA',
    sk: 'SK',
    sl: 'SL',
    sq: 'SQ',
    sr: 'RS',
    sv: 'SE',
    sw: 'ZA',
    ta: 'IN',
    te: 'IN',
    th: 'TH',
    tl: 'PH',
    tr: 'TR',
    uk: 'UK',
    ur: 'IN',
    vi: 'VN',
    xh: 'ZA',
    zh: 'CN',
    zu: 'ZA'
  }
};
var AddressFormatPattern = Object.freeze({
  A: Symbol('Address Lines'),
  C: Symbol('City'),
  S: Symbol('State'),
  K: Symbol('Country'),
  Z: Symbol('Zip Code'),
  n: Symbol('New Line'),
  fromPlaceHolder: function fromPlaceHolder(placeHolder) {
    switch (placeHolder) {
      case 'A':
        return AddressFormatPattern.A;
      case 'C':
        return AddressFormatPattern.C;
      case 'S':
        return AddressFormatPattern.S;
      case 'K':
        return AddressFormatPattern.K;
      case 'Z':
        return AddressFormatPattern.Z;
      case 'n':
        return AddressFormatPattern.n;
    }
    return null;
  },
  getPlaceHolder: function getPlaceHolder(pattern) {
    switch (pattern) {
      case AddressFormatPattern.A:
        return 'A';
      case AddressFormatPattern.C:
        return 'C';
      case AddressFormatPattern.S:
        return 'S';
      case AddressFormatPattern.K:
        return 'K';
      case AddressFormatPattern.Z:
        return 'Z';
      case AddressFormatPattern.n:
        return 'n';
    }
    return null;
  },
  getData: function getData(pattern, data) {
    if (data) {
      switch (pattern) {
        case AddressFormatPattern.A:
          return data.address;
        case AddressFormatPattern.C:
          return data.city;
        case AddressFormatPattern.S:
          return data.state;
        case AddressFormatPattern.K:
          return data.country;
        case AddressFormatPattern.Z:
          return data.zipCode;
        case AddressFormatPattern.n:
          return data.newLine;
      }
    }
    return null;
  }
});
var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
};
var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
var AddressTokenTypes = Object.freeze({
  DATA: Symbol('data'),
  STRING: Symbol('string'),
  NEWLINE: Symbol('newline'),
  GROUP: Symbol('group')
});
var AddressToken = function () {
  function AddressToken(type, string, pattern) {
    classCallCheck(this, AddressToken);
    this.type = type;
    this.string = string;
    this.pattern = pattern;
  }
  createClass(AddressToken, null, [{
    key: 'string',
    value: function string(_string) {
      return new AddressToken(AddressTokenTypes.STRING, _string);
    }
  }, {
    key: 'data',
    value: function data(pattern) {
      return new AddressToken(AddressTokenTypes.DATA, undefined, pattern);
    }
  }, {
    key: 'newLine',
    value: function newLine() {
      return new AddressToken(AddressTokenTypes.NEWLINE);
    }
  }]);
  return AddressToken;
}();
var TokenizerState = function TokenizerState(pattern, start) {
  classCallCheck(this, TokenizerState);
  this.pattern = pattern;
  this.start = start;
};
function tokenize(state, tokens) {
  var nextIndex = state.start;
  if (state.pattern) {
    var len = state.pattern.length;
    while (state.start < len) {
      nextIndex = state.pattern.indexOf('%', nextIndex);
      if (nextIndex >= 0 && nextIndex + 1 < len) {
        var placeHolder = state.pattern.substring(nextIndex + 1, nextIndex + 2);
        switch (placeHolder) {
          case 'n':
            {
              if (nextIndex - state.start > 0) {
                tokens.push(AddressToken.string(state.pattern.substring(state.start, nextIndex)));
              }
              tokens.push(AddressToken.newLine());
              state.start = nextIndex + 2;
              nextIndex = state.start;
              break;
            }
          default:
            {
              var p = AddressFormatPattern.fromPlaceHolder(placeHolder);
              if (p) {
                if (nextIndex - state.start > 0) {
                  tokens.push(AddressToken.string(state.pattern.substring(state.start, nextIndex)));
                }
                tokens.push(AddressToken.data(p));
                state.start = nextIndex + 2;
                nextIndex = state.start;
              } else {
                state.start = nextIndex + 2;
                nextIndex = state.start;
              }
              break;
            }
        }
      } else {
        if (state.start < len) {
          tokens.push(AddressToken.string(state.pattern.substring(state.start)));
        }
        state.start = len;
      }
    }
  }
  return state;
}
function formatLineTokens(tokens, data, ignoreEmptyLines, firstIndex, lastIndex) {
  var parts = [];
  for (var index = firstIndex; index <= lastIndex; index++) {
    var token = tokens[index];
    if (!token) {
      continue;
    } else if (token.type == AddressTokenTypes.DATA) {
      var dataBuffer = '';
      var lastDataIndex = index;
      for (var dataIndex = index; dataIndex <= lastIndex; dataIndex++) {
        var dataToken = tokens[dataIndex];
        if (!dataToken || dataToken.type != AddressTokenTypes.DATA) {
          break;
        }
        var fieldData = AddressFormatPattern.getData(dataToken.pattern, data);
        if (fieldData) {
          dataBuffer += fieldData;
          lastDataIndex = dataIndex;
        }
      }
      var hasData = dataBuffer && dataBuffer.length > 0;
      var hasPreviousData = false;
      if (index - 1 >= firstIndex) {
        var stringToken = tokens[index - 1];
        if (stringToken && stringToken.type == AddressTokenTypes.STRING && stringToken.string) {
          for (var prevIndex = index - 2; prevIndex >= firstIndex; prevIndex--) {
            var prevToken = tokens[prevIndex];
            if (prevToken && prevToken.type == AddressTokenTypes.DATA) {
              var _fieldData = AddressFormatPattern.getData(prevToken.pattern, data);
              if (_fieldData) {
                hasPreviousData = true;
                break;
              }
            } else if (prevToken && prevToken.type == AddressTokenTypes.STRING) {
              stringToken = prevToken;
            }
          }
          if (!ignoreEmptyLines || hasPreviousData && hasData || index - 1 == firstIndex && hasData) {
            parts.push(stringToken.string);
          }
        }
      }
      if (hasData) {
        parts.push(dataBuffer);
      }
      index = lastDataIndex;
      if (index + 1 == lastIndex) {
        var _stringToken = tokens[index + 1];
        if (_stringToken && _stringToken.type == AddressTokenTypes.STRING && _stringToken.string) {
          if (!ignoreEmptyLines || hasData || hasPreviousData) {
            parts.push(_stringToken.string);
          }
        }
        index = index + 1;
      }
    } else ;
  }
  return parts.join('').trim();
}
function formatTokens(tokens, data, lineBreak, ignoreEmptyLines) {
  var lines = [];
  var lineIndex = -1;
  for (var index = 0; index < tokens.length; index++) {
    var doFormat = false;
    var endWithNewLine = false;
    var token = tokens[index];
    switch (token.type) {
      case AddressTokenTypes.NEWLINE:
        {
          if (lineIndex >= 0) {
            doFormat = true;
            endWithNewLine = true;
          } else if (!ignoreEmptyLines) {
            lines.push('');
            if (index + 1 == tokens.length) {
              lines.push('');
            }
          }
          break;
        }
      default:
        {
          lineIndex = lineIndex < 0 ? index : lineIndex;
          doFormat = index + 1 == tokens.length ? true : doFormat;
          break;
        }
    }
    if (doFormat) {
      var line = formatLineTokens(tokens, data, ignoreEmptyLines, lineIndex, endWithNewLine ? index - 1 : index);
      if (!ignoreEmptyLines || line) {
        lines.push(line);
      }
      if (!ignoreEmptyLines && endWithNewLine && index + 1 == tokens.length) {
        lines.push('');
      }
      lineIndex = -1;
    }
  }
  return lines.join(lineBreak);
}
function format$1(data, pattern, lineBreak, ignoreEmptyLines) {
  ignoreEmptyLines = ignoreEmptyLines === false ? false : true;
  lineBreak = lineBreak || '\n';
  var tokens = [];
  tokenize(new TokenizerState(pattern, 0), tokens);
  return formatTokens(tokens, data, lineBreak, ignoreEmptyLines);
}
var addressFormatter = {
  format: format$1
};
var CJK_COUNTRIES = ['CN', 'HK', 'TW', 'JP', 'KR', 'KP'];
var CJK_LANGUAGES = ['zh', 'ja', 'ko'];
var address = {
  getAddressInfoForCountry: function getAddressInfoForCountry(langCode, countryCode) {
    var code = this.getCountryFromLocale(langCode, countryCode);
    if (data$1[code]) {
      var cloneAddressRep = Object.freeze(Object.assign({}, data$1[code]));
      return Object.freeze({
        address: cloneAddressRep
      });
    }
    return {};
  },
  getAddressFormat: function getAddressFormat(langCode, countryCode) {
    var code = this.getCountryFromLocale(langCode, countryCode);
    if (data$1[code]) {
      return data$1[code].fmt;
    }
    return '';
  },
  getAddressInputOrder: function getAddressInputOrder(langCode, countryCode) {
    if (langCode && langCode.toLowerCase() == 'en' && countryCode && countryCode.toUpperCase() == 'HK') {
      langCode = 'en';
      countryCode = 'US';
    }
    var code = this.getCountryFromLocale(langCode, countryCode);
    if (data$1[code]) {
      return data$1[code].input;
    }
    return '';
  },
  getAddressInputOrderAllField: function getAddressInputOrderAllField(langCode, countryCode) {
    if (langCode && langCode.toLowerCase() == 'en' && countryCode && countryCode.toUpperCase() == 'HK') {
      langCode = 'en';
      countryCode = 'US';
    }
    var code = this.getCountryFromLocale(langCode, countryCode);
    if (data$1[code]) {
      var input = data$1[code].input;
      if (input.indexOf('S') === -1) {
        input = input.replace('K', 'SK');
      }
      if (input.indexOf('C') === -1) {
        input = input.replace('S', 'CS');
      }
      if (input.indexOf('Z') === -1) {
        input = input.replace('C', 'ZC');
      }
      return input;
    }
    return '';
  },
  getAddressRequireFields: function getAddressRequireFields(langCode, countryCode) {
    var code = this.getCountryFromLocale(langCode, countryCode);
    if (data$1[code]) {
      return data$1[code].require;
    }
    return '';
  },
  formatAddressAllFields: function formatAddressAllFields(langCode, countryCode, values, lineBreak) {
    var code = this.getCountryFromLocale(langCode, countryCode, values);
    if (data$1[code]) {
      var pattern = data$1[code].fmt;
      if (values.zipCode && pattern.indexOf('%Z') === -1) {
        pattern = pattern.replace('%K', '%Z %K');
      }
      if (values.city && pattern.indexOf('%C') === -1) {
        pattern = pattern.replace('%K', '%C %K');
      }
      if (values.state && pattern.indexOf('%S') === -1) {
        pattern = pattern.replace('%K', '%S %K');
      }
      return this.buildAddressLines(pattern, values, lineBreak, true);
    }
    return '';
  },
  formatAddress: function formatAddress(langCode, countryCode, values, lineBreak) {
    var code = this.getCountryFromLocale(langCode, countryCode, values);
    if (data$1[code]) {
      return this.buildAddressLines(data$1[code].fmt, values, lineBreak, true);
    }
    return '';
  },
  buildAddressLines: function buildAddressLines(pattern, values, lineBreak, ignoreEmptyLines) {
    return addressFormatter.format(values, pattern, lineBreak, ignoreEmptyLines);
  },
  followReferences: function followReferences(data$$1, countryCode) {
    if (data$$1[countryCode] && data$$1[countryCode]._ref) {
      return this.followReferences(data$$1, data$$1[countryCode]._ref);
    }
    return countryCode;
  },
  containsHanScript: function containsHanScript() {
    for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
      values[_key] = arguments[_key];
    }
    if (!values || !Array.isArray(values)) return false;
    return values.some(function (value) {
      if (!value) return false;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;
      try {
        for (var _iterator = value[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var singleChar = _step.value;
          var codePoint = singleChar.codePointAt(0);
          if (0x2e80 <= codePoint && codePoint <= 0x2eff || 0x3300 <= codePoint && codePoint <= 0x33ff || 0xfe30 <= codePoint && codePoint <= 0xfe4f || 0xf900 <= codePoint && codePoint <= 0xfaff || 0x2f800 <= codePoint && codePoint <= 0x2fa1f || 0x3000 <= codePoint && codePoint <= 0x303f || 0x4e00 <= codePoint && codePoint <= 0x9fff || 0x3400 <= codePoint && codePoint <= 0x4dbf || 0x20000 <= codePoint && codePoint <= 0x2a6df || 0x2a700 <= codePoint && codePoint <= 0x2b73f || 0x2b740 <= codePoint && codePoint <= 0x2b81f || 0x2b820 <= codePoint && codePoint <= 0x2ceaf || 0x2ceb0 <= codePoint && codePoint <= 0x2ebef || 0x3200 <= codePoint && codePoint <= 0x32ff || 0x31c0 <= codePoint && codePoint <= 0x31ef || 0x3100 <= codePoint && codePoint <= 0x312f || 0x31a0 <= codePoint && codePoint <= 0x31bf || 0x2f00 <= codePoint && codePoint <= 0x2fdf || 0x2ff0 <= codePoint && codePoint <= 0x2fff || 0xff00 <= codePoint && codePoint <= 0xffef || 0x3040 <= codePoint && codePoint <= 0x309f || 0x30a0 <= codePoint && codePoint <= 0x30ff || 0x31f0 <= codePoint && codePoint <= 0x31ff || 0x1b000 <= codePoint && codePoint <= 0x1b0ff || 0x1b100 <= codePoint && codePoint <= 0x1b12f || 0x1100 <= codePoint && codePoint <= 0x11ff || 0xac00 <= codePoint && codePoint <= 0xd7af || 0x3130 <= codePoint && codePoint <= 0x318f || 0xa960 <= codePoint && codePoint <= 0xa97f || 0xd7b0 <= codePoint && codePoint <= 0xd7ff) {
            return true;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
      return false;
    });
  },
  getCountryFromLocale: function getCountryFromLocale(langCode, countryCode, values) {
    if (values) {
      var isCJK = !countryCode && CJK_LANGUAGES.indexOf(langCode.toLowerCase()) >= 0 || countryCode && CJK_COUNTRIES.indexOf(countryCode.toUpperCase()) >= 0;
      var isJA = !countryCode && 'ja' == langCode.toLowerCase() || countryCode && 'JP' == countryCode.toUpperCase();
      if (!(isJA && this.containsHanScript(values.address, values.city, values.state, values.country)) && isCJK && !this.containsHanScript(values.address)) {
        return this.getCountryFromLocale(langCode, 'EN_' + countryCode);
      }
    }
    var country = countryCode;
    if (!countryCode && languageCodeToCountry.languageCode[langCode]) {
      country = languageCodeToCountry.languageCode[langCode];
    }
    country = this.followReferences(data$1, country);
    if (!country || !data$1[country]) {
      return 'US';
    }
    return country;
  },
  getFallback: function getFallback(langCode, countryCode, address) {
    return this.getCountryFromLocale(langCode, countryCode);
  }
};

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

/* eslint-disable */
var data = {
  DEFAULT: {
    short_f: '%F %L',
    medium_f: '%F %M %L',
    long_f: '%S %F %M %L %X %I',
    input: 'SFMLXI'
  },
  vi: {
    short_f: '%L %F',
    medium_f: '%L %M %F',
    long_f: '%L %M %F %X %I',
    input: 'SLFMXI'
  },
  vi_VN: {
    _ref: 'vi'
  },
  hu: {
    short_f: '%L %F',
    medium_f: '%L %F',
    long_f: '%L %F %M %X %I',
    input: 'SLFMXI'
  },
  hu_HU: {
    _ref: 'hu'
  },
  ja: {
    short_f: '%L %F',
    medium_f: '%L %M %F',
    long_f: '%L %M %F %X %I',
    input: 'SLMFXI'
  },
  ja_JP: {
    _ref: 'ja'
  },
  ko: {
    _ref: 'ja'
  },
  ko_KR: {
    _ref: 'ja'
  },
  zh: {
    _ref: 'ja'
  },
  zh_CN: {
    _ref: 'ja'
  },
  zh_CN_PINYIN: {
    _ref: 'ja'
  },
  zh_CN_STROKE: {
    _ref: 'ja'
  },
  zh_HK: {
    _ref: 'ja'
  },
  zh_HK_STROKE: {
    _ref: 'ja'
  },
  zh_MO: {
    _ref: 'ja'
  },
  zh_SG: {
    _ref: 'ja'
  },
  zh_TW: {
    _ref: 'ja'
  },
  zh_TW_STROKE: {
    _ref: 'ja'
  }
};
var fieldConstants = {
  SALUTATION: Symbol('Salutation'),
  FIRST: Symbol('First Name'),
  MIDDLE: Symbol('Middle Name'),
  LAST: Symbol('Last Name'),
  SUFFIX: Symbol('Suffix'),
  INFORMAL: Symbol('Informal Name')
};
var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}
var Format = function Format(parts) {
  _classCallCheck(this, Format);
  this.parts = Object.freeze(parts);
  Object.freeze(this);
};
var FieldFormatPart = function FieldFormatPart(field) {
  _classCallCheck(this, FieldFormatPart);
  this.field = field;
  this.type = 'field';
  Object.freeze(this);
};
var TextFormatPart = function TextFormatPart(text) {
  _classCallCheck(this, TextFormatPart);
  this.type = 'text';
  this.text = text;
  Object.freeze(this);
};
var fieldFormatParts = Object.freeze({
  SALUTATION: new FieldFormatPart(fieldConstants.SALUTATION),
  FIRST: new FieldFormatPart(fieldConstants.FIRST),
  MIDDLE: new FieldFormatPart(fieldConstants.MIDDLE),
  LAST: new FieldFormatPart(fieldConstants.LAST),
  SUFFIX: new FieldFormatPart(fieldConstants.SUFFIX),
  INFORMAL: new FieldFormatPart(fieldConstants.INFORMAL)
});
var FormatParser = function () {
  function FormatParser() {
    _classCallCheck(this, FormatParser);
  }
  _createClass(FormatParser, [{
    key: 'parse',
    value: function parse(fmt) {
      var nodes = [];
      var textBuffer = '';
      for (var i = 0; i < fmt.length; i = i + 1) {
        if (fmt[i] === '%') {
          i = i + 1;
          if (textBuffer.length > 0) {
            nodes.push(Object.freeze(new TextFormatPart(textBuffer)));
            textBuffer = '';
          }
          if (i >= fmt.length) {
            throw new Error('Unexpected end of format. Symbol at ' + (i - 1) + ' should be followed by a valid field code');
          }
          var code = fmt[i];
          switch (code) {
            case 'S':
              nodes.push(fieldFormatParts.SALUTATION);
              break;
            case 'F':
              nodes.push(fieldFormatParts.FIRST);
              break;
            case 'M':
              nodes.push(fieldFormatParts.MIDDLE);
              break;
            case 'L':
              nodes.push(fieldFormatParts.LAST);
              break;
            case 'X':
              nodes.push(fieldFormatParts.SUFFIX);
              break;
            case 'I':
              nodes.push(fieldFormatParts.INFORMAL);
              break;
          }
        } else {
          textBuffer += fmt[i];
        }
      }
      if (textBuffer.length > 0) {
        nodes.push(new TextFormatPart(textBuffer));
      }
      return new Format(nodes);
    }
  }]);
  return FormatParser;
}();
var formatParser = new FormatParser();
var name = {
  getNameInfoForLocale: function getNameInfoForLocale(localeStr) {
    var key = this.getFallback(localeStr);
    if (data[key]) {
      var cloneNameInfo = Object.freeze(Object.assign({}, data[key]));
      return Object.freeze({
        name: cloneNameInfo
      });
    }
  },
  getNameFormatPatternMedium: function getNameFormatPatternMedium(localeStr) {
    var key = this.getFallback(localeStr);
    if (data[key]) {
      return data[key].medium_f;
    }
  },
  getNameFormatPatternShort: function getNameFormatPatternShort(localeStr) {
    var key = this.getFallback(localeStr);
    if (data[key]) {
      return data[key].short_f;
    }
  },
  getNameFormatPatternLong: function getNameFormatPatternLong(localeStr) {
    var key = this.getFallback(localeStr);
    if (data[key]) {
      return data[key].long_f;
    }
  },
  getNameInputOrder: function getNameInputOrder(localeStr) {
    var key = this.getFallback(localeStr);
    if (data[key]) {
      return data[key].input;
    }
  },
  formatNameShort: function formatNameShort(localeStr, values) {
    var key = this.getFallback(localeStr);
    if (data[key]) {
      return this.buildName(data[key].short_f, values);
    }
  },
  formatNameMedium: function formatNameMedium(localeStr, values) {
    var key = this.getFallback(localeStr);
    if (data[key]) {
      return this.buildName(data[key].medium_f, values);
    }
  },
  formatNameLong: function formatNameLong(localeStr, values) {
    var key = this.getFallback(localeStr);
    if (data[key]) {
      return this.buildName(data[key].long_f, values);
    }
  },
  buildName: function buildName(pattern, values) {
    var format = formatParser.parse(pattern);
    var sb = [];
    for (var i = 0; i < format.parts.length; i++) {
      var part = format.parts[i];
      if (part.type === 'text') {
        sb.push(part.text);
      } else if (part.type === 'field') {
        if (part.field === fieldConstants.SALUTATION) {
          sb.push(values.salutation || '');
        } else if (part.field === fieldConstants.FIRST) {
          sb.push(values.first || '');
        } else if (part.field === fieldConstants.MIDDLE) {
          sb.push(values.middle || '');
        } else if (part.field === fieldConstants.LAST) {
          sb.push(values.last || '');
        } else if (part.field === fieldConstants.SUFFIX) {
          sb.push(values.suffix || '');
        } else if (part.field === fieldConstants.INFORMAL) {
          sb.push(values.informal || '');
        } else ;
      }
    }
    return sb.join('').trim().replace(/  /g, ' ');
  },
  followReferences: function followReferences(key) {
    if (data[key] && data[key]._ref) {
      return this.followReferences(data[key]._ref);
    }
    return key;
  },
  getFallback: function getFallback(localeStr) {
    var key = this.followReferences(localeStr);
    if (!data[key]) {
      return 'DEFAULT';
    }
    return key;
  }
};

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const POSSIBLE_OPTS$1 = {
  style: true,
  currency: true,
  currencyDisplay: true,
  useGrouping: true,
  minimumIntegerDigits: true,
  minimumFractionDigits: true,
  maximumFractionDigits: true,
  minimumSignificantDigits: true,
  maximumSignificantDigits: true
};
const STYLE = {
  CURRENCY: 'currency',
  PERCENT: 'percent'
};
const CURRENCY_DISPLAY = {
  SYMBOL: 'symbol',
  NAME: 'name'
};
const SAFE_NUM_LENGTH = 15;
const SAFE_NUM_REGEXP = /0+$/;
const numberFormatInstancesCache = {};
function getStringOfChar(char, amount) {
  return new Array(amount + 1).join(char);
}
function getGroupingCount(skeleton) {
  const match = skeleton.match(/,[#0]*\./);
  return match ? match[0].length - 2 : 0;
}
function getOptionsUniqueKey$1(options) {
  return Object.keys(options).sort().reduce((prev, optionName) => {
    if (POSSIBLE_OPTS$1[optionName]) {
      return prev + optionName + options[optionName] + '';
    }
    return prev;
  }, '');
}
function toNumber(value, defaultValue) {
  const number = parseInt(value, 10);
  if (isNaN(number)) {
    return defaultValue;
  }
  return number;
}
function getFractionPart(options) {
  const minimumDigits = toNumber(options.minimumFractionDigits, 0);
  const maximumDigits = Math.max(toNumber(options.maximumFractionDigits, 0), minimumDigits);
  return '.' + new Array(minimumDigits + 1).join('0') + new Array(maximumDigits - minimumDigits + 1).join('#');
}
function updateFractionPart(skeleton, options) {
  const fractionPart = getFractionPart(options);
  return addFractionsToPattern(skeleton, fractionPart);
}
function addFractionsToPattern(pattern, fractionPart) {
  if (!fractionPart) {
    return pattern;
  }
  if (pattern.indexOf(';') > 0) {
    const [positivePattern, negativePattern] = pattern.split(';');
    return `${addFractionsToPattern(positivePattern, fractionPart)};${addFractionsToPattern(negativePattern, fractionPart)}`;
  }
  if (pattern.indexOf('.') > 0) {
    return pattern.replace(/\.(0|#)*/, fractionPart);
  }
  const position = Math.max(pattern.lastIndexOf('0'), pattern.lastIndexOf('#')) + 1;
  return [pattern.slice(0, position), fractionPart, pattern.slice(position)].join('');
}
function updateCurrencySymbol(skeleton, currencyCode, options) {
  const symbol = String.fromCharCode(164);
  if (options.currencyDisplay === CURRENCY_DISPLAY.NAME) {
    return skeleton.replace(symbol, '') + currencyCode;
  }
  return skeleton.replace(symbol, currencyCode);
}
function updateIntegerPart(skeleton, options) {
  const minimumIntegerDigits = options.minimumIntegerDigits;
  const groupingCount = getGroupingCount(skeleton);
  if (!minimumIntegerDigits) {
    return skeleton;
  }
  if (minimumIntegerDigits <= groupingCount) {
    return skeleton.replace(/,[#0]*\./, ',' + getStringOfChar('#', groupingCount - minimumIntegerDigits) + getStringOfChar('0', minimumIntegerDigits) + '.');
  }
  return skeleton.replace(/[#0]*\./, getStringOfChar('0', minimumIntegerDigits - groupingCount) + ',' + getStringOfChar('0', groupingCount) + '.');
}
function getBestMatchCurrencySymbol(code, currencyDisplay) {
  if (!('Intl' in window)) {
    return code;
  }
  const opts = {
    style: 'currency',
    currency: code,
    minimumFractionDigits: 0
  };
  {
    opts.currencyDisplay = currencyDisplay;
  }
  const nf = getFromCache$1(opts);
  return nf.format(2).replace(/2/g, '');
}
function getCurrency(options) {
  const currencyDisplay = options.currencyDisplay || CURRENCY_DISPLAY.SYMBOL;
  if (currencyDisplay === CURRENCY_DISPLAY.SYMBOL || currencyDisplay === CURRENCY_DISPLAY.NAME) {
    return getBestMatchCurrencySymbol(options.currency, currencyDisplay);
  }
  return options.currency;
}
function getFromCache$1(options) {
  const optionsUniqueKey = getOptionsUniqueKey$1(options);
  let numberFormatInstance = numberFormatInstancesCache[optionsUniqueKey];
  if (numberFormatInstance) {
    return numberFormatInstance;
  }
  numberFormatInstance = new Intl.NumberFormat(locale, options);
  numberFormatInstancesCache[optionsUniqueKey] = numberFormatInstance;
  return numberFormatInstance;
}
function exceedsSafeLength(value) {
  const numberAsString = value.toString();
  const [intPart, fractionPart] = numberAsString.split('.');
  const digitCount = intPart.length + (fractionPart ? fractionPart.replace(SAFE_NUM_REGEXP, '').length : 0);
  return digitCount >= SAFE_NUM_LENGTH;
}
function normalizedMinimumFractionDigits(options) {
  const fractionSkeleton = getFallbackFractionSkeleton(options.style);
  const fractionDigits = fractionSkeleton.replace(/[^0]/g, '');
  return fractionDigits.length;
}
function normalizedMaximumFractionDigits(options) {
  const fractionSkeleton = getFallbackFractionSkeleton(options.style);
  const fractionDigits = fractionSkeleton.replace(/[^0#]/g, '');
  return Math.max(options.minimumFractionDigits, fractionDigits.length);
}
function getFallbackFractionSkeleton(style) {
  let styleFormat = numberFormat$1;
  if (style === STYLE.CURRENCY) {
    styleFormat = currencyFormat;
  } else if (style === STYLE.PERCENT) {
    styleFormat = percentFormat;
  }
  const format = styleFormat.split(';')[0];
  return format.split('.')[1] || '';
}
function normalizeOptions(options) {
  const normalizedOpts = Object.assign({}, options);
  normalizedOpts.currency = normalizedOpts.currency || currency;
  if (normalizedOpts.minimumFractionDigits === undefined) {
    normalizedOpts.minimumFractionDigits = normalizedMinimumFractionDigits(normalizedOpts);
  }
  if (normalizedOpts.maximumFractionDigits === undefined || normalizedOpts.maximumFractionDigits < normalizedOpts.minimumFractionDigits) {
    normalizedOpts.maximumFractionDigits = normalizedMaximumFractionDigits(normalizedOpts);
  }
  return normalizedOpts;
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function NumberOptions(options) {
  this.options = options || {};
}
NumberOptions.prototype.isCurrency = function () {
  return this.options.style === 'currency';
};
NumberOptions.prototype.isPercent = function () {
  return this.options.style === 'percent';
};
NumberOptions.prototype.isDefaultCurrency = function () {
  return !this.options.currency || currency === this.options.currency;
};
NumberOptions.prototype.getDefaultSkeleton = function () {
  return this.isCurrency() ? currencyFormat : this.isPercent() ? percentFormat : numberFormat$1;
};
NumberOptions.prototype.getSkeleton = function () {
  const options = this.options;
  const defaultSkeleton = this.getDefaultSkeleton();
  let skeleton = updateFractionPart(defaultSkeleton, options);
  skeleton = updateIntegerPart(skeleton, options);
  if (!this.isDefaultCurrency()) {
    skeleton = updateCurrencySymbol(skeleton, getCurrency(options), options);
  }
  return skeleton;
};

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const ISO8601_STRICT_PATTERN = /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z){1})?)?)?$/i;
const ISO8601_TIME_PATTERN = /^\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;
const STANDARD_DATE_FORMAT = 'YYYY-MM-DD';
const TIME_SEPARATOR = 'T';
const TIMEZONE_INDICATOR = /(Z|([+-])(\d{2}):(\d{2}))$/;
function isValidISODateTimeString(dateTimeString) {
  return isValidISO8601String(dateTimeString) && isValidDate(dateTimeString);
}
function isValidISOTimeString(timeString) {
  if (!isValidISO8601TimeString(timeString)) {
    return false;
  }
  const timeOnly = removeTimeZoneSuffix(timeString);
  return isValidDate(`2018-09-09T${timeOnly}Z`);
}
function removeTimeZoneSuffix(dateTimeString) {
  if (typeof dateTimeString === 'string') {
    return dateTimeString.split(TIMEZONE_INDICATOR)[0];
  }
  return dateTimeString;
}
function isValidISO8601String(dateTimeString) {
  if (typeof dateTimeString !== 'string') {
    return false;
  }
  return ISO8601_STRICT_PATTERN.test(dateTimeString);
}
function isValidISO8601TimeString(timeString) {
  if (typeof timeString !== 'string') {
    return false;
  }
  return ISO8601_TIME_PATTERN.test(timeString);
}
function isValidDate(value) {
  const timeStamp = Date.parse(value);
  return isFinite(timeStamp);
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function isBefore(date1, date2, unit) {
  return getLocalizationService().isBefore(date1, date2, unit);
}
function isAfter(date1, date2, unit) {
  return getLocalizationService().isAfter(date1, date2, unit);
}
function formatDateTimeUTC(date) {
  return getLocalizationService().formatDateTimeUTC(date);
}
function formatDate(dateString, format, locale) {
  return getLocalizationService().formatDate(dateString, format, locale);
}
function formatDateUTC(dateString, format, locale) {
  return getLocalizationService().formatDateUTC(dateString, format, locale);
}
function formatTime(timeString, format) {
  return getLocalizationService().formatTime(timeString, format);
}
function parseDateTimeUTC(dateTimeString) {
  return getLocalizationService().parseDateTimeUTC(dateTimeString);
}
function parseDateTimeISO8601(dateTimeString) {
  return getLocalizationService().parseDateTimeISO8601(dateTimeString);
}
function parseDateTime(dateTimeString, format, strictMode) {
  return getLocalizationService().parseDateTime(dateTimeString, format, strictMode);
}
function syncUTCToWallTime(date, timeZone) {
  let converted = null;

  // eslint-disable-next-line new-cap
  getLocalizationService().UTCToWallTime(date, timeZone, result => {
    converted = result;
  });
  return converted;
}
function syncWallTimeToUTC(date, timeZone) {
  let converted = null;

  // eslint-disable-next-line new-cap
  getLocalizationService().WallTimeToUTC(date, timeZone, result => {
    converted = result;
  });
  return converted;
}
function toOtherCalendar(date) {
  return getLocalizationService().translateToOtherCalendar(date);
}
function fromOtherCalendar(date) {
  return getLocalizationService().translateFromOtherCalendar(date);
}
function toLocalizedDigits(input) {
  return getLocalizationService().translateToLocalizedDigits(input);
}
function fromLocalizedDigits(input) {
  return getLocalizationService().translateFromLocalizedDigits(input);
}
function parseTime(timeString, format, strictParsing) {
  if (!timeString) {
    return null;
  }
  if (!format) {
    if (!isValidISOTimeString(timeString)) {
      return null;
    }
    return parseDateTimeISO8601(timeString);
  }
  const parseString = timeString.replace(/(\d)([AaPp][Mm])/g, '$1 $2');
  const parseFormat = format.replace(/(\b|[^h])h{2}(?!h)/g, '$1h').replace(/(\b|[^H])H{2}(?!H)/g, '$1H').replace(/(\b|[^m])m{2}(?!m)/g, '$1m').replace(/\s*A/g, ' A').trim();
  const acceptableFormats = [parseFormat];
  acceptableFormats.push(parseFormat.replace('m', 'm:s'), parseFormat.replace('m', 'm:s.S'), parseFormat.replace('m', 'm:s.SS'), parseFormat.replace('m', 'm:s.SSS'));
  acceptableFormats.reverse();
  for (let i = 0; i < acceptableFormats.length; i++) {
    const time = parseDateTime(parseString, acceptableFormats[i], strictParsing);
    if (time) {
      return time;
    }
  }
  return null;
}
function getNumberFormat(format) {
  return getLocalizationService().getNumberFormat(format);
}
function duration(value, unit) {
  return getLocalizationService().duration(value, unit);
}
function displayDuration(value, withSuffix) {
  return getLocalizationService().displayDuration(value, withSuffix);
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function numberFormatFallback(options) {
  const skeleton = new NumberOptions(options).getSkeleton();
  return {
    format: value => {
      return getNumberFormat(skeleton).format(value);
    }
  };
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function numberFormat(options) {
  const normalizedOpts = Object.assign({}, normalizeOptions(options));
  if (!('Intl' in window)) {
    return numberFormatFallback(normalizedOpts);
  }
  return {
    format: value => {
      if (value && exceedsSafeLength(value)) {
        return numberFormatFallback(normalizedOpts).format(value);
      }
      const numberFormatInstance = getFromCache$1(normalizedOpts);
      return numberFormatInstance.format(value);
    }
  };
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function assert(condition, message) {}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const MINUTE_MILLISECONDS = 1000 * 60;
function relativeFormat() {
  return {
    format: value => {
      const now = Date.now();
      const timestamp = Number(value);
      const getDiffInMinutes = (timestamp - now) / MINUTE_MILLISECONDS;
      const durationData = duration(getDiffInMinutes, 'minutes');
      return displayDuration(durationData, true);
    }
  };
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const FORMATTING_OPTS = ['weekday', 'year', 'month', 'day', 'hour', 'minute', 'second', 'era'];
const FORMAT_MAP = {
  weekday: {
    short: 'EEE, ',
    narrow: 'EEE, ',
    long: 'EEEE, '
  },
  month: {
    short: 'MMM ',
    narrow: 'MMM ',
    numeric: 'MMM ',
    '2-digit': 'MMM ',
    long: 'MMMM '
  },
  day: {
    numeric: 'd, ',
    '2-digit': 'dd, '
  },
  year: {
    numeric: 'yyyy ',
    '2-digit': 'yy '
  },
  hour: {
    numeric12: 'h',
    numeric24: 'H',
    '2-digit12': 'hh',
    '2-digit24': 'HH'
  },
  minute: {
    numeric: 'mm',
    '2-digit': 'mm'
  },
  second: {
    numeric: 'ss',
    '2-digit': 'ss'
  },
  timeZoneName: {
    short: '[GMT]Z',
    long: '[GMT]Z'
  }
};
const SEPARATORS = [',', ' ', ':'];
function getWeekDayPart(format, options) {
  const weekdayOptionValue = options.weekday;
  if (FORMAT_MAP.weekday[weekdayOptionValue] !== undefined) {
    format.push(FORMAT_MAP.weekday[weekdayOptionValue]);
  }
}
function getMonthPart(format, options) {
  const monthOptionValue = options.month;
  if (FORMAT_MAP.month[monthOptionValue] !== undefined) {
    format.push(FORMAT_MAP.month[monthOptionValue]);
  }
}
function getDayPart(format, options) {
  const dayOptionValue = options.day;
  if (FORMAT_MAP.day[dayOptionValue] !== undefined) {
    format.push(FORMAT_MAP.day[dayOptionValue]);
  }
}
function getYearPart(format, options) {
  const yearOptionValue = options.year;
  if (FORMAT_MAP.year[yearOptionValue] !== undefined) {
    format.push(FORMAT_MAP.year[yearOptionValue]);
  }
}
function getTZPart(format, options) {
  const timeZoneNameOptionValue = options.timeZoneName;
  if (FORMAT_MAP.timeZoneName[timeZoneNameOptionValue] !== undefined) {
    if (options.timeZone === 'UTC') {
      format.push('[GMT]');
    } else {
      format.push(FORMAT_MAP.timeZoneName[timeZoneNameOptionValue]);
    }
  }
}
function getTimePart(format, options) {
  const hourOptionValue = options.hour,
    minuteOptionValue = options.minute,
    secondOptionValue = options.second;
  let hasTime = false;
  let hasHourOnly = false;
  if (hourOptionValue === 'numeric' || hourOptionValue === '2-digit') {
    hasTime = true;
    if (options.hour12 === false) {
      if (hourOptionValue === 'numeric') {
        format.push(FORMAT_MAP.hour.numeric24);
      } else {
        format.push(FORMAT_MAP.hour['2-digit24']);
      }
    } else if (hourOptionValue === 'numeric') {
      format.push(FORMAT_MAP.hour.numeric12);
    } else {
      format.push(FORMAT_MAP.hour['2-digit12']);
    }
    if (FORMAT_MAP.minute[minuteOptionValue] !== undefined) {
      format.push(':');
    } else if (FORMAT_MAP.second[secondOptionValue] !== undefined) {
      hasHourOnly = true;
    }
  }
  if (FORMAT_MAP.minute[minuteOptionValue] !== undefined) {
    hasTime = true;
    format.push(FORMAT_MAP.minute[minuteOptionValue]);
    if (FORMAT_MAP.second[secondOptionValue] !== undefined) {
      format.push(':');
    }
  }
  if (FORMAT_MAP.second[secondOptionValue] !== undefined && !hasHourOnly) {
    hasTime = true;
    format.push(FORMAT_MAP.second[secondOptionValue]);
  }
  if (hasTime) {
    format.push(' a ');
  }
  if (hasHourOnly) {
    format.push('[(sec]: ' + FORMAT_MAP.second[secondOptionValue] + '[)]');
  }
}
function DateTimeOptions(options) {
  this.options = options || {};
}
DateTimeOptions.prototype.hasFormattingOptions = function () {
  return FORMATTING_OPTS.some(opt => {
    return this.options[opt] !== undefined;
  });
};
DateTimeOptions.prototype.getSkeleton = function () {
  const format = [];
  getWeekDayPart(format, this.options);
  getMonthPart(format, this.options);
  getDayPart(format, this.options);
  getYearPart(format, this.options);
  getTimePart(format, this.options);
  getTZPart(format, this.options);
  let formatStr = format.join('');
  SEPARATORS.forEach(element => {
    if (formatStr.lastIndexOf(element) === formatStr.length - 1) {
      formatStr = formatStr.slice(0, -1);
    }
  });
  return formatStr;
};

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const dateTimeFormatInstancesCache = {};
const POSSIBLE_OPTS = {
  weekday: true,
  era: true,
  year: true,
  month: true,
  day: true,
  hour: true,
  minute: true,
  second: true,
  timeZone: true,
  timeZoneName: true,
  hour12: true
};
function getOptionsUniqueKey(options) {
  return Object.keys(options).sort().reduce((prev, optionName) => {
    if (POSSIBLE_OPTS[optionName]) {
      return prev + optionName + options[optionName] + '';
    }
    return prev;
  }, '');
}
function getFromCache(options) {
  const optionsUniqueKey = getOptionsUniqueKey(options);
  let formatInstance = dateTimeFormatInstancesCache[optionsUniqueKey];
  if (!formatInstance) {
    formatInstance = new Intl.DateTimeFormat(locale, options);
    dateTimeFormatInstancesCache[optionsUniqueKey] = formatInstance;
  }
  return formatInstance;
}
function convertAndFormatDate(date, format, timeZone) {
  const translatedDate = toOtherCalendar(date);
  const converted = syncUTCToWallTime(translatedDate, timeZone);
  return formatDateUTC(converted, format);
}
function isDate(value) {
  return Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime());
}
function toDate(value) {
  let dateObj = value;
  if (!isDate(value) && (typeof value === 'string' || typeof value === 'number')) {
    dateObj = new Date(isFinite(value) ? parseInt(value, 10) : Date.parse(value));
  }
  return dateObj;
}
const isTimeZonesSupported = function () {
  try {
    // eslint-disable-next-line new-cap
    Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles'
    });
  } catch (err) {
    return false;
  }
  return true;
}();
function dateTimeFormatFallback(dto) {
  const format = dto.hasFormattingOptions() ? dto.getSkeleton() : null;
  const {
    timeZone
  } = dto.options;
  return {
    format: value => {
      if (isValidISODateTimeString(value) && value.indexOf(TIME_SEPARATOR) < 0) {
        return formatDate(value);
      }
      const dateObj = toDate(value);
      if (isDate(dateObj)) {
        if (timeZone === 'UTC') {
          dateObj.setTime(dateObj.getTime() + dateObj.getTimezoneOffset() * 60 * 1000);
        }
        return convertAndFormatDate(dateObj, format, timeZone);
      }
      return '';
    }
  };
}
function dateTimeFormat(opts) {
  const options = opts || {};
  const dto = new DateTimeOptions(options);
  if (!('Intl' in window) || !dto.hasFormattingOptions() || !isTimeZonesSupported) {
    return dateTimeFormatFallback(dto);
  }
  return {
    format: value => {
      const dtf = getFromCache(options);
      return dtf.format(toDate(value));
    }
  };
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

const FALLBACK_LOCALES = [locale, 'en-us'];
const symbolsCache = {};
function getNameOfWeekdays(languageOverride) {
  const language = languageOverride || salesforceLanguage;
  const languageDataCache = symbolsCache[language];
  if (languageDataCache && languageDataCache.weekdays) {
    return languageDataCache.weekdays;
  }
  const intlLocales = [language, ...FALLBACK_LOCALES];
  const fullNameFormatter = new Intl.DateTimeFormat(intlLocales, {
    weekday: 'long',
    timeZone: 'UTC'
  });
  const shortNameFormatter = new Intl.DateTimeFormat(intlLocales, {
    weekday: 'short',
    timeZone: 'UTC'
  });
  const weekdays = [];
  for (let i = 0; i <= 6; i++) {
    const date = new Date(Date.UTC(1970, 0, 4 + i));
    weekdays.push({
      fullName: format(fullNameFormatter, date),
      shortName: format(shortNameFormatter, date)
    });
  }
  if (!symbolsCache[language]) {
    symbolsCache[language] = {};
  }
  symbolsCache[language].weekdays = weekdays;
  return weekdays;
}
function getMonthNames(languageOverride) {
  const language = languageOverride || salesforceLanguage;
  const languageDataCache = symbolsCache[language];
  if (languageDataCache && languageDataCache.months) {
    return languageDataCache.months;
  }
  const intlLocales = [language, ...FALLBACK_LOCALES];
  const monthNameFormatter = new Intl.DateTimeFormat(intlLocales, {
    month: 'long'
  });
  const months = [];
  for (let i = 0; i <= 11; i++) {
    const date = new Date(1970, i, 4);
    months.push({
      fullName: format(monthNameFormatter, date)
    });
  }
  if (!symbolsCache[language]) {
    symbolsCache[language] = {};
  }
  symbolsCache[language].months = months;
  return months;
}
function format(dateTimeFormat, date) {
  const formattedDate = dateTimeFormat.format(date);
  return removeIE11Markers(formattedDate);
}
function removeIE11Markers(formattedString) {
  return formattedString.replace(/[\u200E\u200F]/g, '');
}

/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */

function normalizeISODate(value, format) {
  const dateValue = typeof value === 'string' ? value.trim() : value;
  if (!dateValue) {
    return {
      isoValue: null,
      displayValue: value || ''
    };
  }
  const dateOnlyString = typeof dateValue === 'string' && dateValue.split(TIME_SEPARATOR)[0] || dateValue;
  const parsedDate = parseDateTime(dateOnlyString, STANDARD_DATE_FORMAT);
  if (!parsedDate) {
    return {
      isoValue: null,
      displayValue: value || ''
    };
  }
  const civilDate = toOtherCalendar(parsedDate);
  return {
    isoValue: dateOnlyString,
    displayValue: formatDate(civilDate, format)
  };
}
function normalizeISOTime(value, format) {
  const normalizedValue = removeTimeZoneSuffix(value);
  const timeValue = typeof normalizedValue === 'string' ? normalizedValue.trim() : normalizedValue;
  if (!timeValue) {
    return {
      isoValue: null,
      displayValue: value || ''
    };
  }
  assert(isValidISOTimeString(timeValue));
  const parsedTime = parseTime(timeValue);
  if (!parsedTime) {
    return {
      isoValue: null,
      displayValue: value || ''
    };
  }
  return {
    isoValue: getISOTimeString(parsedTime),
    displayValue: formatTime(parsedTime, format)
  };
}
function normalizeISODateTime(value, timezone, format) {
  const dateTimeValue = typeof value === 'string' ? value.trim() : value;
  if (!dateTimeValue) {
    return {
      isoValue: null,
      displayValue: value || ''
    };
  }
  const parsedDate = parseDateTimeISO8601(dateTimeValue);
  if (!parsedDate) {
    return {
      isoValue: null,
      displayValue: value || ''
    };
  }
  const convertedDate = syncUTCToWallTime(parsedDate, timezone);
  return {
    isoValue: removeTimeZoneSuffix(convertedDate.toISOString()),
    displayValue: formatDateTimeUTC(convertedDate)
  };
}
function normalizeFormattedDate(value, format) {
  const dateValue = typeof value === 'string' ? value.trim() : value;
  if (!dateValue) {
    return null;
  }
  const parsedDate = parseDateTime(dateValue, format || mediumDateFormat, true);
  if (!parsedDate) {
    return null;
  }
  const gregorianDate = fromOtherCalendar(parsedDate);
  return getISODateString(gregorianDate);
}
function normalizeFormattedTime(value, format) {
  const timeValue = typeof value === 'string' ? value.trim() : value;
  if (!timeValue) {
    return null;
  }
  const parsedDate = parseTime(timeValue, format || mediumTimeFormat, true);
  if (!parsedDate) {
    return null;
  }
  return getISOTimeString(parsedDate);
}
function normalizeFormattedDateTime(value, timezone, format) {
  const datetimeValue = typeof value === 'string' ? value.trim() : value;
  if (!datetimeValue) {
    return null;
  }
  const parsedDate = parseDateTimeUTC(datetimeValue);
  if (!parsedDate) {
    return null;
  }
  const convertedDate = syncWallTimeToUTC(parsedDate, timezone);
  return convertedDate.toISOString();
}
function getToday() {
  const today = getTodayBasedOnTimezone();
  return getISODateString(today);
}
function getISODateString(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
function getISOTimeString(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${doublePad(date.getMilliseconds())}`;
}
function getCurrentTime(timezone) {
  const today = getTodayBasedOnTimezone(timezone);
  return pad(today.getHours()) + ':' + pad(today.getMinutes());
}
function getTodayBasedOnTimezone(timezone) {
  const today = new Date();
  today.setTime(today.getTime() + today.getTimezoneOffset() * 60 * 1000);
  return syncUTCToWallTime(today, timezone);
}
function pad(n) {
  return Number(n) < 10 ? '0' + n : n;
}
function doublePad(n) {
  const number = Number(n);
  if (number < 10) {
    return '00' + n;
  } else if (number < 100) {
    return '0' + n;
  }
  return n;
}

export { address as addressFormat, dateTimeFormat, formatDate, formatDateTimeUTC, formatDateUTC, formatTime, fromLocalizedDigits, fromOtherCalendar, getCurrentTime, getISODateString, getISOTimeString, getMonthNames, getNameOfWeekdays, getToday, isAfter, isBefore, name as nameFormat, normalizeFormattedDate, normalizeFormattedDateTime, normalizeFormattedTime, normalizeISODate, normalizeISODateTime, normalizeISOTime, numberFormat, parseDateTime, parseDateTimeUTC, parseTime, relativeFormat, syncUTCToWallTime, syncWallTimeToUTC, toLocalizedDigits, toOtherCalendar };