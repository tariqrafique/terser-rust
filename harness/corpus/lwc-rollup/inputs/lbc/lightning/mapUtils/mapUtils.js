/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
var appVersion = 256;

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
var untrustedContentDomain = ".a.forceusercontent.com";

/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
const port = '';
const MAP_DOMAIN = `https://maps${untrustedContentDomain}${port}`;
function buildMapSourceUrl(parameters) {
  const version = appVersion;
  let sourceUrl = `${MAP_DOMAIN}/lightningmaps/mapsloader?version=${version}`;
  Object.keys(parameters).forEach(key => {
    sourceUrl += `&${key}=${encodeURIComponent(parameters[key])}`;
  });
  return sourceUrl;
}

export { MAP_DOMAIN, buildMapSourceUrl };