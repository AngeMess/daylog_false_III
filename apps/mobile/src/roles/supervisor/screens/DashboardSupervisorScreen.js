import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { CheckCircle, FolderCheck, FolderClock } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import LineChartSupervisor from '../components/LineChartSupervisor';
// Puedes importar tu gráfico y círculo de rendimiento aquí si los tienes como componentes reutilizables

const kpiData = [
  { label: 'Actividades completadas', value: 203, icon: CheckCircle },
  { label: 'Proyectos completados', value: 203, icon: FolderCheck },
  { label: 'Proyectos pendientes', value: 12, icon: FolderClock },
];

const windowHeight = Dimensions.get('window').height;

export default function DashboardSupervisorScreen() {
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
          <View style={styles.profileCircle} />
        </Animated.View>
        {/* Bienvenida */}
        <Animated.View entering={FadeInUp.delay(100).duration(500)} style={styles.welcomeRow}>
          <Text style={styles.welcomeText}>Bienvenido/a</Text>
          <Text style={styles.userCode}>KMJX12</Text>
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
        {/* Gráfico de estados de proyectos */}
        <Animated.View entering={FadeInUp.delay(500).duration(500)} style={styles.chartCard}>
          <Text style={styles.chartTitle}>Estados de tus proyectos</Text>
          <LineChartSupervisor />
          <View style={styles.chartLegendRow}>
            <View style={styles.legendItem}><View style={[styles.legendDot, {backgroundColor: '#FFD600'}]} /><Text style={styles.legendText}>Proyectos retrasados</Text></View>
            <View style={styles.legendItem}><View style={[styles.legendDot, {backgroundColor: '#2D5FFF'}]} /><Text style={styles.legendText}>Proyectos completos</Text></View>
          </View>
        </Animated.View>
        {/* Card de rendimiento del equipo */}
        <Animated.View entering={FadeInUp.delay(700).duration(500)} style={styles.performanceCard}>
          {/* Aquí deberías renderizar tu gráfico circular real */}
          <View style={styles.circleChartWrapper}>
            <View style={styles.circlePlaceholder}>
              <Text style={styles.circlePercent}>80%</Text>
            </View>
          </View>
          <Text style={styles.circleTitle}>Rendimiento del equipo</Text>
          <Text style={styles.circleSubtitle}>Promedio total</Text>
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
  chartCard: {
    backgroundColor: '#232627',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  chartTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  chartPlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: '#181A1B',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  chartLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    color: '#C2C3CB',
    fontSize: 14,
  },
  performanceCard: {
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
  circlePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 10,
    borderColor: '#FFD600',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#181A1B',
    marginBottom: 8,
  },
  circlePercent: {
    color: 'white',
    fontSize: 28,
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
}); 