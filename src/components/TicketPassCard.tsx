import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Booking } from '../models/types';
import { THEME } from '../constants/theme';
import { CustomButton } from './CustomButton';

interface TicketPassCardProps {
  booking: Booking;
  onCancel?: (bookingId: string) => void;
  onPressEvent?: (eventId: string) => void;
}

export const TicketPassCard: React.FC<TicketPassCardProps> = ({
  booking,
  onCancel,
  onPressEvent,
}) => {
  const isCancelled = booking.status === 'cancelled';
  const event = booking.event;

  const handleCancelPress = () => {
    Alert.alert(
      'Cancel Booking',
      `Are you sure you want to cancel your booking for "${event?.title}"? ${booking.seatsBooked} seat(s) will be refunded.`,
      [
        { text: 'Keep Ticket', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => onCancel && onCancel(booking._id),
        },
      ]
    );
  };

  return (
    <View style={[styles.ticketContainer, isCancelled && styles.cancelledTicket]}>
      {/* Top Header Section */}
      <View style={styles.topSection}>
        <View style={styles.headerRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{event?.category || 'Event'}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              isCancelled ? styles.statusCancelled : styles.statusConfirmed,
            ]}
          >
            <Ionicons
              name={isCancelled ? 'close-circle' : 'checkmark-circle'}
              size={12}
              color={isCancelled ? THEME.colors.danger : THEME.colors.success}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.statusText,
                isCancelled ? { color: THEME.colors.danger } : { color: THEME.colors.success },
              ]}
            >
              {isCancelled ? 'CANCELLED' : 'CONFIRMED'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => event?._id && onPressEvent && onPressEvent(event._id)}
        >
          <Text style={styles.eventTitle} numberOfLines={2}>
            {event?.title || 'Event Pass'}
          </Text>
        </TouchableOpacity>

        {/* Date & Location */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar" size={14} color={THEME.colors.primaryLight} />
            <Text style={styles.detailText}>{event?.date || 'Upcoming'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={14} color={THEME.colors.primaryLight} />
            <Text style={styles.detailText}>{event?.time || 'TBA'}</Text>
          </View>
        </View>

        <View style={styles.venueRow}>
          <Ionicons name="location" size={14} color={THEME.colors.accent} />
          <Text style={styles.venueText} numberOfLines={1}>
            {event?.venue}, {event?.location}
          </Text>
        </View>
      </View>

      {/* Perforated Divider */}
      <View style={styles.perforationWrapper}>
        <View style={styles.notchLeft} />
        <View style={styles.dashedLine} />
        <View style={styles.notchRight} />
      </View>

      {/* Bottom Stub Section */}
      <View style={styles.bottomSection}>
        <View style={styles.stubRow}>
          <View>
            <Text style={styles.stubLabel}>ATTENDEE</Text>
            <Text style={styles.stubValue}>{booking.userName}</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.stubLabel}>SEATS</Text>
            <Text style={styles.stubValue}>{booking.seatsBooked} Ticket(s)</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.stubLabel}>TOTAL PAID</Text>
            <Text style={[styles.stubValue, { color: THEME.colors.success }]}>
              ${booking.totalPrice}
            </Text>
          </View>
        </View>

        {/* Ticket Code & QR Graphic Mock */}
        <View style={styles.ticketCodeRow}>
          <View style={styles.qrIconBox}>
            <Ionicons name="qr-code-outline" size={28} color={THEME.colors.primaryLight} />
          </View>
          <View style={styles.codeTextContainer}>
            <Text style={styles.codeLabel}>PASS CODE</Text>
            <Text style={styles.codeValue}>{booking.ticketCode}</Text>
          </View>

          {/* Action Button */}
          {!isCancelled && onCancel && (
            <CustomButton
              title="Cancel"
              variant="outline"
              size="sm"
              onPress={handleCancelPress}
              style={styles.cancelBtn}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ticketContainer: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    marginBottom: THEME.spacing.md,
    overflow: 'hidden',
    ...THEME.shadows.card,
  },
  cancelledTicket: {
    opacity: 0.6,
  },
  topSection: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.full,
  },
  categoryText: {
    color: THEME.colors.primaryLight,
    fontSize: 11,
    fontWeight: '700',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.full,
  },
  statusConfirmed: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  statusCancelled: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  eventTitle: {
    fontSize: THEME.fontSize.lg,
    fontWeight: '700',
    color: THEME.colors.text,
    marginBottom: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: THEME.fontSize.xs,
    color: THEME.colors.textSecondary,
    fontWeight: '500',
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  venueText: {
    fontSize: THEME.fontSize.xs,
    color: THEME.colors.textSecondary,
    flex: 1,
  },
  perforationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    marginHorizontal: -10,
  },
  notchLeft: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: THEME.colors.background,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    borderStyle: 'dashed',
  },
  notchRight: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: THEME.colors.background,
  },
  bottomSection: {
    padding: 16,
    paddingTop: 10,
    backgroundColor: '#131B2A',
  },
  stubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stubLabel: {
    fontSize: 9,
    color: THEME.colors.textMuted,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  stubValue: {
    fontSize: THEME.fontSize.sm,
    color: THEME.colors.text,
    fontWeight: '700',
  },
  ticketCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1624',
    padding: 10,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  qrIconBox: {
    marginRight: 10,
  },
  codeTextContainer: {
    flex: 1,
  },
  codeLabel: {
    fontSize: 8,
    color: THEME.colors.textMuted,
    fontWeight: '700',
  },
  codeValue: {
    fontSize: THEME.fontSize.sm,
    color: THEME.colors.primaryLight,
    fontWeight: '800',
    letterSpacing: 1,
  },
  cancelBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderColor: THEME.colors.danger,
  },
});
