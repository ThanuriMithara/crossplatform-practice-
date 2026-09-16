import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { bookingService } from '../services/api';
import { Booking } from '../models/types';
import { EmptyState } from '../components/EmptyState';

export default function EventAttendeesScreen({ route, navigation }: any) {
  const { eventId, eventTitle } = route.params;
  const [attendeesData, setAttendeesData] = useState<{
    bookings: Booking[];
    stats: { totalTicketsSold: number; totalRevenue: number; totalBookings: number };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const data = await bookingService.getEventAttendees(eventId);
        setAttendeesData(data);
      } catch (err) {
        console.error('Error fetching attendees:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttendees();
  }, [eventId]);

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={THEME.colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginHorizontal: 12 }}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Event Attendees
          </Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {eventTitle}
          </Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={THEME.colors.primary} />
          <Text style={styles.loaderText}>Loading attendee list...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Revenue and Count Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{attendeesData?.stats.totalTicketsSold || 0}</Text>
              <Text style={styles.statLabel}>Tickets Sold</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: THEME.colors.success }]}>
                ${attendeesData?.stats.totalRevenue || 0}
              </Text>
              <Text style={styles.statLabel}>Total Revenue</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{attendeesData?.stats.totalBookings || 0}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
          </View>

          {/* Attendee List */}
          <Text style={styles.listTitle}>Registered Guests & Passes</Text>

          {!attendeesData || attendeesData.bookings.length === 0 ? (
            <EmptyState
              icon="people-outline"
              title="No Bookings Yet"
              description="No tickets have been booked for this event yet. Promote your event to attract attendees!"
            />
          ) : (
            attendeesData.bookings.map((booking, index) => {
              const isCancelled = booking.status === 'cancelled';
              return (
                <View key={booking._id || index} style={[styles.attendeeCard, isCancelled && styles.attendeeCancelled]}>
                  <View style={styles.attendeeHeader}>
                    <View style={styles.avatarCircle}>
                      <Text style={styles.avatarLetter}>
                        {booking.userName?.charAt(0).toUpperCase() || 'G'}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.attendeeName}>{booking.userName}</Text>
                      <Text style={styles.attendeeEmail}>{booking.userEmail}</Text>
                      {booking.userPhone ? (
                        <Text style={styles.attendeePhone}>{booking.userPhone}</Text>
                      ) : null}
                    </View>
                    <View
                      style={[
                        styles.badge,
                        isCancelled ? styles.badgeCancelled : styles.badgeConfirmed,
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          isCancelled ? { color: THEME.colors.danger } : { color: THEME.colors.success },
                        ]}
                      >
                        {booking.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardDivider} />

                  <View style={styles.ticketDetails}>
                    <View>
                      <Text style={styles.smallLabel}>PASS CODE</Text>
                      <Text style={styles.ticketCode}>{booking.ticketCode}</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={styles.smallLabel}>SEATS</Text>
                      <Text style={styles.detailValue}>{booking.seatsBooked} Ticket(s)</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.smallLabel}>AMOUNT</Text>
                      <Text style={[styles.detailValue, { color: THEME.colors.success }]}>
                        ${booking.totalPrice}
                      </Text>
                    </View>
                  </View>

                  {booking.notes ? (
                    <View style={styles.notesContainer}>
                      <Text style={styles.notesLabel}>Special Notes: </Text>
                      <Text style={styles.notesText}>{booking.notes}</Text>
                    </View>
                  ) : null}
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
    paddingTop: 36,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.cardBorder,
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
    fontSize: THEME.fontSize.md,
    fontWeight: '800',
    color: THEME.colors.text,
  },
  headerSubtitle: {
    fontSize: THEME.fontSize.xs,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  scrollContent: {
    padding: THEME.spacing.md,
    paddingBottom: 40,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.md,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  statNum: {
    fontSize: THEME.fontSize.lg,
    fontWeight: '800',
    color: THEME.colors.text,
  },
  statLabel: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  listTitle: {
    fontSize: THEME.fontSize.md,
    fontWeight: '800',
    color: THEME.colors.text,
    marginBottom: 12,
  },
  attendeeCard: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    marginBottom: 12,
  },
  attendeeCancelled: {
    opacity: 0.6,
  },
  attendeeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: THEME.colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  attendeeName: {
    fontSize: THEME.fontSize.sm,
    fontWeight: '700',
    color: THEME.colors.text,
  },
  attendeeEmail: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
  },
  attendeePhone: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.full,
  },
  badgeConfirmed: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  badgeCancelled: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 10,
  },
  ticketDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: THEME.colors.textMuted,
    marginBottom: 2,
  },
  ticketCode: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.primaryLight,
  },
  detailValue: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.text,
  },
  notesContainer: {
    marginTop: 8,
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#131B2A',
    flexDirection: 'row',
  },
  notesLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.textMuted,
  },
  notesText: {
    fontSize: 10,
    color: THEME.colors.textSecondary,
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.fontSize.sm,
    marginTop: 12,
  },
});
