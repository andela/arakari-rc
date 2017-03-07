import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { PackageConfig } from "/lib/collections/schemas/registry";

export const PaystackPackageConfig = new SimpleSchema([
  PackageConfig, {
    "settings.publicKey": {
      type: String,
      label: "Public Key",
      min: 47,
      optional: false
    }
  }
]);
