## Building the App

The __ENM Topic Curation Toolkit Frontend__ is built using gulp, with dependencies from __NPM__ (for the build scripts) and __Bower__ (for packages that are included in the frontend itself, such as angular and bootstrap).  

!!!note 
    This page describes the process of building the __ENM Topic Curation Toolkit Frontend__ from source.  Once built, the build directories contain all the necessary HTML, CSS, and Javascript to function as a standalone webapp, and can be deployed without any of the local dependencies required for our build scripts (in other words, without everything in node_modules).  The instructions on this page are about the requirements for _building_ the application, not requirements for _deployment_.  The app itself is self-contained once built.

## Requirements

The following software must be installed on the computer in order to run the build scripts:

- Node >= 7.7.0
- NPM >= 4.1.2
- Bower >= 1.8.0

Most installations of Node also include NPM. The instructions for installing Node are beyond the scope of this guide, but are avaialbe on the [Node.js webste](https://nodejs.org/en/). Once node and NPM are installed, you can install Bower with:

```bash
npm install -g bower
```

## Installing Dependencies

To install build dependencies from npm, type

```
npm install
```

In the same directory as the `package.json` file.  In the same directory, where `bower.json` is located, then type 

```
bower install
```

to install the bower dependencies.

## Building the project

The build scripts include the ability to create two versions of the __ENM Topic Curation Toolkit Frontend__:

1. __Development Version__: This version keeps the files separate and unminified.  Best for developing and debugging.  By default, this version is output into a folder `dist.dev`.

2. __Production Version__: This version concatenates and minifies all files.  Best for production use.  By default, this version is output into a folder `dist.prod`.

To build the development version of the app, use the following command:

```
gulp clean-build-app-dev
```

Similarly, to build the production version, type

```
gulp clean-build-app-prod
```

The build tools also include a development server for checking the work locally.  To both build the dev project _and_ start the development server, type

```
gulp watch-dev
```

By default, you can access the development server at `localhost:9000`.  The `gulp watch-dev` command will also watch for source file changes and rebuild whenever changes are made as long as the development server is running. If you use [LiveReload](http://livereload.com/) it will also automatically refresh the code in the browser for you.  You can similarly start the development server with the production version of the app with

```
gulp watch-prod
```

