import LottieView from "lottie-react-native";
import React, { Children, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  Text,
  Button,
  ActivityIndicator,
} from "react-native";
import {
  PanGestureHandler,
  NativeViewGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("screen");

const AnimatedFlatlist = Animated.createAnimatedComponent(FlatList);
const REFRESH_HEIGHT = height * 0.5;

const Refreshable = ({
  data = ["1", "2", "3", "4", "5", "6"],
  isRefreshingOuter,
  onRefresh,
  EmptyComponent,
  emptyLottieAnimation,
  lottieAnimation,
  ListItem,
  List,
  children,
  Loader,
  Component,
  customProps,
}) => {
  const panRef = useRef();
  const listRef = useRef();
  const listWrapperRef = useRef();
  const isRefreshing = useSharedValue(false);
  const loaderOffsetY = useSharedValue(0);
  const listContentOffsetY = useSharedValue(0);
  const isLoaderActive = useSharedValue(false);
  const top = useSharedValue(0);

  const AnimatedComponent = useRef(
    Animated.createAnimatedComponent(Component)
  ).current;

  const UserCompoment = children;

  useEffect(() => {
    if (!isRefreshingOuter) {
      loaderOffsetY.value = withTiming(0);
      isRefreshing.value = withTiming(false);
      isLoaderActive.value = false;
    }
  }, [isRefreshingOuter]);

  const onListScroll = useAnimatedScrollHandler((event) => {
    console.log("12313123-----2--32--2-", event.contentOffset.y);
    // listContentOffsetY.value = event.contentOffset.y;
  });

  const onPanGestureEvent = useAnimatedGestureHandler({
    onStart: (_) => {},
    onActive: (event, _) => {
      isLoaderActive.value = loaderOffsetY.value > 0;

      if (
        ((listContentOffsetY.value <= 0 && event.velocityY >= 0) ||
          isLoaderActive.value) &&
        !isRefreshing.value
      ) {
        loaderOffsetY.value = event.translationY;
      }
    },
    onEnd: (_) => {
      if (!isRefreshing.value) {
        if (loaderOffsetY.value >= REFRESH_HEIGHT && !isRefreshing.value) {
          isRefreshing.value = true;
          runOnJS(onRefresh)();
        } else {
          isLoaderActive.value = false;
          loaderOffsetY.value = withTiming(0);
        }
      }
    },
  });

  const loaderAnimation = useAnimatedStyle(() => {
    return {
      position: "absolute",
      alignSelf: "center",
      opacity: isLoaderActive.value
        ? isRefreshing.value
          ? withTiming(1)
          : interpolate(loaderOffsetY.value, [0, REFRESH_HEIGHT], [0.1, 0.5])
        : withTiming(0.1),
      transform: [
        {
          translateY: isLoaderActive.value
            ? interpolate(
                loaderOffsetY.value,
                [0, REFRESH_HEIGHT - 50],
                [-10, 10],
                Extrapolate.CLAMP
              )
            : withTiming(-10),
        },
        {
          scale: isLoaderActive.value ? withSpring(1) : withTiming(0.01),
        },
      ],
    };
  });

  const overscrollAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: isLoaderActive.value
            ? isRefreshing.value
              ? withTiming(50)
              : interpolate(
                  loaderOffsetY.value,
                  [0, REFRESH_HEIGHT],
                  [0, 80],
                  Extrapolate.CLAMP
                )
            : withTiming(0),
        },
      ],
    };
  });

  return (
    <View style={{ flex: 1 }}>
      <PanGestureHandler
        ref={panRef}
        simultaneousHandlers={listWrapperRef}
        onGestureEvent={onPanGestureEvent}
      >
        <Animated.View style={[{ flex: 1 }, overscrollAnimation]}>
          <NativeViewGestureHandler
            ref={listWrapperRef}
            simultaneousHandlers={panRef}
          >
            {/* <AnimatedComponent
              onScroll={onListScroll}
              bounces={false}
              {...customProps}
            /> */}
            {React.cloneElement(children, {
              onScroll: onListScroll,
            })}
          </NativeViewGestureHandler>
        </Animated.View>
      </PanGestureHandler>
      <Animated.View style={[loaderAnimation]}>
        {/* <LottieView
          style={{
            width: 50,
            height: 50,
          }}
          autoPlay
          source={lottieAnimation}
        /> */}
        <Loader />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  contenContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
});

const RefreshableFlatList = (props) => {
  return (
    <Refreshable
      customProps={props}
      onRefresh={props.onRefresh}
      Component={FlatList}
    />
  );
};

export { Refreshable, RefreshableFlatList };
