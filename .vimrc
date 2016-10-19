let g:ctrlp_custom_ignore = '\.git$\|\.tmp$\|\.work$\|node_modules$'

let test#javascript#runner = 'ava'
let test#javascript#mocha#executable = 'AWS_PROFILE=trackerbot ./node_modules/.bin/mocha'

