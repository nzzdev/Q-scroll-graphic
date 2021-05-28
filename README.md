# Q-scroll-graphic [![Build Status](https://travis-ci.com/nzzdev/Q-scroll-graphic.svg?branch=dev)](https://travis-ci.com/nzzdev/Q-scroll-graphic)

**maintainer**: [manuelroth](https://github.com/manuelroth)

Short description of tool and link to either [demo](https://editor.q.tools/) or [playground](https://q-playground.st.nzz.ch).

## Table of contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Functionality](#functionality)
- [License](#license)

## Installation

```
git clone git@github.com:nzzdev/Q-scroll-graphic.git
cd ./Q-scroll-graphic
nvm use
npm install
npm run build
```

[to the top](#table-of-contents)

## Configuration

There is one env variable `IMAGE_SERVICE_URL` to be defined. It should contain a URL with 3 parameters that will get replaced before the URL is used to load the images.
`{key}` will be replaced by the string Q-server stored as the key when the file got uploaded through Q-servers `/file` endpoint provided by the [file plugin](https://github.com/nzzdev/Q-server/blob/dev/plugins/file/index.js)
`{width}` is replaced by the width the image should be loaded
`{format}` will be `png` or `webp`
Example: `https://q-images.nzz.ch/{key}?width={width}&format={format}`

## Development

Start the Q dev server:

```
npx @nzz/q-cli server
```

Run the Q tool:

```
node index.js
```

[to the top](#table-of-contents)

## Testing

The testing framework used in this repository is [Code](https://github.com/hapijs/code).

Run the tests:

```
npm run test
```

### Implementing a new test

When changing or implementing...

- A `route`, it needs to be tested in the `e2e-tests.js` file
- Something on the frontend, it needs to be tested in the `dom-tests.js` file

[to the top](#table-of-contents)

## Deployment

We provide automatically built docker images at https://hub.docker.com/r/nzzonline/q-scroll-graphic/.
There are three options for deployment:

- Use the provided images
- Build your own docker images
- Deploy the service using another technology

### Use the provided docker images

1. Deploy `nzzonline/q-scroll-graphic` to a docker environment
2. Set the ENV variables as described in the [configuration section](#configuration)

[to the top](#table-of-contents)

## Functionality

The tool structure follows the general structure of each Q tool. Further information can be found in [Q server documentation - Developing tools](https://nzzdev.github.io/Q-server/developing-tools.html).

Here are all features listed which will have an impact on the tool but are not options. For example spacing issues. If there's a visual aspect, a printscreen would be nice.

[to the top](#table-of-contents)

## License

Copyright (c) Neue Zürcher Zeitung. All rights reserved.

This software is published under the MIT license.
