import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet,
  Alert, ActivityIndicator, Switch,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';
import { getResumeDetail, updateResume } from '../../api/resumes';
import { EMPLOYMENT_TYPES, WORK_FORMATS, getEmploymentLabel, getWorkFormatLabel } from '../../utils/enums';

const EditResumeScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [title, setTitle] = useState('');
  const [position, setPosition] = useState('');
  const [city, setCity] = useState('');
  const [salaryFrom, setSalaryFrom] = useState('');
  const [salaryTo, setSalaryTo] = useState('');
  const [employmentType, setEmploymentType] = useState('FULL_TIME');
  const [workFormat, setWorkFormat] = useState('OFFICE');
  const [about, setAbout] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [education, setEducation] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadResume();
  }, []);

  const loadResume = async () => {
    try {
      const res = await getResumeDetail(id);
      const r = res.data;
      setTitle(r.title || '');
      setPosition(r.position || '');
      setCity(r.city || '');
      setSalaryFrom(r.salary_from ? String(r.salary_from) : '');
      setSalaryTo(r.salary_to ? String(r.salary_to) : '');
      setEmploymentType(r.employment_type || 'FULL_TIME');
      setWorkFormat(r.work_format || 'OFFICE');
      setAbout(r.about || '');
      setSkills(r.skills || '');
      setExperience(r.experience || '');
      setEducation(r.education || '');
      setIsPublished(r.is_published);
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось загрузить резюме');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !position.trim()) {
      Alert.alert('Ошибка', 'Заполните название и должность');
      return;
    }
    setSaving(true);
    try {
      await updateResume(id, {
        title: title.trim(),
        position: position.trim(),
        city: city.trim(),
        salary_from: salaryFrom ? parseInt(salaryFrom) : null,
        salary_to: salaryTo ? parseInt(salaryTo) : null,
        employment_type: employmentType,
        work_format: workFormat,
        about: about.trim(),
        skills: skills.trim(),
        experience: experience.trim(),
        education: education.trim(),
        is_published: isPublished,
      });
      Alert.alert('Успешно', 'Резюме обновлено');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось сохранить');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
      <Text style={styles.label}>Название <Text style={styles.required}>*</Text></Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Должность <Text style={styles.required}>*</Text></Text>
      <TextInput style={styles.input} value={position} onChangeText={setPosition} />

      <Text style={styles.label}>Город</Text>
      <TextInput style={styles.input} value={city} onChangeText={setCity} />

      <View style={styles.row}>
        <View style={styles.halfCol}>
          <Text style={styles.label}>Зарплата от</Text>
          <TextInput style={styles.input} value={salaryFrom} onChangeText={setSalaryFrom} keyboardType="numeric" />
        </View>
        <View style={styles.halfCol}>
          <Text style={styles.label}>Зарплата до</Text>
          <TextInput style={styles.input} value={salaryTo} onChangeText={setSalaryTo} keyboardType="numeric" />
        </View>
      </View>

      <Text style={styles.label}>Тип занятости</Text>
      <View style={styles.chips}>
        {EMPLOYMENT_TYPES.map(t => (
          <TouchableOpacity key={t} style={[styles.chip, employmentType === t && styles.chipActive]} onPress={() => setEmploymentType(t)} activeOpacity={0.7}>
            <Text style={[styles.chipText, employmentType === t && styles.chipTextActive]}>{getEmploymentLabel(t)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Формат работы</Text>
      <View style={styles.chips}>
        {WORK_FORMATS.map(f => (
          <TouchableOpacity key={f} style={[styles.chip, workFormat === f && styles.chipActive]} onPress={() => setWorkFormat(f)} activeOpacity={0.7}>
            <Text style={[styles.chipText, workFormat === f && styles.chipTextActive]}>{getWorkFormatLabel(f)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>О себе</Text>
      <TextInput style={[styles.input, styles.textArea]} value={about} onChangeText={setAbout} multiline textAlignVertical="top" />

      <Text style={styles.label}>Навыки</Text>
      <TextInput style={[styles.input, styles.textArea]} value={skills} onChangeText={setSkills} multiline textAlignVertical="top" />

      <Text style={styles.label}>Опыт работы</Text>
      <TextInput style={[styles.input, styles.textArea]} value={experience} onChangeText={setExperience} multiline textAlignVertical="top" />

      <Text style={styles.label}>Образование</Text>
      <TextInput style={[styles.input, styles.textArea]} value={education} onChangeText={setEducation} multiline textAlignVertical="top" />

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Опубликовать</Text>
        <Switch value={isPublished} onValueChange={setIsPublished} trackColor={{ true: COLORS.primary, false: COLORS.gray200 }} />
      </View>

      <TouchableOpacity style={[styles.submitBtn, saving && { opacity: 0.7 }]} onPress={handleSave} disabled={saving} activeOpacity={0.8}>
        {saving ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.submitText}>Сохранить</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: 60 },
  label: { ...FONTS.bold, fontSize: 14, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  required: { color: COLORS.error },
  input: {
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, height: 48,
    fontSize: 15, color: COLORS.text,
  },
  textArea: { minHeight: 100, height: undefined, paddingVertical: SPACING.sm + 4 },
  row: { flexDirection: 'row', gap: SPACING.sm },
  halfCol: { flex: 1 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  chip: {
    paddingHorizontal: SPACING.md, paddingVertical: 10, borderRadius: RADIUS.full,
    backgroundColor: COLORS.gray100, borderWidth: 1.5, borderColor: COLORS.gray200,
  },
  chipActive: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary },
  chipText: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' },
  chipTextActive: { color: COLORS.primary, fontWeight: '600' },
  switchRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: SPACING.lg, backgroundColor: COLORS.surface, borderRadius: RADIUS.md,
    padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
  },
  switchLabel: { ...FONTS.medium, fontSize: 15 },
  submitBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.md, height: 52,
    alignItems: 'center', justifyContent: 'center', marginTop: SPACING.xl,
  },
  submitText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});

export default EditResumeScreen;
