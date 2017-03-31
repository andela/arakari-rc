import { SimpleSchema } from "meteor/aldeed:simple-schema";
 
 /**
 * Reaction Schemas Static Pages
 */
 export const StaticPages = new SimpleSchema({
   title: {
     type: String,
     label: "title"
   },
   slug: {
     type: String,
     unique: true,
     label: "slug"
   },
   content: {
     type: String,
     label: "content"
   },
   shopId: {
     type: String,
     label: "shopId"
   },
   pageOwner: {
     type: String,
     label: "pageOwner"
   },
   createdAt: {
     type: Date,
     label: "createdAt"
   },
   updatedAt: {
     type: Date,
     label: "updatedAt"
   }
 });