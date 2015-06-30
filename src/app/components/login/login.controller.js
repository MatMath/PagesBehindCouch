(function () {
    'use strict';
 
    angular
        .module('pagesBehindCouch')
        .controller('LoginController', LoginController);
 
    LoginController.$inject = ['$location', 'AuthenticationService', 'FlashService'];
    function LoginController($location, AuthenticationService, FlashService) {
        var vm = this;
 
        vm.login = login;

        function pleaseAlertMe () {
        	console.log("PLEASE");
        	alert("Common Tabarnack");
        };
 
        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();
 
        function login() {
            console.log("Not Called / working here");
            vm.dataLoading = true;
            AuthenticationService.Login(vm.username, vm.password, function (response) {
                // The return logic depend on the backend you have
                if (response.user && response.user._id === vm.username) {
                    AuthenticationService.SetCredentials(vm.username, vm.password, "extraInformationHere");
                    $location.path('/');
                } else {
                    FlashService.Error(response.userFriendlyErrors[0]);
                    vm.dataLoading = false;
                }
            });
        };
    }
 
})();
