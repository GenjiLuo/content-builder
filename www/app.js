angular.module('contentApp', ['ngSanitize'])

.config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
}])

.factory('dataObject', function(){
  var content = {
    "sections": [
      {
        "section": "General",
        "subsections": [
          {
            "subsection": "Typography",
            "content": "some typography content"
          },
          {
            "subsection": "Colors",
            "content": "some color content"
          }
        ]
      },
      {
        "section": "Advertising",
        "subsections": [
          {
            "subsection": "Digital",
            "content": "some digital ad content"
          },
          {
            "subsection": "Print",
            "content": "some print ad content"
          },
          {
            "subsection": "Email",
            "content": "some email ad content"
          }
        ]
      },
      {
        "section": "Sports",
        "subsections": [
          {
            "subsection": "Baseball",
            "content": "some baseball content"
          },
          {
            "subsection": "Basketball",
            "content": "some basketball content<br><iframe src='https://www.youtube.com/embed/O1uxFRIdCWo' frameborder='0' allowfullscreen></iframe>"
          },
          {
            "subsection": "Soccer",
            "content": "some soccer content"
          }
        ]
      }
    ]
  }

  return content;
})

.controller('mainController', ['$scope', '$timeout', '$location', '$sce', 'dataObject', function($scope, $timeout, $location, $sce, dataObject) {
  $scope.content = dataObject;
  $scope.primaryContent = [];
  $scope.custom = [];
  $scope.link = '';

  // allow iframes and other html to be displayed
  $scope.trustAsHtml = $sce.trustAsHtml;

  // show section in the main content area
  $scope.showSections = function() {
    $scope.primaryContent = this;
    location.hash = "#";
    document.querySelector('.primary-content').scrollTop = 0;
  };

  // show the parent section in the main content area and scroll down to subsection anchor
  $scope.showSubsection = function() {
    var me = this
    $scope.primaryContent = this;
    $timeout(function(){
      location.hash = "#" + me.sub.subsection.toLowerCase();
    });
  };

  // add an item to the custom objects array
  $scope.addToCustom = function() {
    console.log(this);
    $scope.custom.push(this);
  };

  // create a custom link from the items added to the custom array and show modal
  $scope.showLink = function() {
    $scope.link = 'http://' + location.host + '/custom.html?custom=';
    for (var i = 0; i < $scope.custom.length; i++) {
      $scope.link += $scope.custom[i].i.subsection + ',';
    }
    $scope.link = $scope.link.substring(0, $scope.link.length - 1);
    $scope.modalActive = true;
  };

  // remove an item from the custom array
  $scope.removeSection = function(item) {
    var index = $scope.custom.indexOf(item);
    $scope.custom.splice(index, 1);
  };

  // TODO copy custom link
  $scope.copyLink = function (containerid) {
    var range = document.createRange();
    range.selectNode(document.getElementById(containerid));
    window.getSelection().addRange(range);
  };

}])

.controller('customController', ['$scope', '$location', '$sce', 'dataObject', function($scope, $location, $sce, dataObject) {
  $scope.content = dataObject;
  var subsections = [];
  var customContent = [];
  $scope.results = [];

  // allow iframes and other html to be displayed
  $scope.trustAsHtml = $sce.trustAsHtml;

  // create new array of subsection objects from original set of content data
  for (var i = 0; i < $scope.content.sections.length; i++) {
    for (var x = 0; x < $scope.content.sections[i].subsections.length; x++) {
      subsections.push($scope.content.sections[i].subsections[x]);
    }
  }

  // create new array of values from query string
  var customSections = $location.search().custom.split(',');
  for (var n = 0; n < customSections.length; n++) {
    customContent.push({'subsection': customSections[n]});
  }

  // filter array of subsections and create new array with objects that match the query string
  subsections.filter(function( obj ) {
    for (var y = 0; y < customSections.length; y++) {
      if (obj.subsection == customSections[y]) {
        $scope.results.push(obj);
      }
    }
  });

  // put results array in correct order
  function findWithAttr(array, attr, value) {
      for(var i = 0; i < array.length; i += 1) {
          if(array[i][attr] === value) {
              return i;
          }
      }
      return -1;
  }
  Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
  };
  for (var c = 0; c < $scope.results.length; c++) {
    $scope.results.move(c, findWithAttr(customContent, 'subsection', $scope.results[c].subsection));
  }
}]);
