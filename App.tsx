import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, SafeAreaView } from "react-native";
import Rive, { Alignment, Fit } from "rive-react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Canvas, Path } from "@shopify/react-native-skia";
interface IPath {
  segments: String[];
  color?: string;
}

export default function App() {
  const prompts = ["Cat", "House", "Tree", "Car", "Sun"];
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);
  const [paths, setPaths] = useState<IPath[]>([]);

  const pan = Gesture.Pan()
    .runOnJS(true)
    .onStart((g) => {
      const newPaths = [...paths];
      newPaths[paths.length] = {
        segments: [],
        color: "#06d6a0",
      };
      newPaths[paths.length].segments.push(`M ${g.x} ${g.y}`);
      setPaths(newPaths);
    })
    .onUpdate((g) => {
      const index = paths.length - 1;
      const newPaths = [...paths];
      if (newPaths?.[index]?.segments) {
        newPaths[index].segments.push(`L ${g.x} ${g.y}`);
        setPaths(newPaths);
      }
    })
    .minDistance(1);

  const clearCanvas = () => {
    setPaths([]);
    setShowAnimation(false);
    setCurrentPrompt("");
  };

  const startGame = () => {
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setCurrentPrompt(randomPrompt);
    setShowAnimation(true);
    setPaths([]);
  };

  const GestureDemo = () => {
    return (
      <GestureHandlerRootView style={styles.drawingArea}>
        <GestureDetector gesture={pan}>
          <View style={styles.drawingCanvas}>
            <Canvas style={{ flex: 8 }}>
              {paths.map((p, index) => (
                <Path
                  key={index}
                  path={p.segments.join(" ")}
                  strokeWidth={5}
                  style="stroke"
                  color={p.color}
                />
              ))}
            </Canvas>
          </View>
        </GestureDetector>
      </GestureHandlerRootView>
    );
  };

  const RiveDemo = () => {
    return (
      <Rive
        resourceName={currentPrompt}
        style={styles.sizeRive}
        fit={Fit.Contain}
        alignment={Alignment.Center}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pictionary Game</Text>
      {showAnimation && <RiveDemo />}
      {currentPrompt ? (
        <Text style={styles.prompt}>Draw: {currentPrompt}</Text>
      ) : (
        <Text style={styles.instructions}>Press Start to get a prompt!</Text>
      )}
      <GestureDemo />
      {showAnimation ? (
        <Button title="Clear" onPress={clearCanvas} />
      ) : (
        <Button title="Start Game" onPress={startGame} />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  prompt: {
    fontSize: 20,
    marginBottom: 20,
  },
  instructions: {
    fontSize: 16,
    marginBottom: 20,
  },
  drawingArea: {
    width: 350,
    height: 500,
    marginVertical: 10,
  },
  drawingCanvas: {
    flex: 1,
    backgroundColor: "#020202ff",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    padding: 10,
  },
  sizeRive: {
    width: 100,
    height: 100,
  },
});
