import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { THEME } from '../constants/theme';
import { EventItem } from '../models/types';
import { bookingService } from '../services/api';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';

export default function BookingScreen({ route, navigation }: any) {
  const { event }: { event: EventItem } = route.params;
  const { user } = useAuth();

  const [seats, setSeats] = useState(1);
  const [userName, setUserName] = useState(user?.name || '');
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [userPhone, setUserPhone] = useState(user?.phone || '');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<{ userName?: string; userEmail?: string }>({});

  const maxSeats = Math.min(10, event.availableSeats);

  const handleIncrement = () => {
    if (seats < maxSeats) setSeats(seats + 1);
  };

  const handleDecrement = () => {
    if (seats > 1) setSeats(seats - 1);
  };

  const validate = () => {
    const newErrors: any = {};
    if (!userName.trim()) newErrors.userName = 'Attendee name is required';
    if (!userEmail.trim() || !/\S+@\S+\.\S+/.test(userEmail)) {
      newErrors.userEmail = 'Valid email is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmBooking = async () => {
    if (!validate()) return;
    setIsLoading(true);

    try {
      const booking = await bookingService.createBooking({
        eventId: event._id || (event as any).id,
        seats,
        userName: userName.trim(),
        userEmail: userEmail.trim(),
        userPhone: userPhone.trim(),
        notes: notes.trim(),
      });

      // Navigate to success ticket pass screen
      navigation.replace('BookingSuccess', { booking });
    } catch (err: any) {
      Alert.alert('Booking Error', err.response?.data?.message || err.message || 'Failed to complete booking');
    } finally {
      setIsLoading(false);
    }
  };

  const totalPrice = event.price * seats;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={THEME.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Confirm Booking</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Event Quick Summary Card */}
        <View style={styles.eventCard}>
          <Image source={{ uri: event.imageUrl }} style={styles.eventThumb} />
          <View style={styles.eventInfo}>
            <Text style={styles.categoryBadge}>{event.category}</Text>
            <Text style={styles.eventTitle} numberOfLines={2}>
              {event.title}
            </Text>
            <Text style={styles.eventDate}>
              <Ionicons name="calendar-outline" size={12} color={THEME.colors.primaryLight} /> {event.date} • {event.time}
            </Text>
            <Text style={styles.eventVenue} numberOfLines={1}>
              <Ionicons name="location-outline" size={12} color={THEME.colors.accent} /> {event.venue}
            </Text>
          </View>
        </View>

        {/* Seat Counter Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Select Number of Seats</Text>
          <Text style={styles.sectionSub}>Available capacity: {event.availableSeats} tickets</Text>

          <View style={styles.counterRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleDecrement}
              disabled={seats <= 1}
              style={[styles.counterBtn, seats <= 1 && styles.counterBtnDisabled]}
            >
              <Ionicons
                name="remove"
                size={22}
                color={seats <= 1 ? THEME.colors.textMuted : THEME.colors.white}
              />
            </TouchableOpacity>

            <View style={styles.seatCountBadge}>
              <Text style={styles.seatCountNumber}>{seats}</Text>
              <Text style={styles.seatCountLabel}>{seats === 1 ? 'Seat' : 'Seats'}</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleIncrement}
              disabled={seats >= maxSeats}
              style={[styles.counterBtn, seats >= maxSeats && styles.counterBtnDisabled]}
            >
              <Ionicons
                name="add"
                size={22}
                color={seats >= maxSeats ? THEME.colors.textMuted : THEME.colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Attendee Info Form */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Attendee Details</Text>
          <Text style={styles.sectionSub}>Ticket confirmation will be sent to this email</Text>

          <CustomInput
            label="Full Name"
            placeholder="Attendee Name"
            value={userName}
            onChangeText={(text) => {
              setUserName(text);
              if (errors.userName) setErrors((prev) => ({ ...prev, userName: undefined }));
            }}
            icon="person-outline"
            error={errors.userName}
          />

          <CustomInput
            label="Email Address"
            placeholder="attendee@example.com"
            value={userEmail}
            onChangeText={(text) => {
              setUserEmail(text);
              if (errors.userEmail) setErrors((prev) => ({ ...prev, userEmail: undefined }));
            }}
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.userEmail}
          />

          <CustomInput
            label="Phone Number"
            placeholder="+94 77 000 0000"
            value={userPhone}
            onChangeText={setUserPhone}
            icon="call-outline"
            keyboardType="phone-pad"
          />

          <CustomInput
            label="Special Requests / Notes (Optional)"
            placeholder="Dietary requirements, accessibility needs..."
            value={notes}
            onChangeText={setNotes}
            icon="chatbox-ellipses-outline"
            multiline
            numberOfLines={3}
            containerStyle={{ marginBottom: 0 }}
          />
        </View>

        {/* Price Breakdown Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Ticket Price ({seats}x)</Text>
            <Text style={styles.priceValue}>${event.price} x {seats}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Booking Fee</Text>
            <Text style={[styles.priceValue, { color: THEME.colors.success }]}>FREE</Text>
          </View>

          <View style={styles.priceDivider} />

          <View style={styles.priceRow}>
            <Text style={styles.totalPriceLabel}>Total Amount</Text>
            <Text style={styles.totalPriceValue}>
              {totalPrice === 0 ? 'FREE' : `$${totalPrice}`}
            </Text>
          </View>
        </View>

        {/* Submit Booking Button */}
        <CustomButton
          title={totalPrice === 0 ? 'Confirm Free Reservation' : `Pay $${totalPrice} & Book Now`}
          onPress={handleConfirmBooking}
          loading={isLoading}
          icon="checkmark-circle-outline"
          size="lg"
          style={styles.submitButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollContent: {
    padding: THEME.spacing.md,
    paddingTop: 36,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  headerTitle: {
    fontSize: THEME.fontSize.lg,
    fontWeight: '800',
    color: THEME.colors.text,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    marginBottom: 16,
    gap: 12,
    alignItems: 'center',
  },
  eventThumb: {
    width: 80,
    height: 80,
    borderRadius: THEME.borderRadius.md,
  },
  eventInfo: {
    flex: 1,
  },
  categoryBadge: {
    fontSize: 10,
    color: THEME.colors.primaryLight,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  eventTitle: {
    fontSize: THEME.fontSize.md,
    fontWeight: '700',
    color: THEME.colors.text,
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginBottom: 2,
  },
  eventVenue: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
  sectionCard: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: THEME.fontSize.md,
    fontWeight: '700',
    color: THEME.colors.text,
    marginBottom: 2,
  },
  sectionSub: {
    fontSize: THEME.fontSize.xs,
    color: THEME.colors.textMuted,
    marginBottom: 16,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginTop: 8,
  },
  counterBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...THEME.shadows.button,
  },
  counterBtnDisabled: {
    backgroundColor: THEME.colors.cardElevated,
    opacity: 0.5,
  },
  seatCountBadge: {
    alignItems: 'center',
    minWidth: 80,
  },
  seatCountNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: THEME.colors.text,
  },
  seatCountLabel: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: THEME.fontSize.sm,
    color: THEME.colors.textSecondary,
  },
  priceValue: {
    fontSize: THEME.fontSize.sm,
    color: THEME.colors.text,
    fontWeight: '600',
  },
  priceDivider: {
    height: 1,
    backgroundColor: THEME.colors.cardBorder,
    marginVertical: 10,
  },
  totalPriceLabel: {
    fontSize: THEME.fontSize.md,
    fontWeight: '700',
    color: THEME.colors.text,
  },
  totalPriceValue: {
    fontSize: THEME.fontSize.xl,
    fontWeight: '800',
    color: THEME.colors.primaryLight,
  },
  submitButton: {
    marginTop: 8,
  },
});
