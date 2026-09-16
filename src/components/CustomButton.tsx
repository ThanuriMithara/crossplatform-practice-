import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconRight?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconRight = false,
  style,
  textStyle,
}) => {
  const getContainerStyle = (): ViewStyle => {
    switch (variant) {
      case 'secondary':
        return { backgroundColor: THEME.colors.cardElevated, borderColor: THEME.colors.cardBorder, borderWidth: 1 };
      case 'outline':
        return { backgroundColor: 'transparent', borderColor: THEME.colors.primary, borderWidth: 1.5 };
      case 'danger':
        return { backgroundColor: THEME.colors.danger };
      case 'success':
        return { backgroundColor: THEME.colors.success };
      case 'ghost':
        return { backgroundColor: 'transparent' };
      case 'primary':
      default:
        return { backgroundColor: THEME.colors.primary, ...THEME.shadows.button };
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return THEME.colors.primaryLight;
      case 'secondary':
        return THEME.colors.text;
      case 'danger':
      case 'success':
      case 'primary':
      default:
        return THEME.colors.white;
    }
  };

  const getSizeStyle = (): { container: ViewStyle; text: TextStyle; iconSize: number } => {
    switch (size) {
      case 'sm':
        return {
          container: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: THEME.borderRadius.sm },
          text: { fontSize: THEME.fontSize.xs, fontWeight: '600' },
          iconSize: 14,
        };
      case 'lg':
        return {
          container: { paddingVertical: 16, paddingHorizontal: 24, borderRadius: THEME.borderRadius.lg },
          text: { fontSize: THEME.fontSize.lg, fontWeight: '700' },
          iconSize: 22,
        };
      case 'md':
      default:
        return {
          container: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: THEME.borderRadius.md },
          text: { fontSize: THEME.fontSize.md, fontWeight: '600' },
          iconSize: 18,
        };
    }
  };

  const sizeStyle = getSizeStyle();
  const textColor = getTextColor();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.baseButton,
        getContainerStyle(),
        sizeStyle.container,
        disabled && styles.disabledButton,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <View style={[styles.contentRow, iconRight && styles.contentRowReverse]}>
          {icon && (
            <Ionicons
              name={icon}
              size={sizeStyle.iconSize}
              color={textColor}
              style={iconRight ? styles.iconRight : styles.iconLeft}
            />
          )}
          <Text style={[styles.baseText, { color: textColor }, sizeStyle.text, textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRowReverse: {
    flexDirection: 'row-reverse',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  baseText: {
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
