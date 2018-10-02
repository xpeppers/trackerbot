# Trackerbot

[![Build Status](https://travis-ci.org/xpeppers/trackerbot.svg?branch=master)](https://travis-ci.org/xpeppers/trackerbot)

### Docker notes

Build it:
```
$ docker build -t trackerbot .
```

Run it interactive:
```
$ docker run --rm -itv $(pwd):/app --name tb trackerbot
```

Run tests inside the container:
```
$ npm test test/offline
$ AWS_ACCESS_KEY_ID=[YOUR_AWS_ACCESS_KEY_ID] AWS_SECRET_ACCESS_KEY=[YOUR_AWS_SECRET_ACCESS_KEY] AWS_REGION=us-east-1 npm t
```
