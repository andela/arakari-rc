import { BrowserPolicy } from "meteor/browser-policy-common";
/*
 * set browser policies
 */
BrowserPolicy.content.allowOriginForAll("*.facebook.com");

BrowserPolicy.content.allowOriginForAll("connect.facebook.net");
BrowserPolicy.content.allowOriginForAll("*.twitter.com");
BrowserPolicy.content.allowOriginForAll("cdn.syndication.twimg.com");
BrowserPolicy.content.allowOriginForAll("*.twimg.com");