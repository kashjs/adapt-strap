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
* Make your changes under master, test your code and commit
* Sync with upstream:
```
git fetch upstream
git checkout master
git merge upstream/master
```
* push your changes 
* go to your github account and under forked repo, submit the pull request
