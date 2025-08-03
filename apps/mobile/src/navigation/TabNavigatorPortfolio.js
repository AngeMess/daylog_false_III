import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, ClipboardList, Folder, LineChart } from 'lucide-react-native';
import DashboardPortfolioScreen from '../roles/portfolio/screens/DashboardPortfolioScreen';
import DashboardSupervisorScreen from '../roles/supervisor/screens/DashboardSupervisorScreen';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';

const Tab = createBottomTabNavigator();

function GlowIcon({ IconComponent, focused, color, size }) {
  const glow = useSharedValue(focused ? 1 : 0);
  React.useEffect(() => {
    glow.value = withTiming(focused ? 1 : 0, { duration: 400 });
  }, [focused]);
  const animatedStyle = useAnimatedStyle(() => ({
    shadowColor: '#FFD600',
    shadowOpacity: glow.value * 0.8,
    shadowRadius: glow.value * 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: glow.value * 8,
  }));
  return (
    <Animated.View style={[styles.iconWrapper, animatedStyle]}>
      <IconComponent color={focused ? '#FFD600' : color} size={22} />
      {focused && <View style={styles.glowBar} />}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  glowBar: {
    height: 3,
    width: 20,
    backgroundColor: '#FFD600',
    borderRadius: 2,
    marginTop: 2,
    shadowColor: '#FFD600',
    shadowOpacity: 0.7,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
});

// HOC para inyectar navigation a la foto de perfil
function withProfileNavigation(WrappedComponent) {
  return function (props) {
    const { navigation } = props;
    return <WrappedComponent {...props} navigation={navigation} />;
  };
}

// Modifica DashboardPortfolioScreen para que la foto navegue al dashboard de supervisor
function DashboardPortfolioWithProfileNav(props) {
  const { navigation } = props;
  return <DashboardPortfolioScreen navigation={navigation} />;
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          marginHorizontal: 32,
          bottom: 24,
          backgroundColor: '#232627',
          height: 54,
          borderRadius: 22,
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          flexDirection: 'row',
          alignItems: 'center',
        },
        tabBarItemStyle: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let IconComponent;
          if (route.name === 'DashboardPortfolio') IconComponent = Home;
          else if (route.name === 'Tareas') IconComponent = ClipboardList;
          else if (route.name === 'Proyectos') IconComponent = Folder;
          else if (route.name === 'Graficos') IconComponent = LineChart;
          return <GlowIcon IconComponent={IconComponent} focused={focused} color={color} size={22} />;
        },
        tabBarActiveTintColor: '#FFD600',
        tabBarInactiveTintColor: '#fff',
      })}
    >
      <Tab.Screen name="DashboardPortfolio" options={{
        headerShown: false,
      }}>
        {props => <DashboardPortfolioScreen {...props} />}
      </Tab.Screen>
      <Tab.Screen name="Tareas" component={DashboardPortfolioScreen} />
      <Tab.Screen name="Proyectos" component={DashboardPortfolioScreen} />
      <Tab.Screen name="Graficos" component={DashboardPortfolioScreen} />
    </Tab.Navigator>
  );
} 
