import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { PackageConfig } from "/lib/collections/schemas/registry";

export const PaystackPackageConfig = new SimpleSchema([
  PackageConfig, {
    "settings.secretKey": {
      type: Boolean,
      label: "Secret Key",
      defaultValue: false,
      min: 47
    },
    "settings.publicKey": {
      type: String,
      label: "Public Key",
      defaultValue: "Public Key",
      min: 47
    }
  }
]);
