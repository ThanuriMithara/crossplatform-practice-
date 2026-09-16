import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { THEME } from '../constants/theme';
import { UserRole } from '../models/types';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';

export default function SignupScreen({ navigation }: any) {
  const { signup, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('attendee');

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const newErrors: any = {};
    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    try {
      await signup(name.trim(), email.trim(), password, role, phone.trim());
    } catch (err: any) {
      Alert.alert('Sign Up Failed', err.response?.data?.message || 'Could not register account.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={THEME.colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join EventHub to discover or host amazing experiences</Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Role Picker */}
          <Text style={styles.roleLabel}>I want to:</Text>
          <View style={styles.roleSelector}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setRole('attendee')}
              style={[
                styles.roleOption,
                role === 'attendee' && styles.roleOptionSelected,
              ]}
            >
              <Ionicons
                name="ticket"
                size={18}
                color={role === 'attendee' ? THEME.colors.white : THEME.colors.textSecondary}
              />
              <Text
                style={[
                  styles.roleText,
                  role === 'attendee' && styles.roleTextSelected,
                ]}
              >
                Attend Events
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setRole('organizer')}
              style={[
                styles.roleOption,
                role === 'organizer' && styles.roleOptionSelected,
              ]}
            >
              <Ionicons
                name="megaphone"
                size={18}
                color={role === 'organizer' ? THEME.colors.white : THEME.colors.textSecondary}
              />
              <Text
                style={[
                  styles.roleText,
                  role === 'organizer' && styles.roleTextSelected,
                ]}
              >
                Host / Organize
              </Text>
            </TouchableOpacity>
          </View>

          <CustomInput
            label="Full Name"
            placeholder="e.g. Maya Lin"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            icon="person-outline"
            error={errors.name}
          />

          <CustomInput
            label="Email Address"
            placeholder="name@example.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <CustomInput
            label="Phone Number (Optional)"
            placeholder="+94 77 123 4567"
            value={phone}
            onChangeText={setPhone}
            icon="call-outline"
            keyboardType="phone-pad"
          />

          <CustomInput
            label="Password"
            placeholder="At least 6 characters"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            icon="lock-closed-outline"
            isPassword
            error={errors.password}
          />

          <CustomInput
            label="Confirm Password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }}
            icon="shield-checkmark-outline"
            isPassword
            error={errors.confirmPassword}
          />

          <CustomButton
            title="Create Account"
            onPress={handleSignup}
            loading={isLoading}
            size="lg"
            style={styles.submitBtn}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: THEME.spacing.lg,
    paddingTop: THEME.spacing.xl,
  },
  header: {
    marginBottom: THEME.spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  title: {
    fontSize: THEME.fontSize.header,
    fontWeight: '800',
    color: THEME.colors.text,
  },
  subtitle: {
    fontSize: THEME.fontSize.sm,
    color: THEME.colors.textMuted,
    marginTop: 6,
  },
  formCard: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.xl,
    padding: 22,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    ...THEME.shadows.card,
  },
  roleLabel: {
    fontSize: THEME.fontSize.sm,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    marginBottom: 8,
  },
  roleSelector: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  roleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.inputBg,
    borderWidth: 1.2,
    borderColor: THEME.colors.cardBorder,
    gap: 8,
  },
  roleOptionSelected: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primaryLight,
    ...THEME.shadows.button,
  },
  roleText: {
    fontSize: THEME.fontSize.xs,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  roleTextSelected: {
    color: THEME.colors.white,
  },
  submitBtn: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  footerText: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.fontSize.sm,
  },
  loginLink: {
    color: THEME.colors.primaryLight,
    fontWeight: '700',
    fontSize: THEME.fontSize.sm,
  },
});
