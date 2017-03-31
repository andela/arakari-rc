import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { StaticPages } from  "/lib/collections";
import * as Schemas from "/lib/collections/schemas";

 Meteor.methods({
   "insertPage"(title, slug, content, shopId, pageOwner) {
 	    check(title, String);
     check(slug, String);
     check(content, String);
     check(shopId, String);
     check(pageOwner, String);
 
     const page = {
       title,
       slug,
       content,
       shopId,
       pageOwner,
       createdAt: new Date,
       updatedAt: new Date
     };
     if (StaticPages.find({slug: slug}).count()) {
       throw new Meteor.Error("error", "Slug already exists");
     }
     check(page, Schemas.StaticPages);
     StaticPages.insert(page);
   },
   "deletePage"(pageId) {
     check(pageId, String);
     StaticPages.remove(pageId);
   },
   "updatePage"(pageId, title, slug, content) {
     check(pageId, String);
     check(title, String);
     check(slug, String);
     check(content, String);
 
     StaticPages.update(pageId, {
       $set: {
         title,
         slug,
         content,
         updatedAt: new Date
       }
     });
   }
 });
