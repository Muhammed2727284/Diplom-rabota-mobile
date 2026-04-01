import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet,
  Alert, ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';
import { getMyOrganization, updateMyOrganization } from '../../api/profile';

const EditOrgProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadOrg();
  }, []);

  const loadOrg = async () => {
    try {
      const res = await getMyOrganization();
      const o = res.data;
      setName(o.name || '');
      setDescription(o.description || '');
      setCity(o.city || '');
      setAddress(o.address || '');
      setPhone(o.phone || '');
      setWebsite(o.website || '');
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateMyOrganization({
        name: name.trim(),
        description: description.trim(),
        city: city.trim(),
        address: address.trim(),
        phone: phone.trim(),
        website: website.trim(),
      });
      Alert.alert('Успешно', 'Данные компании обновлены');
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
      <Text style={styles.label}>Название компании</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Название" placeholderTextColor={COLORS.textLight} />

      <Text style={styles.label}>Описание</Text>
      <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} multiline textAlignVertical="top" placeholder="Описание компании" placeholderTextColor={COLORS.textLight} />

      <Text style={styles.label}>Город</Text>
      <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="Город" placeholderTextColor={COLORS.textLight} />

      <Text style={styles.label}>Адрес</Text>
      <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Адрес" placeholderTextColor={COLORS.textLight} />

      <Text style={styles.label}>Телефон</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="+7 ..." placeholderTextColor={COLORS.textLight} keyboardType="phone-pad" />

      <Text style={styles.label}>Веб-сайт</Text>
      <TextInput style={styles.input} value={website} onChangeText={setWebsite} placeholder="https://..." placeholderTextColor={COLORS.textLight} keyboardType="url" autoCapitalize="none" />

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
  textArea: { minHeight: 100, height: undefined, paddingVertical: SPACING.sm + 4 },
  submitBtn: {
    backgroundColor: COLORS.primary, borderRadius: RADIUS.md, height: 52,
    alignItems: 'center', justifyContent: 'center', marginTop: SPACING.xl,
  },
  submitText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});

export default EditOrgProfileScreen;
