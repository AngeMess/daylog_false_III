import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Folder } from 'lucide-react-native';

const proyectos = [
  { nombre: 'Desarrollo de aplicación', fecha: '30 - Abril - 2025', estado: 'En proceso' },
  { nombre: 'Desarrollo de aplicación', fecha: '30 - Abril - 2025', estado: 'Finalizado' },
  { nombre: 'Desarrollo de aplicación', fecha: '30 - Abril - 2025', estado: 'Finalizado' },
  { nombre: 'Desarrollo de aplicación', fecha: '30 - Abril - 2025', estado: 'Pendiente' },
];

const estadoColor = {
  'En proceso': '#FFD600',
  'Finalizado': '#2D5FFF',
  'Pendiente': '#C2C3CB',
};

export default function ProyectosSupervisorScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Proyectos a cargo</Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {proyectos.map((proy, idx) => (
          <View key={idx} style={styles.card}>
            <View style={styles.iconoContainer}>
              <Folder color="#fff" size={36} />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.nombre}>{proy.nombre}</Text>
              <Text style={styles.fechaLabel}>Fecha de entrega</Text>
              <Text style={styles.fecha}>{proy.fecha}</Text>
            </View>
            <Text style={[styles.estado, { color: estadoColor[proy.estado] || '#C2C3CB' }]}>{proy.estado}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141718',
    paddingTop: 24,
    paddingHorizontal: 0,
  },
  titulo: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 16,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#232627',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    marginHorizontal: 12,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  iconoContainer: {
    marginRight: 16,
    backgroundColor: 'transparent',
  },
  infoContainer: {
    flex: 1,
  },
  nombre: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  fechaLabel: {
    color: '#C2C3CB',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  fecha: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 0,
  },
  estado: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 12,
  },
}); 