# FREAME SEQUENCER
[![Build Status](http://img.shields.io/travis/mohayonao/frame-sequencer.svg?style=flat-square)](https://travis-ci.org/mohayonao/frame-sequencer)
[![NPM Version](http://img.shields.io/npm/v/@mohayonao/frame-sequencer.svg?style=flat-square)](https://www.npmjs.org/package/@mohayonao/frame-sequencer)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://mohayonao.mit-license.org/)

> frame sequencer

## API
### FrameSequencer
- `constructor()`

#### Instance methods
- `add(element: FrameElement): boolean`
- `remove(element: FrameElement): boolean`
- `removeAll(): void`
- `update(t0: number, t1: number): void`
- `onResume(t0: number, t1: number): void`
- `onStartElement(element: FrameElement): void`
- `onStopElement(element: FrameElement): void`
- `onPause(t0: number, t1: number): void`

### FrameElement
- ` constructor(opts = {})`

#### Instance attributes
- `layer: number`
- `startTime: number`
- `stopTime: number`
- `parameters: object`

#### Instance methods
- `stateAtTime(time: number): string`
- `init(): void`
- `update(t0: number, t1: number): any[]`
- `dispose(): void`

## License
MIT
