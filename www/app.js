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
            "content": "some typography content<br><iframe src='https://docs.google.com/presentation/d/1yTyEpqX3--enNQs5xWxl25ebEbmyrQnpsAmOlDahJZo/embed?start=false&loop=false&delayms=3000' frameborder='0' allowfullscreen='true' mozallowfullscreen='true' webkitallowfullscreen='true'></iframe>"
          },
          {
            "subsection": "Colors",
            "content": "<p>Lots of text about some things and some other things</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p><p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore</p>"
          }
        ]
      },
      {
        "section": "Advertising",
        "subsections": [
          {
            "subsection": "Digital",
            "content": "some digital ad content<br><iframe data-src='//docs.google.com/gview?url=https://storage.googleapis.com/doubleclick-prod/documents/Programmatic_Direct_Infographic.pdf&amp;embedded=true' allowfullscreen='' src='//docs.google.com/gview?url=https://storage.googleapis.com/doubleclick-prod/documents/Programmatic_Direct_Infographic.pdf&amp;embedded=true'></iframe>"
          },
          {
            "subsection": "Print",
            "content": "some print ad content<br><img src='https://storage.googleapis.com/doubleclick-prod/images/offset_comp_237030_1.95b375d5.rectangle-550x462.jpg'>"
          },
          {
            "subsection": "Email",
            "content": "some email ad content<ul><li>Bullet points</li><li>Bullet points</li><li>Bullet points</li><li>Bullet points</li><li>Bullet points</li><li>Bullet points</li><li>Bullet points</li><li>Bullet points</li></ul><strong>Bold text is cool</strong>"
          }
        ]
      },
      {
        "section": "Sports",
        "subsections": [
          {
            "subsection": "Baseball",
            "content": "some baseball content<br><iframe src='https://www.youtube.com/embed/6Joup252fR0' frameborder='0' allowfullscreen></iframe>"
          },
          {
            "subsection": "Basketball",
            "content": "some basketball content<br><iframe src='https://www.youtube.com/embed/O1uxFRIdCWo' frameborder='0' allowfullscreen></iframe>"
          },
          {
            "subsection": "Soccer",
            "content": "some soccer content<br><iframe src='https://www.youtube.com/embed/mI2dDwWaNUY' frameborder='0' allowfullscreen></iframe>"
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
    // put results array in correct order
    for (var c = 0; c < $scope.results.length; c++) {
      $scope.results.move(c, findWithAttr(customContent, 'subsection', $scope.results[c].subsection));
    }
  });
}]);
