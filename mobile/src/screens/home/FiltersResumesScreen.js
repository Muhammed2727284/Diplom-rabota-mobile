import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';
import { EMPLOYMENT_TYPES, WORK_FORMATS, getEmploymentLabel, getWorkFormatLabel } from '../../utils/enums';

const FiltersResumesScreen = ({ navigation, route }) => {
  const initial = route.params?.filters || {};
  const [city, setCity] = useState(initial.city || '');
  const [position, setPosition] = useState(initial.position || '');
  const [salaryFrom, setSalaryFrom] = useState(initial.salary_from?.toString() || '');
  const [employmentType, setEmploymentType] = useState(initial.employment_type || '');
  const [workFormat, setWorkFormat] = useState(initial.work_format || '');

  const apply = () => {
    const filters = {};
    if (city.trim()) filters.city = city.trim();
    if (position.trim()) filters.position = position.trim();
    if (salaryFrom) filters.salary_from = salaryFrom;
    if (employmentType) filters.employment_type = employmentType;
    if (workFormat) filters.work_format = workFormat;
    navigation.navigate('Home', { resumeFilters: filters });
  };

  const reset = () => {
    setCity('');
    setPosition('');
    setSalaryFrom('');
    setEmploymentType('');
    setWorkFormat('');
    navigation.navigate('Home', { resumeFilters: {} });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Город</Text>
      <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="Введите город" placeholderTextColor={COLORS.textLight} />

      <Text style={styles.label}>Должность</Text>
      <TextInput style={styles.input} value={position} onChangeText={setPosition} placeholder="Введите должность" placeholderTextColor={COLORS.textLight} />

      <Text style={styles.label}>Зарплата от</Text>
      <TextInput style={styles.input} value={salaryFrom} onChangeText={setSalaryFrom} placeholder="Минимальная зарплата" placeholderTextColor={COLORS.textLight} keyboardType="numeric" />

      <Text style={styles.label}>Тип занятости</Text>
      <View style={styles.chips}>
        {EMPLOYMENT_TYPES.map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.chip, employmentType === t && styles.chipActive]}
            onPress={() => setEmploymentType(employmentType === t ? '' : t)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, employmentType === t && styles.chipTextActive]}>
              {getEmploymentLabel(t)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Формат работы</Text>
      <View style={styles.chips}>
        {WORK_FORMATS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.chip, workFormat === f && styles.chipActive]}
            onPress={() => setWorkFormat(workFormat === f ? '' : f)}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, workFormat === f && styles.chipTextActive]}>
              {getWorkFormatLabel(f)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.resetBtn} onPress={reset} activeOpacity={0.7}>
          <Text style={styles.resetText}>Сбросить</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyBtn} onPress={apply} activeOpacity={0.7}>
          <Text style={styles.applyText}>Применить</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: 40 },
  label: { ...FONTS.bold, marginTop: SPACING.lg, marginBottom: SPACING.sm, fontSize: 14 },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 48,
    fontSize: 15,
    color: COLORS.text,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.gray100,
    borderWidth: 1.5,
    borderColor: COLORS.gray200,
  },
  chipActive: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary },
  chipText: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' },
  chipTextActive: { color: COLORS.primary, fontWeight: '600' },
  buttons: { flexDirection: 'row', marginTop: SPACING.xl + 8, gap: SPACING.sm },
  resetBtn: {
    flex: 1,
    height: 52,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetText: { ...FONTS.medium, color: COLORS.textSecondary, fontWeight: '600' },
  applyBtn: {
    flex: 1,
    height: 52,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: { ...FONTS.medium, color: COLORS.white, fontWeight: '700' },
});

export default FiltersResumesScreen;
