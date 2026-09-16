import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES, THEME } from '../constants/theme';
import { EventCategory } from '../models/types';

interface CategoryChipsProps {
  selectedCategory: EventCategory;
  onSelectCategory: (category: EventCategory) => void;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.7}
              onPress={() => onSelectCategory(cat.id as EventCategory)}
              style={[
                styles.chip,
                isSelected ? styles.chipSelected : styles.chipUnselected,
              ]}
            >
              <Ionicons
                name={cat.icon as any}
                size={16}
                color={isSelected ? THEME.colors.white : THEME.colors.textSecondary}
                style={styles.icon}
              />
              <Text
                style={[
                  styles.chipText,
                  isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 12,
  },
  scrollContainer: {
    paddingHorizontal: THEME.spacing.md,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
  },
  chipSelected: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primaryLight,
    ...THEME.shadows.button,
  },
  chipUnselected: {
    backgroundColor: THEME.colors.chipBg,
    borderColor: THEME.colors.cardBorder,
  },
  icon: {
    marginRight: 6,
  },
  chipText: {
    fontSize: THEME.fontSize.sm,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: THEME.colors.white,
  },
  chipTextUnselected: {
    color: THEME.colors.textSecondary,
  },
});
