import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet,
  Alert, ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';
import { getMyProfile, updateMyProfile } from '../../api/profile';

const EditUserProfileScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [about, setAbout] = useState('');
  const [skills, setSkills] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [education, setEducation] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getMyProfile();
      const p = res.data;
      setFirstName(p.first_name || '');
      setLastName(p.last_name || '');
      setPhone(p.phone || '');
      setCity(p.city || '');
      setAbout(p.about || '');
      setSkills(p.skills || '');
      setExperienceYears(p.experience_years ? String(p.experience_years) : '');
      setEducation(p.education || '');
      setExpectedSalary(p.expected_salary ? String(p.expected_salary) : '');
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось загрузить профиль');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateMyProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
        city: city.trim(),
        about: about.trim(),
        skills: skills.trim(),
        experience_years: experienceYears ? parseInt(experienceYears) : 0,
        education: education.trim(),
        expected_salary: expectedSalary ? parseInt(expectedSalary) : null,
      });
      Alert.alert('Успешно', 'Профиль обновлён');
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
      <Text style={styles.label}>Имя</Text>
      <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder="Имя" placeholderTextColor={COLORS.textLight} />

      <Text style={styles.label}>Фамилия</Text>
      <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder="Фамилия" placeholderTextColor={COLORS.textLight} />

      <Text style={styles.label}>Телефон</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="+7 ..." placeholderTextColor={COLORS.textLight} keyboardType="phone-pad" />

      <Text style={styles.label}>Город</Text>
      <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="Город" placeholderTextColor={COLORS.textLight} />

      <Text style={styles.label}>О себе</Text>
      <TextInput style={[styles.input, styles.textArea]} value={about} onChangeText={setAbout} multiline textAlignVertical="top" placeholder="О себе" placeholderTextColor={COLORS.textLight} />

      <Text style={styles.label}>Навыки</Text>
      <TextInput style={[styles.input, styles.textArea]} value={skills} onChangeText={setSkills} multiline textAlignVertical="top" placeholder="Навыки" placeholderTextColor={COLORS.textLight} />

      <Text style={styles.label}>Опыт работы (лет)</Text>
      <TextInput style={styles.input} value={experienceYears} onChangeText={setExperienceYears} keyboardType="numeric" placeholder="0" placeholderTextColor={COLORS.textLight} />

      <Text style={styles.label}>Образование</Text>
      <TextInput style={[styles.input, styles.textArea]} value={education} onChangeText={setEducation} multiline textAlignVertical="top" placeholder="Образование" placeholderTextColor={COLORS.textLight} />

      <Text style={styles.label}>Ожидаемая зарплата</Text>
      <TextInput style={styles.input} value={expectedSalary} onChangeText={setExpectedSalary} keyboardType="numeric" placeholder="0" placeholderTextColor={COLORS.textLight} />

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
  input: {
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, height: 48,
    fontSize: 15, color: COLORS.text,
  },
  textArea: { minHeight: 80, height: undefined, paddingVertical: SPACING.sm + 4 },
  submitBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.md, height: 52,
    alignItems: 'center', justifyContent: 'center', marginTop: SPACING.xl,
  },
  submitText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});

export default EditUserProfileScreen;
