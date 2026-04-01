import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { toggleFavorite } from '../api/favorites';

const FavoriteHeart = ({ targetType, targetId, initialActive = false, size = 24, onToggle }) => {
  const [active, setActive] = useState(initialActive);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setActive(initialActive);
  }, [initialActive]);

  const handlePress = async () => {
    if (loading) return;
    setLoading(true);
    const prev = active;
    setActive(!prev);
    try {
      await toggleFavorite({ target_type: targetType, target_id: targetId });
      if (onToggle) onToggle(!prev);
    } catch (e) {
      setActive(prev);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.btn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
      <Ionicons
        name={active ? 'heart' : 'heart-outline'}
        size={size}
        color={active ? COLORS.heart : COLORS.textLight}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: { padding: 4 },
});

export default FavoriteHeart;
