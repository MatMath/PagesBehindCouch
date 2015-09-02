## Goal:
Making a Simple, but complete structure with many pages behind a protected login pages that connect to a CouchDB.

Manual install needed: 
"erica" https://github.com/benoitc/erica to be able to push it to a remote couchDB. 

How to run it locally:
$ gulp server

How to test it:
$ gulp test


## History:
### v.old. We had a Big and old angular app 
	- More than 1000 commits on the master branch
	- Lasted 3 year
	- Grow organically
	- It was stable (ish) but:
	- Refactor was needed for the core elements
	
### V.Now. Starting with better tools and best practices structure
	- Gulp file 
	- Fully testable
	- Single Communication --> To Couch DB Server



## Was Build with: 
	- Yeoman / https://github.com/Swiip/generator-gulp-angular
	- Angular v1.4.1 @2015.06.24 (Happy St-Jean)

## Internal Structure:
	src/
		components/
			couchDB/
				- couchdb.Services (Save, MapreduceCall)
			docNavBar (navBar for the Doc View)
			docview (Initial View of the Doc that call the client Specific Display)
			editorDocView (manager Role: can edit the template)
			editorMainPage (manager Role: can view all template)
			login (If not connected, this is the only page visible)
				- Authentication.services (Connect to CouchDB, Login, Logout, Store user details in Cookie.)
				//- flash.services (Put a Flashing even on top to notify the user of some event)  --> To delete
				- login.controller (Login/Logout and clear even at loading)
				- user.services (? Get  current user details, role, attribute)
			mainDashboard = Fetch CouchDB data, List current docs + status
				- stageView.Controller
			navBar/
				- navbar.directive
				- navbar.scss
			notification/
				- notification.controller
				- notification.services

Translation: Handle by Angular-translate

## Target Flow
If no user already login in the system: {
	Ask to login.
} else {
	User can select his user and only write the password. 
}


## Technical Target process
Secure wrapper for internal pages.
Split the Services and the Controller so the loadtime is faster.


## Reference docs that were read/referenced:
### Best Practices:
https://github.com/johnpapa/angular-styleguide

### Angular1.4+ Big Project structure:
https://medium.com/opinionated-angularjs/scalable-code-organization-in-angularjs-9f01b594bf06
https://docs.google.com/document/d/1XXMvReO8-Awi1EZXAXS4PzDzdNvV6pGcuaF4Q9821Es/pub
https://scotch.io/tutorials/angularjs-best-practices-directory-structure

### UI Router:
https://scotch.io/tutorials/angular-routing-using-ui-router
https://scotch.io/tutorials/angularjs-multi-step-form-using-ui-router

### Security Module:
http://jasonwatmore.com/post/2015/03/10/AngularJS-User-Registration-and-Login-Example.aspx
https://github.com/cornflourblue/angular-registration-login-example
http://jasonwatmore.com/post/2014/05/26/AngularJS-Basic-HTTP-Authentication-Example.aspx
https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec

### Testing:
http://jasmine.github.io/2.0/introduction.html
