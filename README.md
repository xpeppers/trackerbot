(TODO)

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
$ ./node_modules/.bin/mocha
```
