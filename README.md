# Trackerbot

[![Build Status](https://travis-ci.org/xpeppers/trackerbot.svg?branch=master)](https://travis-ci.org/xpeppers/trackerbot)

### Docker notes

Build it:
```
$ docker build -t trackerbot . 
```
Run it interactive:
```
$ docker run -itv $(pwd):/app --name tb trackerbot
```
Run tests inside the container:
```
$ npm run test
```
