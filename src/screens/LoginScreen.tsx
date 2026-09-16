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
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';

export default function LoginScreen({ navigation }: any) {
  const { login, loginDemo, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    try {
      await login(email.trim(), password);
    } catch (err: any) {
      Alert.alert('Login Failed', err.response?.data?.message || 'Invalid credentials.');
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
        {/* Brand Logo & Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons name="sparkles" size={36} color={THEME.colors.primaryLight} />
          </View>
          <Text style={styles.brandTitle}>EventHub</Text>
          <Text style={styles.brandSubtitle}>
            Discover, book, and experience extraordinary events
          </Text>
        </View>

        {/* Login Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Welcome Back</Text>
          <Text style={styles.formSub}>Sign in with your credentials to continue</Text>

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
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            icon="lock-closed-outline"
            isPassword
            error={errors.password}
          />

          <CustomButton
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            size="lg"
            style={styles.submitBtn}
          />

          {/* Quick Demo Fill Buttons */}
          <View style={styles.demoSection}>
            <Text style={styles.demoDividerText}>── QUICK DEMO LOGIN ──</Text>
            <View style={styles.demoButtonsRow}>
              <CustomButton
                title="👤 Attendee"
                variant="secondary"
                size="sm"
                onPress={() => loginDemo('attendee')}
                style={styles.demoBtn}
              />
              <CustomButton
                title="👑 Organizer"
                variant="secondary"
                size="sm"
                onPress={() => loginDemo('organizer')}
                style={styles.demoBtn}
              />
            </View>
          </View>
        </View>

        {/* Footer Link to Sign Up */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupLink}>Sign Up</Text>
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
    justifyContent: 'center',
    padding: THEME.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: THEME.spacing.xl,
    marginTop: THEME.spacing.lg,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: THEME.colors.primary,
  },
  brandTitle: {
    fontSize: THEME.fontSize.header,
    fontWeight: '800',
    color: THEME.colors.text,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: THEME.fontSize.sm,
    color: THEME.colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 280,
  },
  formCard: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.xl,
    padding: 24,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    ...THEME.shadows.card,
  },
  formTitle: {
    fontSize: THEME.fontSize.xl,
    fontWeight: '700',
    color: THEME.colors.text,
    marginBottom: 4,
  },
  formSub: {
    fontSize: THEME.fontSize.xs,
    color: THEME.colors.textSecondary,
    marginBottom: 20,
  },
  submitBtn: {
    marginTop: 8,
  },
  demoSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  demoDividerText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    letterSpacing: 1,
    marginBottom: 12,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  demoBtn: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  footerText: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.fontSize.sm,
  },
  signupLink: {
    color: THEME.colors.primaryLight,
    fontWeight: '700',
    fontSize: THEME.fontSize.sm,
  },
});
