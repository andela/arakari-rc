import { StaticPages } from "/lib/collections";
import { Template } from "meteor/templating";

Template.staticPageView.onCreated(function () {
	this.subscribe("staticPages");
});

Template.staticPageView.helpers({
	getPage(slug) {
		const page = StaticPages.findOne({slug});
		return [page];
	}
});
  
