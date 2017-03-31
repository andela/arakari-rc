import { Template } from "meteor/templating";
 import "./static-pages.html";
 import { StaticPages } from "/lib/collections";
 import { Reaction } from "/client/api";
 
 Template.staticPages.onCreated(() => {
   Meteor.subscribe("staticPages");
 });
 
 Template.staticPages.onRendered(() => {
   CKEDITOR.replace("static-page-content");
 });
 
 Template.staticPages.helpers({
   baseUrl() {
     return window.location.host;
   },
   displayPages() {
     return StaticPages.find().fetch();
   }
 });
 
 Template.staticPages.events({
   "submit form": (event) => {
     event.preventDefault();
     const title = $("#static-page-title").val();
     const slug = $("#static-page-slug").val();
     const content = $("#static-page-content").val();
     const shopId = Reaction.shopId;
     const pageOwner = Meteor.user()._id;
 
     if ($("#btn-update").text() === "Edit Page") {
       Meteor.call("updatePage", Session.get("editId"), title, slug, content,  error => {
         if (error) {
           Alerts.toast(error.reason, "error");
         } else {
           Alerts.toast("Page Update Successful!", "success");
         }
       });
     } else {
       Meteor.call("insertPage", title, slug, content, shopId, pageOwner, error => {
         if (error) {
           Alerts.toast(error.reason, "error");
         } else {
           Alerts.toast("Created New Static Page", "success");
         }
       });
     }
   },
   "click .delete-page"() {
     Alerts.alert({
       title: "Delete this page?",
       showCancelButton: true,
       cancelButtonText: "No",
       confirmButtonText: "Yes"
     }, (confirmed) => {
       if (confirmed) {
         Meteor.call("deletePage", this._id);
       }
     });
   },
   "click .edit-page"() {
     const _id = this._id;
     Session.set("editId", _id);
     const pageDetails = StaticPages.findOne(_id);
     $("#static-page-title").val(pageDetails.title);
     $("#static-page-slug").val(pageDetails.slug);
     $("#btn-update").text("Edit Page");
     $("#header").text(`Edit ${pageDetails.title}`);
     $(".create-page").show();
     CKEDITOR.instances["static-page-content"].setData(pageDetails.content);
   },
   "click .create-page"(event) {
     event.preventDefault();
     $(".create-page").hide();
     $("#btn-update").text("Create Page");
     $("#header").text("Create a New Page");
     $("#static-page-title").val("");
     $("#static-page-slug").val("");
     CKEDITOR.instances["static-page-content"].setData("");
   }
 });
