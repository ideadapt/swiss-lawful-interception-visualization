![build status](https://travis-ci.org/ideadapt/swiss-lawful-interception-visualization.svg?branch=master)

Setup
===

Install NPM (Node.js Package Manager)
http://nodejs.org/download/

Run in terminal:

```
yarn global add install grunt-cli
yarn global add install jshint
yarn global add install browserify
yarn install
```


Build
===

Builds the client and puts all files into dist folder. Use the dist folder as website root.


```
grunt build
```

Development, Live Preview
===

Builds dev client, starts web server, watch changes, preview in browser


```
grunt serve
```

or to create a staging build, which can be load using /sliv path, e.g. localhost:8080/sliv.

```
grunt build:staging
```

after translations csv changed, use


```
grunt i18n:compile
```

to create json representation. Then reload page; reload is done automatically during grunt serve.

