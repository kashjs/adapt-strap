## adaptStrap lightweight UI Components/utilities based on AngularJs 1.2+ & Bootstrap 3 - [demo](http://adaptv.github.io/adapt-strap/)
[![Build Status](https://travis-ci.org/Adaptv/adapt-strap.svg)](https://travis-ci.org/Adaptv/adapt-strap)
---
### Available components/features:
- **Table Lite** - simple table UI that renders your local data models and does local pagination/sorting
- **Table AJAX** - advanced table UI that renders remote data models and does remote pagination/sorting
- **Tree Browser** - simple tree UI that allows you to brows through local data models in a tree structure
- **Loading Indicators** - simple directives to render overlay and inline loading indicators
- **Global configuration** - all the components are globally configurable to use your set of icons and pagination/sorting configuration
- **Customizable** - all the components are highly customizable.

###Usage
* Install the library using `bower install adapt-strap --save`
* Include the library files in your index.html file:
```
<script src="bower_components/adapt-strap/dist/adapt-strap.min.js"></script>
<script src="bower_components/adapt-strap/dist/adapt-strap.tpl.min.js"></script>
<link rel="stylesheet" href="bower_components/adapt-strap/dist/adapt-strap.min.css"/>
```
* Add adaptv.adaptStrap module as a dependency to you main app module:
```
angular.module('myApp', [
    'ngSanitize', // adapt-strap requires ngSanitize
    'adaptv.adaptStrap'
]);
```
* Read the [documentation](http://adaptv.github.io/adapt-strap/) to see the demo and usage of components

###Developers one time seup:
* Fork the repo under your github account and clone it locally
* Configure upstream:
```
git remote add upstream https://github.com/Adaptv/adapt-strap.git
```

###Developers Contribute:
* Sync with upstream:
```
git fetch upstream
git checkout master
git merge upstream/master
```

* install local packages
```
npm install
bower install
```

* run local environment. It will watch for changes and re-build
```
gulp
```
* your local dev is running at `http://localhost:9003`
* you can force local build by `gulp dist`

* Make your changes under master. Also write/modify tests under src/xyz/test directory.

* run validators and tests before commit and fix html, and js errors.
```
gulp dist
gulp validate
gulp unit
```

* push your changes 
* go to your github account and under forked repo, submit the pull request
