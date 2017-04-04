import { Media, Audio, Book, Software, Video } from "/lib/collections";
import { Reaction } from "/server/api";

/**
 * CollectionFS - Image/Video Publication
 * @params {Array} shops - array of current shop object
 */
Meteor.publish("Media", function (shops) {
  check(shops, Match.Optional(Array));
  let selector;
  const shopId = Reaction.getShopId();
  if (!shopId) {
    return this.ready();
  }
  if (shopId) {
    selector = {
      "metadata.shopId": shopId
    };
  }
  if (shops) {
    selector = {
      "metadata.shopId": {
        $in: shops
      }
    };
  }
  return Media.find(selector, {
    sort: {
      "metadata.priority": 1
    }
  });
});

const publisher = (db, name) => {
  Meteor.publish(name, function (productId) {
    check(productId, String);
    let selector;
    const shopId = Reaction.getShopId();
    if (!shopId) {
      return this.ready();
    }
    if (shopId) {
      selector = {
        "metadata.shopId": shopId,
        "metadata.productId": productId
      };
    }

    return db.find(selector);
  });
};

publisher(Audio, "audio");
publisher(Book, "book");
publisher(Software, "software");
publisher(Video, "video");
