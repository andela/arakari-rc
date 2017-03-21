/**
 * core collectionsFS configurations
 */
FS.HTTP.setBaseUrl("/assets");
FS.HTTP.setHeadersForGet([
  ["Cache-Control", "public, max-age=31536000"]
]);

/**
 * Define CollectionFS collection
 * See: https://github.com/CollectionFS/Meteor-CollectionFS
 * chunkSize: 1024*1024*2; <- CFS default // 256k is default GridFS chunk size, but performs terribly
 */

export const Media = new FS.Collection("Media", {
  stores: [
    new FS.Store.GridFS("image", {
      chunkSize: 1 * 1024 * 1024
    }), new FS.Store.GridFS("large", {
      chunkSize: 1 * 1024 * 1024,
      transformWrite: function (fileObj, readStream, writeStream) {
        if (gm.isAvailable) {
          gm(readStream, fileObj.name).resize("1000", "1000").stream()
            .pipe(writeStream);
        } else {
          readStream.pipe(writeStream);
        }
      }
    }), new FS.Store.GridFS("medium", {
      chunkSize: 1 * 1024 * 1024,
      transformWrite: function (fileObj, readStream, writeStream) {
        if (gm.isAvailable) {
          gm(readStream, fileObj.name).resize("600", "600").stream().pipe(
            writeStream);
        } else {
          readStream.pipe(writeStream);
        }
      }
    }), new FS.Store.GridFS("small", {
      chunkSize: 1 * 1024 * 1024,
      transformWrite: function (fileObj, readStream, writeStream) {
        if (gm.isAvailable) {
          gm(readStream).resize("235", "235" + "^").gravity("Center")
            .extent("235", "235").stream("PNG").pipe(writeStream);
        } else {
          readStream.pipe(writeStream);
        }
      }
    }), new FS.Store.GridFS("thumbnail", {
      chunkSize: 1 * 1024 * 1024,
      transformWrite: function (fileObj, readStream, writeStream) {
        if (gm.isAvailable) {
          gm(readStream).resize("100", "100" + "^").gravity("Center")
            .extent("100", "100").stream("PNG").pipe(writeStream);
        } else {
          readStream.pipe(writeStream);
        }
      }
    })
  ],
  filter: {
    allow: {
      contentTypes: ["image/*"]
    }
  }
});

export const Audio = new FS.Collection("Audio", {
  stores: [new FS.Store.GridFS("audio", {
    transformWrite: function (fileObj, readStream, writeStream) {
      readStream.pipe(writeStream);
    }
  })
  ],
  filter: {
    allow: {
      contentTypes: ["audio/*"],
      extensions: ["wav", "wma", "aac", "mp3"]
    }
  }
});

export const Book = new FS.Collection("Book", {
  stores: [new FS.Store.GridFS("book", {
    transformWrite: function (fileObj, readStream, writeStream) {
      readStream.pipe(writeStream);
    }
  })
  ],
  filter: {
    allow: {
      contentTypes: ["book/*"],
      extensions: ["pdf", "doc", "epub"]
    }
  }
});

export const Software = new FS.Collection("Software", {
  stores: [new FS.Store.GridFS("software", {
    transformWrite: function (fileObj, readStream, writeStream) {
      readStream.pipe(writeStream);
    }
  })
  ]
});

export const Video = new FS.Collection("Video", {
  stores: [
    new FS.Store.GridFS("video", {
      transformWrite: function (fileObj, readStream, writeStream) {
        readStream.pipe(writeStream);
      }
    })
  ],
  filter: {
    allow: {
      contentTypes: ["video/*"],
      extensions: ["mp4", "mov", "flv", "3gp", "avi"]
    }
  }
});

const allow = (db) => {
  const actionMethod = () => true;
  db.allow({
    insert: actionMethod,
    download: actionMethod,
    update: actionMethod,
    remove: actionMethod
  });
};

allow(Audio);
allow(Book);
allow(Software);
allow(Video);

