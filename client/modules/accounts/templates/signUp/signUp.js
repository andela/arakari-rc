import { LoginFormSharedHelpers } from "/client/modules/accounts/helpers";
import { Template } from "meteor/templating";
import { Meteor } from "meteor/meteor";

/**
 * onCreated: Login form sign up view
 */
Template.loginFormSignUpView.onCreated(() => {
  const template = Template.instance();

  template.uniqueId = Random.id();
  template.formMessages = new ReactiveVar({});
  template.type = "signUp";
});

/**
 * Helpers: Login form sign up view
 */
Template.loginFormSignUpView.helpers(LoginFormSharedHelpers);

/**
 * Events: Login form sign up view
 */
Template.loginFormSignUpView.events({
  /**
   * Submit sign up form
   * @param  {Event} event - jQuery Event
   * @param  {Template} template - Blaze Template
   * @return {void}
   */
  "submit form": function (event, template) {
    event.preventDefault();

    // var usernameInput = template.$(".login-input--username");
    const emailInput = template.$(".login-input-email");
    const passwordInput = template.$(".login-input-password");

    const email = emailInput.val().trim();
    const password = passwordInput.val().trim();
    const role = event.target.myAccount.value;

    const validatedEmail = LoginFormValidation.email(email);
    const validatedPassword = LoginFormValidation.password(password);

    const templateInstance = Template.instance();
    const errors = {};

    templateInstance.formMessages.set({});

    if (validatedEmail !== true) {
      errors.email = validatedEmail;
    }

    if (validatedPassword !== true) {
      errors.password = validatedPassword;
    }

    if ($.isEmptyObject(errors) === false) {
      templateInstance.formMessages.set({
        errors: errors
      });
      // prevent signup
      return;
    }

    const newUserData = {
      email: email,
      password: password,
      role: role
    };

    const accountDetails = {
        userId: Meteor.userId(),
        role: role
    };

    // adds role to user account
    Meteor.call('user/addUserRole', accountDetails, (err, res) => {
      if (err) {
        alert(err);
      } else {
        // success!
      }
    });

    Accounts.createUser(newUserData, function (error) {
      if (error) {
        // Show some error message
        templateInstance.formMessages.set({
          alerts: [error]
        });
      } else {
        // Close dropdown or navigate to page
        const userId = Meteor.userId();
  
        if (role === "vendor") {
          // creates a new shop when a vendor user signs up
          Meteor.call("shop/createVendorShop", userId,(err, res) => {
          if (err) {
            alert(err);
          } else {
            // success!
          }
        });
        }
      }
    });
  }
});
