import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import PercentageCircle from 'react-native-expo-circle-progress';
import { Users, UserCog, UserPlus } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const kpiData = [
  { label: 'Empleados activos', value: 125, icon: Users },
  { label: 'Supervisores activos', value: 5, icon: UserCog },
  { label: 'Usuarios de mi área', value: 130, icon: UserPlus },
];

const proyectos = [
  'Infraestructura de base de datos',
  'Cambios generales DayLog',
  'Infraestructura de base de datos',
  'Infraestructura de base de datos',
  'Infraestructura de base de datos',
  'Infraestructura de base de datos',
];

const windowHeight = Dimensions.get('window').height;

export default function DashboardPortfolioScreen({ navigation }) {
  return (
    <View style={styles.screenContainer}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInUp.duration(500)} style={styles.headerRow}>
          <Text style={styles.headerTitle}>DayLog</Text>
          <TouchableOpacity style={styles.profileCircle} onPress={() => navigation && navigation.navigate('DashboardSupervisor')}>
            {/* Aquí podrías poner un icono de perfil */}
          </TouchableOpacity>
        </Animated.View>
        {/* Bienvenida */}
        <Animated.View entering={FadeInUp.delay(100).duration(500)} style={styles.welcomeRow}>
          <Text style={styles.welcomeText}>Bienvenido/a</Text>
          <Text style={styles.userCode}>KCJ34M</Text>
        </Animated.View>
        {/* KPIs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.kpiScroll}
          contentContainerStyle={styles.kpiScrollContent}
        >
          {kpiData.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Animated.View
                key={idx}
                entering={FadeInUp.delay(200 + idx * 100).duration(500)}
                style={styles.kpiCard}
              >
                <Text style={styles.kpiLabel}>{item.label}</Text>
                <View style={styles.kpiIconRow}>
                  <Icon color="#FFD600" size={32} style={styles.kpiIcon} />
                  <Text style={styles.kpiValue}>{item.value}</Text>
                </View>
              </Animated.View>
            );
          })}
        </ScrollView>
        {/* Gráfico circular */}
        <Animated.View entering={FadeInUp.delay(500).duration(500)} style={styles.circleCard}>
          <View style={styles.circleChartWrapper}>
            <PercentageCircle
              radius={60}
              percent={80}
              color={'#FFD600'}
              bgColor={'#232627'}
              innerColor={'#232627'}
              borderWidth={10}
            >
              <Text style={styles.circlePercent}>80%</Text>
            </PercentageCircle>
          </View>
          <Text style={styles.circleTitle}>Rendimiento de tu área</Text>
          <Text style={styles.circleSubtitle}>Promedio de rendimiento en tu área</Text>
        </Animated.View>
        {/* Proyectos activos */}
        <Animated.View entering={FadeInUp.delay(700).duration(500)} style={[styles.projectsCard, { minHeight: proyectos.length === 0 ? 100 : undefined }]}>
          <Text style={styles.projectsTitle}>Proyectos activos</Text>
          <View style={styles.projectsListContainer}>
            {proyectos.length === 0 ? (
              <View style={styles.noProjectsContainer}>
                <Text style={styles.noProjectsText}>No tienes proyectos activos aún</Text>
              </View>
            ) : (
              proyectos.map((item, idx) => (
                <Animated.View
                  key={idx}
                  entering={FadeInUp.delay(800 + idx * 80).duration(400)}
                  style={styles.projectItem}
                >
                  <Text style={styles.projectText}>{item}</Text>
                </Animated.View>
              ))
            )}
          </View>
        </Animated.View>
        {/* Espacio inferior */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#141718',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 32,
    paddingBottom: 24,
    minHeight: windowHeight,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#232627',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 16,
  },
  welcomeText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
  },
  userCode: {
    color: '#FFD600',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  kpiScroll: {
    marginTop: 8,
    paddingLeft: 16,
    marginBottom: 16,
  },
  kpiScrollContent: {
    gap: 16,
    paddingRight: 16,
  },
  kpiCard: {
    backgroundColor: '#232627',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginRight: 16,
    minWidth: 150,
    width: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  kpiLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'left',
  },
  kpiIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-start',
  },
  kpiIcon: {
    marginRight: 2,
  },
  kpiValue: {
    color: 'white',
    fontSize: 34,
    fontWeight: 'bold',
    marginLeft: 'auto',
  },
  circleCard: {
    backgroundColor: '#232627',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  circleChartWrapper: {
    backgroundColor: '#232627',
    borderRadius: 100,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circlePercent: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  circleTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  circleSubtitle: {
    color: '#C2C3CB',
    fontSize: 16,
    marginTop: 4,
  },
  projectsCard: {
    backgroundColor: '#232627',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 24,
    padding: 24,
  },
  projectsTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  projectsListContainer: {
    // Elimina la altura máxima para que la card crezca automáticamente
  },
  projectItem: {
    backgroundColor: '#3A3D40',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  projectText: {
    color: 'white',
    fontSize: 16,
  },
  noProjectsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 60,
  },
  noProjectsText: {
    color: '#C2C3CB',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
