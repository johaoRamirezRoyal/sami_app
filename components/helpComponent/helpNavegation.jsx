import { Image, View, Text, Platform } from "react-native";
import { Appbar } from "react-native-paper";
import { TabBar, TabView } from "react-native-tab-view";
import {styles} from "../../styles/help/helpStyle";

import React, { useState } from "react";

export default function HelpNav({ navigation }) {
  // Definir los tabs y el estado
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Tab 1" },
    { key: "second", title: "Tab 2" },
  ]);

  // Renderizar el contenido de cada tab
  const renderScene = ({ route }) => {
    switch (route.key) {
      case "first":
        return <View style={styles.tabContent}><Text>Contenido del Tab 1</Text></View>;
      case "second":
        return <View style={styles.tabContent}><Text>Contenido del Tab 2</Text></View>;
      default:
        return null;
    }
  };

  return (
    <View style={styles.root}>
      {/* Barra de navegación superior flotante */}
      <Appbar.Header style={styles.appbar}>
        {/* Botón de Exit */}
        <Appbar.Action
          icon="account-arrow-left"
          onPress={() => {
            if (navigation && navigation.reset) {
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            } else if (navigation && navigation.navigate) {
              navigation.navigate("Login");
            }
          }}
          size={36}
        />
        {/* Logo completamente centrado */}
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            zIndex: -1,
          }}
        >
          {Platform.OS === 'web' ? (
            <img
              src={require('../../assets/logoroyal.png')}
              alt="Logo"
              style={{ width: 50, height: 50, objectFit: 'contain' }}
            />
          ) : (
            <Image
              source={require("../../assets/logoroyal.png")}
              style={styles.logoBar}
              resizeMode="contain"
            />
          )}
        </View>
      </Appbar.Header>

      {/* Contenido central con tabs */}
      <View style={styles.centerContent}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: 360 }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: "#004989" }}
              style={{ backgroundColor: "#fff" }}
              labelStyle={{ color: "#004989", fontWeight: "bold" }}
              activeColor="#004989"
              inactiveColor="#888"
              scrollEnabled
            />
          )}
        />
      </View>
    </View>
  );
}
