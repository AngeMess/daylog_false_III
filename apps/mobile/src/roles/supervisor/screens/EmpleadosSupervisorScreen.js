import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { User, Filter, Search } from 'lucide-react-native';

const empleados = [
  { nombre: 'Christian Marín Sandoval Alessandro', cuscaId: 'CHM1287', pais: 'El Salvador' },
  { nombre: 'Christian Marín Sandoval Alessandro', cuscaId: 'CHM1287', pais: 'El Salvador' },
  { nombre: 'Christian Marín Sandoval Alessandro', cuscaId: 'CHM1287', pais: 'El Salvador' },
  { nombre: 'Christian Marín Sandoval Alessandro', cuscaId: 'CHM1287', pais: 'El Salvador' },
];

export default function EmpleadosSupervisorScreen() {
  const [search, setSearch] = useState('');
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.titulo}>Lista de Empleados</Text>
        <Filter color="#fff" size={28} style={{ marginTop: 8, marginRight: 8 }} />
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar"
            placeholderTextColor="#C2C3CB"
            value={search}
            onChangeText={setSearch}
          />
          <Search color="#C2C3CB" size={20} style={styles.searchIcon} />
        </View>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {empleados.map((emp, idx) => (
          <View key={idx} style={styles.card}>
            <User color="#fff" size={36} style={{ marginRight: 16 }} />
            <View style={styles.infoContainer}>
              <Text style={styles.nombre}>{emp.nombre}</Text>
              <View style={styles.rowDatos}>
                <Text style={styles.label}>CuscaID </Text>
                <Text style={styles.valor}>{emp.cuscaId}</Text>
                <Text style={styles.label}>   País </Text>
                <Text style={styles.valor}>{emp.pais}</Text>
              </View>
            </View>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    marginBottom: 12,
    marginRight: 8,
  },
  titulo: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    marginRight: 12,
    marginTop: 0,
    flex: 1.2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#232627',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginLeft: 8,
    flex: 2,
    height: 36,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  searchIcon: {
    marginLeft: 4,
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
  infoContainer: {
    flex: 1,
  },
  nombre: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
  },
  rowDatos: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  label: {
    color: '#C2C3CB',
    fontSize: 14,
    fontWeight: 'bold',
  },
  valor: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 12,
  },
}); 