import { Image, View, Text, Platform, ScrollView } from "react-native";
import YoutubePlayer from 'react-native-youtube-iframe';
import { Appbar } from "react-native-paper";
import { TabBar, TabView } from "react-native-tab-view";
import {styles} from "../../styles/help/helpStyle";
import React, { useState } from "react";

// Componente principal de navegación de ayuda
export default function HelpNav({ navigation }) {
  // Estado para el índice del tab activo y definición de tabs
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Sobre S.A.M.I app" },
    { key: "second", title: "Como reservar salones y subir firma digital" },
    { key: "third", title: "Como reportar un artículo" },
  ]);

  // Renderiza el contenido correspondiente a cada tab
  const renderScene = ({ route }) => {
    switch (route.key) {
      case "first":
        return <AboutRoute />;
      case "second":
        return <ReservaRoute />;
      case "third":
        return <ReporteRoute />;
      default:
        return null;
    }
  };

  // --- Tab 1: Sobre S.A.M.I app ---
  const aboutText1 =
    'es un software en la nube que apoya la gestión administrativa y académica para instituciones educativas, permitiendo generar un impacto positivo en el crecimiento y desarrollo de sus procesos internos.';
  const aboutText2 =
    'Contamos con los siguientes módulos para instituciones educativas:';
  const aboutModules = [
    'Reservas',
    'lis. Inventario',
    'impuntualidad',
  ];
  const aboutText3 =
    'permite trabajar de manera fácil, ya que su diseño se encuentra estructurado a través de módulos que permite ubicar de manera rápida las funciones asignadas para cada usuario.';

  // Componente para el tab "Sobre S.A.M.I app"
  function AboutRoute() {
    return (
      <ScrollView contentContainerStyle={styles.tabContent}>
        <Text style={styles.h5}>
          <Text style={styles.bold}>S.A.M.I app</Text> {aboutText1}
        </Text>
        <Text style={styles.h5}>{aboutText2}</Text>
        <Text style={styles.h5}>
          {/* Lista de módulos */}
          {aboutModules.map((mod, idx) => `\u2022 ${mod}${idx < aboutModules.length - 1 ? '\n' : ''}`).join('')}
        </Text>
        <Text style={styles.h5}>
          El diseño de <Text style={styles.bold}>S.A.M.I app</Text> {aboutText3}
        </Text>
      </ScrollView>
    );
  }

  // --- Tab 2: Como reservar salones y subir firma digital ---
  const reservaVideoId = 'IOMMDNfJc90';

  // Componente para el tab de reserva de salones
  function ReservaRoute() {
    return (
      <ScrollView contentContainerStyle={styles.tabContent}>
        <Text style={styles.h5}>Video tutorial:</Text>
        <View style={styles.videoContainer}>
          {/* Video de YouTube embebido */}
          <YoutubePlayer
            height={220}
            play={false}
            videoId={reservaVideoId}
          />
        </View>
      </ScrollView>
    );
  }

  // --- Tab 3: Como reportar un artículo ---
  const reporteVideoId = 'avNv20RghEk';

  // Componente para el tab de reporte de artículos
  function ReporteRoute() {
    return (
      <ScrollView contentContainerStyle={styles.tabContent}>
        <Text style={styles.h5}>Video tutorial:</Text>
        <View style={styles.videoContainer}>
          {/* Video de YouTube embebido */}
          <YoutubePlayer
            height={220}
            play={false}
            videoId={reporteVideoId}
          />
        </View>
      </ScrollView>
    );
  }

  // Render principal del componente con TabView
  return (
    <View style={styles.root}>
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

