import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { Booking } from '../models/types';
import { TicketPassCard } from '../components/TicketPassCard';
import { CustomButton } from '../components/CustomButton';

export default function BookingSuccessScreen({ route, navigation }: any) {
  const { booking }: { booking: Booking } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Success Header */}
        <View style={styles.celebrationCircle}>
          <Ionicons name="checkmark-sharp" size={42} color={THEME.colors.white} />
        </View>

        <Text style={styles.title}>Booking Confirmed! 🎉</Text>
        <Text style={styles.subtitle}>
          Your tickets have been issued and saved to your account.
        </Text>

        {/* Digital Ticket Pass */}
        <View style={styles.ticketWrapper}>
          <TicketPassCard booking={booking} />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonGroup}>
          <CustomButton
            title="View in My Bookings"
            onPress={() => {
              navigation.navigate('MainTabs', { screen: 'My Bookings' });
            }}
            icon="ticket-outline"
            size="lg"
          />

          <CustomButton
            title="Back to Home"
            onPress={() => {
              navigation.navigate('MainTabs', { screen: 'Browse' });
            }}
            variant="secondary"
            size="md"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    padding: THEME.spacing.md,
    paddingTop: 50,
    paddingBottom: 40,
    alignItems: 'center',
  },
  celebrationCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: THEME.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...THEME.shadows.button,
  },
  title: {
    fontSize: THEME.fontSize.header,
    fontWeight: '800',
    color: THEME.colors.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: THEME.fontSize.sm,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: 24,
  },
  ticketWrapper: {
    width: '100%',
    marginBottom: 20,
  },
  buttonGroup: {
    width: '100%',
    gap: 12,
  },
});
