# Fliplet Interactive Map

**Please note: this widget requires you to run the gulp watcher during development to compile the source files as you save.**

To develop widgets, please follow our [widget development guide](http://developers.fliplet.com).

---

Install dependencies:

```
$ npm install fliplet-cli -g
```

---

Clone and run for development:

```
$ git clone https://github.com/Fliplet/fliplet-widget-interactive-map.git
$ cd fliplet-widget-interactive-map

$ fliplet run
```

Installing gulp, webpack and its plugins:

```
$ npm install
```

**Running gulp to continuously build ES6 into JS**:

```
$ npm run watch
```

Note: this component requires `com.fliplet.interactive-map` to be the prefix of the widget.json `package` name, e.g. when making changes to it just add a suffix like `com.fliplet.interactive-map.foo-bar`.