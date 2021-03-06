/**
 * Created by samsan on 5/25/17.
 */

angular.module('viewCustom')
    .controller('prmAuthenticationAfterController', ['prmSearchService','customService', 'customConfigService', function (prmSearchService,customService,customConfigService) {
        let vm=this;
        // initialize custom service search
        let sv=prmSearchService;
        let csv=customService;
        let ccs=customConfigService;
        vm.api = ccs.getHVD2Config();
        vm.form={'ip':'','status':false,'token':'','sessionToken':'','isLoggedIn':''};

        vm.validateIP=function () {
            vm.api=ccs.getHVD2Config();
            if(vm.api.ipUrl) {
                sv.postAjax(vm.api.ipUrl, vm.form)
                    .then(function (result) {
                            sv.setClientIp(result.data);
                        },
                        function (error) {
                            console.log(error);
                        })
            }
        };

        vm.getClientIP=function() {
            vm.auth = sv.getAuth();
            if(vm.auth.primolyticsService.jwtUtilService) {
                vm.form.token=vm.auth.primolyticsService.jwtUtilService.storageUtil.sessionStorage.primoExploreJwt;
                vm.form.sessionToken=vm.auth.primolyticsService.jwtUtilService.storageUtil.localStorage.getJWTFromSessionStorage;
                vm.form.isLoggedIn=vm.auth.isLoggedIn;
                // decode JWT Token to see if it is a valid token
                let obj=vm.auth.authenticationService.userSessionManagerService.jwtUtilService.jwtHelper.decodeToken(vm.form.token);
                vm.form.ip=obj.ip;

                vm.validateIP();
            }
        };

        // get rest endpoint Url
        vm.getUrl=function () {
            vm.api = ccs.getHVD2Config();
            if (vm.api.ipUrl){
                vm.getClientIP();
            }
        };

        // check if a user login
        vm.$onChanges=function(){
            // This flag is return true or false
            let loginID=vm.parentCtrl.isLoggedIn;
            sv.setLogInID(loginID);
            sv.setAuth(vm.parentCtrl);
            csv.setAuth(vm.parentCtrl);
            vm.api = ccs.getHVD2Config();
            if(vm.api.ipUrl) {
                // get client ip address to see if a user is internal or external user
                vm.getClientIP();
            }

        };

    }]);



angular.module('viewCustom')
    .component('prmAuthenticationAfter', {
        bindings: {parentCtrl: '<'},
        controller: 'prmAuthenticationAfterController'
    });

