# react-window-infinite-loader

> InfiniteLoader component inspired by react-virtualized but for use with [react-window](https://github.com/bvaughn/react-window/)

## Install

package.json add

```json
"dependencies": {
    ...
    "react-window-infinite-loader": "ryokwkm/react-window-infinite-loader#master"

```

and yarn or npm install

## Documentation

get Position of displayed item by onScrollHandle !

react-window-infinite-loader で表示中のリストの位置を取得できるようにしました。

## Example usage


```js
const itemCount = 1000;

 <InfiniteLoader
      ...
      onScrollHandler={handleScroll}  << add
    >
  
  handleScroll = startIndex => {
    this.setState({ startIndex: startIndex })
  }
```

