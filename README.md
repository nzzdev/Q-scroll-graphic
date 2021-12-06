# Q-scroll-graphic [![Build Status](https://travis-ci.com/nzzdev/Q-scroll-graphic.svg?branch=dev)](https://travis-ci.com/nzzdev/Q-scroll-graphic)

**maintainer**: [manuelroth](https://github.com/manuelroth)

Q scroll graphic is one tool of the Q toolbox to create a visual element where the graphic is fixed to the viewport and the text scrolls on top of the graphic. See a more details definition of a scroll graphic in [our styleguide](https://nzzdev.github.io/Storytelling-Styleguide/#/grafikabfolge).

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
Example: `https://example.com/{key}?width={width}&format={format}`

## Development

Start the Q dev server:

```
npx @nzz/q-cli server
```

Run the Q tool:

```
npm run dev
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

This tool was built using [Svelte](https://svelte.dev/). The title, subtitle and footer are rendered on server side. The scroll graphic is rendered on client side. The [svelte-scroller](https://github.com/sveltejs/svelte-scroller) component is used to keep track of the steps.

#### Features

A scroll graphic consists of multiple steps. Each step has multiple graphic variants, a text and highlighted texts. Highlighted texts can be used to highlight sections of the text. There are multiple highlight types to choose from background, underline and bold. The highlight colors are defined in a separate array. Colors are referenced using the index of the color in the array. See the example graphic below:

```json
{
  "title": "FIXTURE: Two variants per step and highlighted text",
  "subtitle": "Subtitle",
  "steps": [
    {
      "variants": [
        {
          "asset": {
            "url": "..."
          }
        },
        {
          "minWidth": 500,
          "asset": {
            "url": "..."
          }
        }
      ],
      "text": "So kennen Sie die Schweiz mit ihren 26 Kantonen. Würde man die Grenzen jedoch anhand von Facebook-Freundschaften neu ziehen, ergäbe sich, je nach Kanton, ein ganz anderes Bild.",
      "highlightedTexts": [
        {
          "type": "background", // one of background, underline and bold
          "preventLineBreak": false,
          "text": "Schweiz",
          "color": 0
        }
      ]
    }
  ],
  "highlightedTextColors": [
    {
      "color": "#3852EE"
    }
  ]
}
```

[to the top](#table-of-contents)

### Options

#### disableAnimation

This is a `boolean` and it can be used to disable the animation effect when switching between images.

#### displayOptions

##### hideTitle

If checked, the title is not rendered.

[to the top](#table-of-contents)

## License

Copyright (c) Neue Zürcher Zeitung. All rights reserved.

This software is published under the MIT license.
