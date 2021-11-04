# Aniuta

> The simplest Wrapper for custom refresh

![Aniuta logo](https://raw.githubusercontent.com/4twiggers/aniuta/master/aniuta.png)

## Installation

Use `yarn`

```sh
yarn add react-native-fresh-refresh
```

or `npm`

```sh
npm i -S react-native-fresh-refresh
```

Use only Animated lists or regular View

### Usage

## Step 1

Install

## Step 2

```jsx
import RefreshableWrapper from "react-native-fresh-refresh";
```

## step 3

Create Animated List or regular View to use pull to refresh

example:

```jsx
const AnimatedFlatlist = Animated.createAnimatedComponent(FlatList);
```

## Step 4

Wrap the component

example:

```jsx
<RefreshableWrapper
  Loader={() => (
    <LottieView
      style={styles.lottie}
      autoPlay
      source={require("./assets/lottie/refresh.json")}
    />
  )}
  isLoading={isLoading}
  onRefresh={() => {
    refreshHandler();
  }}
>
  <AnimatedFlatlist />
</RefreshableWrapper>
```

# Example

```jsx
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList, Dimensions } from "react-native";
import Animated from "react-native-reanimated";
import RefreshableWrapper from "react-native-fresh-refresh";
import LottieView from "lottie-react-native";

// ! If List is needed , should be Animated.{list}

// For View , there is no need of Animated.View

const AnimatedFlatlist = Animated.createAnimatedComponent(FlatList);
const data = ["1", "2", "3", "4", "5", "6"];
const { width } = Dimensions.get("screen");

const EmptyComponent = (props) => {
  return (
    <View>
      <Text>LIST EMPTY COMPONENT</Text>
    </View>
  );
};
const ListItem = (props) => {
  return (
    <View style={{ height: 200 }}>
      <Text>LIST Item COMPONENT</Text>
      <Text> {props.item}</Text>
    </View>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [listData, setListData] = useState([]);

  const refreshSimulationHandler = () => {
    setListData([]);
    setIsLoading(true);
    setTimeout(async () => {
      setListData(data);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}></View>
      <RefreshableWrapper
        Loader={() => (
          <LottieView
            style={styles.lottie}
            autoPlay
            source={require("./assets/lottie/refresh.json")}
          />
        )}
        isLoading={isLoading}
        onRefresh={() => {
          refreshSimulationHandler();
        }}
        EmptyComponent={EmptyComponent}
      >
        <AnimatedFlatlist
          data={listData}
          bounces={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            return <ListItem item={item} />;
          }}
          style={styles.scrollList}
          contentContainerStyle={styles.contenContainer}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          ListEmptyComponent={() => <EmptyComponent />}
        />
      </RefreshableWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: { width: "100%", height: 100, backgroundColor: "grey" },
  contenContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    paddingBottom: 100,
    alignItems: "center",
  },
  lottie: {
    width: 50,
    height: 50,
  },
  scrollList: { width, paddingTop: 20 },
});
```

> See more examples in ./example folder
