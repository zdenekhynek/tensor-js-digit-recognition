# Tensorflow.js digit recognition

A demonstration of using decapitated mobilenet for a digit recognition on the custom dataset.

![Full image](screenshot-1.jpg)

We're interested in finding out top-right-most number. 

![Digit](screenshot-2.jpg)

## Requirements

- node
- npm

## Installation

```
npm i
```

## Usage

Run:

```
npm run dev
```

Then open your browser and go to:

```
http://localhost:1234/train
```

After the model finishes the training, two json files should be automatically downloaded
by your browser: `pretrained-model.json` and `pretrained-model.weights.bin`. 

![Train](screenshot-3.jpg)

Move these two files into the `dist/model` folder and then go to:

```
http://localhost:1234/test
```

After a bit of waiting you should be able to see the results of the training

![Test](screenshot-4.jpg)


If you wanted to see the generator of the testing data, you can go to:

```
http://localhost:1234/generate
```

![Generate](screenshot-5.jpg)


## Built With

* Tensorflow.js
* React
* Parcel

## Authors

* **Zdenek Hynek** - zdenek.hynek@gmail.com