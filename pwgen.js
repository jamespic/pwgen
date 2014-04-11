angular.module('pwgen', ["ngAnimate",'mgcrea.ngStrap.tooltip', 'mgcrea.ngStrap.popover','mgcrea.ngStrap.typeahead']);

function PwGen($scope) {
  //$scope.salt = CryptoJS.enc.Hex.parse('0000000000000000'); // Hard-coded - only way to make this repeatable
  $scope.userName = localStorage.userName || "";
  $scope.siteName = "";
  $scope.pw1 = "";
  $scope.pw2 = "";
  $scope.iterations = 1000;
  $scope.sites = (localStorage.sites && JSON.parse(localStorage.sites)) || []
  $scope.password = "No password generated";
  
  $scope.saveSites = function() {
    if ($scope.sites.indexOf($scope.siteName) === -1) {
      $scope.sites.push($scope.siteName)
      localStorage.sites = JSON.stringify($scope.sites)
    }
  }
  
  $scope.generate = function() {
    if ($scope.pw1 !== $scope.pw2) {
      $scope.password = "Passwords do not match!"
    } else {
      var salt = CryptoJS.enc.Hex.parse($scope.userName + ":" + $scope.siteName);
      var key = CryptoJS.PBKDF2($scope.pw1, salt, {keySize: 128/32, iterations: $scope.iterations});
      var b64Key = CryptoJS.enc.Base64.stringify(key)
      $scope.password = b64Key.substring(0, 7) + "." + b64Key.substring(7,13)
      $scope.saveSites()
    }
  }
  
  $scope.$watch(
    function() {return $scope.userName},
    function(newValue, oldValue) {
      localStorage.userName = newValue
    }
  )
  
  $scope.$watch(
    function() {return $scope.pw1 + ":" + $scope.pw2 + ":" + $scope.siteName + ":" + $scope.userName},
    function(oldValue, newValue) {
      if (oldValue !== newValue) {
        if ($scope.pw1 != $scope.pw2) {
          $scope.password = "Passwords do not match!";
        } else {
          $scope.password = "No password generated";
        }
      }
    }
  )
}