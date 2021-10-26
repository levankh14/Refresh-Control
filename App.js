import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, FlatList, Dimensions } from "react-native";
import Animated from "react-native-reanimated";
import Refreshable from "./components/refreshControl/FeedList";
import LottieView from "lottie-react-native";

const AnimatedFlatlist = Animated.createAnimatedComponent(FlatList);
const data = ["1", "2", "3", "4", "5", "6"];
const { width, height } = Dimensions.get("screen");

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

  const ref = useRef();
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
      <View
        style={{ width: "100%", height: 100, backgroundColor: "grey" }}
      ></View>
      <Refreshable
        Loader={() => (
          <LottieView
            style={{
              width: 50,
              height: 50,
            }}
            autoPlay
            source={require("./assets/lottie/refresh.json")}
          />
        )}
        isRefreshingOuter={isLoading}
        onRefresh={() => {
          refreshSimulationHandler();
        }}
        EmptyComponent={EmptyComponent}
      >
        <AnimatedFlatlist
          ref={ref}
          data={listData}
          bounces={true}
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
      </Refreshable>
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
  contenContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    paddingBottom: 100,
    alignItems: "center",
  },
  scrollList: { width, paddingTop: 20 },
});
