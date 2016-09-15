angular.module('contentApp', ['ngSanitize', 'angular-sortable-view', 'smoothScroll', 'ngTouch'])

.config(['$locationProvider', function($locationProvider) {
  'use strict';
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
}])

.run(['$location', function($location) {
  'use strict';
  FastClick.attach(document.body);
  if ($location.path() != '/custom.html') {
    $location.path('');
  }
}])

.factory('dataObject', function(){
  'use strict';
  var content = {
    sections: [
      {
        section: "General",
        subsections: [
          {
            subsection: "Typography",
            content: "some typography content<br><iframe src='https://docs.google.com/presentation/d/1yTyEpqX3--enNQs5xWxl25ebEbmyrQnpsAmOlDahJZo/embed?start=false&loop=false&delayms=3000' frameborder='0' allowfullscreen='true' mozallowfullscreen='true' webkitallowfullscreen='true'></iframe>",
            notes: "Typography Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          },
          {
            subsection: "Colors",
            content: "<p>Lots of text about some things and some other things</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p><p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore</p>",
            notes: "Colors Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          }
        ]
      },
      {
        section: "Advertising",
        subsections: [
          {
            subsection: "Digital",
            content: "some digital ad content<br><iframe data-src='//docs.google.com/gview?url=https://storage.googleapis.com/doubleclick-prod/documents/Programmatic_Direct_Infographic.pdf&amp;embedded=true' allowfullscreen='' src='//docs.google.com/gview?url=https://storage.googleapis.com/doubleclick-prod/documents/Programmatic_Direct_Infographic.pdf&amp;embedded=true'></iframe>",
            notes: "Digital Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          },
          {
            subsection: "Print",
            content: "some print ad content<br><img src='https://storage.googleapis.com/doubleclick-prod/images/offset_comp_237030_1.95b375d5.rectangle-550x462.jpg'>",
            notes: "Print Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          },
          {
            subsection: "Email",
            content: "some email ad content<ul><li>Bullet points</li><li>Bullet points</li><li>Bullet points</li><li>Bullet points</li><li>Bullet points</li><li>Bullet points</li><li>Bullet points</li><li>Bullet points</li></ul><strong>Bold text is cool</strong>",
            notes: "Email Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          }
        ]
      },
      {
        section: "Sports",
        subsections: [
          {
            subsection: "Baseball",
            content: "some baseball content<br><iframe src='https://www.youtube.com/embed/6Joup252fR0' frameborder='0' allowfullscreen></iframe>",
            notes: "Baseball Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          },
          {
            subsection: "Basketball",
            content: "some basketball content<br><iframe src='https://www.youtube.com/embed/O1uxFRIdCWo' frameborder='0' allowfullscreen></iframe>",
            notes: "Baskeball Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          },
          {
            subsection: "Soccer",
            content: "some soccer content<br><iframe src='https://www.youtube.com/embed/mI2dDwWaNUY' frameborder='0' allowfullscreen></iframe>",
            notes: "Soccer Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          },
          {
            subsection: "Tennis",
            content: "some tennis content<br><iframe src='https://www.youtube.com/embed/WyJM9-7OvZo' frameborder='0' allowfullscreen></iframe>",
            notes: "Tennis Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          },
          {
            subsection: "Fishing",
            content: "some fishing content<br><iframe src='https://www.youtube.com/embed/tYwOaVcyacw' frameborder='0' allowfullscreen></iframe>",
            notes: "Fishing Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          },
          {
            subsection: "Football",
            content: "some football content<br><iframe src='https://www.youtube.com/embed/v-1MQ0Cnbhs' frameborder='0' allowfullscreen></iframe>",
            notes: "Football Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          }
        ]
      }
    ]
  };

  return content;
})

.controller('mainController', ['$scope', '$timeout', '$location', '$sce', 'dataObject', 'smoothScroll', function($scope, $timeout, $location, $sce, dataObject, smoothScroll) {
  'use strict';

  $scope.content = dataObject;
  $scope.primaryContent = [];
  $scope.custom = [];
  $scope.link = '';
  $scope.showTitle = true;
  $scope.customTitle = "Custom presentation";
  $scope.showExpanded = '';

  console.log($scope.content);

  // allow iframes and other html to be displayed
  $scope.trustAsHtml = $sce.trustAsHtml;

  // show section in the main content area
  $scope.showSections = function() {
    $scope.primaryContent = this;
    location.hash = "#";
    document.querySelector('.primary-content').scrollTop = 0;
    $scope.showMenu = false;
    $scope.showExpanded = '';
  };

  // show the parent section in the main content area and scroll down to subsection anchor
  $scope.showSubsection = function() {
    var me = this;
    $scope.primaryContent = this;
    $scope.showMenu = false;
    $scope.showExpanded = this.sub.subsection;

    // wait for menu to close and new content to load before smooth scrolling to subsection
    // setTimeout(function(){
    //   var element = document.getElementById(me.sub.subsection.toLowerCase());

    //   var options = {
    //       duration: 700,
    //       easing: 'easeInQuad',
    //       offset: 80,
    //       containerId: 'primary-content'
    //   }
    //   smoothScroll(element, options);
    // }, 300);
  };

  // show expanded view of card
  $scope.showDetails = function() {
    $scope.showExpanded = this.i.subsection;
  };

  // go to prev card
  $scope.goPrev = function() {
    $scope.showExpanded = this.$$prevSibling.i.subsection;
  };

  // go to next card
  $scope.goNext = function() {
    $scope.showExpanded = this.$$nextSibling.i.subsection;
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
    $scope.link += ('&title=' + $scope.customTitle.replace(/ /g,'-'));
    $scope.modalActive = true;
  };

  // remove an item from the custom array
  $scope.removeSection = function(item) {
    for (var n = 0; n < $scope.content.sections.length; n++) {
      for (var x = 0; x < $scope.content.sections[n].subsections.length; x++) {
        if ($scope.content.sections[n].subsections[x].subsection === item.i.subsection) {
          $scope.content.sections[n].subsections[x].disabled = false;
        }
      }
    }
    var index = $scope.custom.indexOf(item);
    $scope.custom.splice(index, 1);
  };

  $scope.saveCollection = function() {
    var newCollection = {};
    newCollection.title = $scope.customTitle;
    newCollection.slides = $scope.custom;
    newCollection.link = 'custom.html?custom=';
    for (var n = 0; n < $scope.custom.length; n++) {
      newCollection.link += ($scope.custom[n].i.subsection + ',');
    }
    newCollection.link += ('&title=' + $scope.customTitle.replace(/ /g,'-'));
    $scope.userCollections.push(newCollection);
    console.log('new', newCollection);
    console.log($scope.userCollections);
  };

  $scope.userCollections = [
    {
      title: 'Presentation 1',
      slides: [
        $scope.content.sections[0].subsections[0],
        $scope.content.sections[0].subsections[1],
        $scope.content.sections[1].subsections[1],
        $scope.content.sections[2].subsections[2]
      ],
      link: 'custom.html?custom=' + $scope.content.sections[0].subsections[0].subsection + ',' + $scope.content.sections[0].subsections[1] + ',' + $scope.content.sections[1].subsections[1] + ',' + $scope.content.sections[2].subsections[2] + '&title=Presentation-1'
    },
    {
      title: 'Custom 2',
      slides: [
        $scope.content.sections[2].subsections[2],
        $scope.content.sections[1].subsections[1],
        $scope.content.sections[2].subsections[3],
        $scope.content.sections[0].subsections[0]
      ],
      link: 'custom.html?custom=' + $scope.content.sections[2].subsections[2].subsection + ',' + $scope.content.sections[1].subsections[1] + ',' + $scope.content.sections[2].subsections[3] + ',' + $scope.content.sections[0].subsections[0] + '&title=Custom-2'
    }
  ];

}])

.controller('customController', ['$scope', '$location', '$sce', 'dataObject', function($scope, $location, $sce, dataObject) {
  'use strict';

  $scope.index = 1;
  $scope.fullscreenCounter = 0;
  $scope.content = dataObject;
  var subsections = [];
  var customContent = [];
  $scope.results = [];

  // set page title
  $scope.customTitle = "Custom presentation";
  $scope.customTitle = $location.search().title.replace(/-/g, ' ');

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

  // go to previous slide
  $scope.goPrev = function() {
    $scope.index = $scope.index > 1 ? $scope.index - 1 : 1;
  };

  // go to next slide
  $scope.goNext = function() {
    $scope.index = $scope.index < $scope.results.length ? $scope.index + 1 : $scope.results.length;
  };

  // change slides when pressing left or right keys
  $scope.key = function($event){
    if ($event.keyCode == 39)
        $scope.goNext();
    else if ($event.keyCode == 37)
        $scope.goPrev();
  }

  // make presentation fullscreen
  $scope.requestFullScreen = function() {
    var element = document.body
    // Supports most browsers and their versions.
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

    if (requestMethod) { // Native full screen.
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
  };

  if (document.addEventListener) {
    document.addEventListener('webkitfullscreenchange', exitHandler, false);
    document.addEventListener('mozfullscreenchange', exitHandler, false);
    document.addEventListener('fullscreenchange', exitHandler, false);
    document.addEventListener('MSFullscreenChange', exitHandler, false);
  }

  // show and hide fullscreen icon depending on whether window is fullscreen or not
  function exitHandler() {
    if (document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement !== null) {
      $scope.fullscreenCounter += 1;
      if ($scope.fullscreenCounter % 2 === 0) {
        angular.element(document.querySelector('.fullscreen')).removeClass('ng-hide');
      } else {
        angular.element(document.querySelector('.fullscreen')).addClass('ng-hide');
      }
    }
  }

}]);
