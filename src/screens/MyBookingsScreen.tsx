import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { THEME } from '../constants/theme';
import { Booking } from '../models/types';
import { bookingService } from '../services/api';
import { TicketPassCard } from '../components/TicketPassCard';
import { EmptyState } from '../components/EmptyState';

type BookingTab = 'all' | 'upcoming' | 'past' | 'cancelled';

export default function MyBookingsScreen({ navigation }: any) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<BookingTab>('upcoming');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchBookings = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchBookings();
    });
    fetchBookings();
    return unsubscribe;
  }, [navigation, fetchBookings]);

  const handleCancel = async (bookingId: string) => {
    try {
      await bookingService.cancelBooking(bookingId);
      Alert.alert('Booking Cancelled', 'Your ticket has been cancelled and seat availability updated.');
      fetchBookings();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'cancelled') return b.status === 'cancelled';
    if (activeTab === 'upcoming') return b.status === 'confirmed';
    if (activeTab === 'past') return b.status === 'attended';
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        <Text style={styles.subtitle}>View your tickets and booking passes</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {(['upcoming', 'all', 'cancelled'] as BookingTab[]).map((tab) => {
          const isActive = activeTab === tab;
          const count = bookings.filter((b) => {
            if (tab === 'all') return true;
            if (tab === 'cancelled') return b.status === 'cancelled';
            if (tab === 'upcoming') return b.status === 'confirmed';
            return true;
          }).length;

          return (
            <TouchableOpacity
              key={tab}
              activeOpacity={0.7}
              onPress={() => setActiveTab(tab)}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {isLoading && !isRefreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={THEME.colors.primary} />
          <Text style={styles.loaderText}>Loading your passes...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchBookings(true)}
              tintColor={THEME.colors.primaryLight}
              colors={[THEME.colors.primary]}
            />
          }
        >
          {filteredBookings.length === 0 ? (
            <EmptyState
              icon="ticket-outline"
              title="No Bookings Found"
              description={
                activeTab === 'upcoming'
                  ? "You don't have any upcoming event tickets yet. Explore events and book now!"
                  : "No bookings found in this category."
              }
              actionTitle={activeTab === 'upcoming' ? "Browse Events" : undefined}
              onAction={() => navigation.navigate('Browse')}
            />
          ) : (
            filteredBookings.map((booking) => (
              <TicketPassCard
                key={booking._id || (booking as any).id}
                booking={booking}
                onCancel={handleCancel}
                onPressEvent={(eventId) => navigation.navigate('EventDetails', { eventId })}
              />
            ))
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
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.lg,
    marginBottom: 12,
  },
  title: {
    fontSize: THEME.fontSize.header,
    fontWeight: '800',
    color: THEME.colors.text,
  },
  subtitle: {
    fontSize: THEME.fontSize.xs,
    color: THEME.colors.textMuted,
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.md,
    marginHorizontal: THEME.spacing.md,
    padding: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: THEME.borderRadius.sm,
  },
  tabButtonActive: {
    backgroundColor: THEME.colors.primary,
    ...THEME.shadows.button,
  },
  tabText: {
    fontSize: THEME.fontSize.xs,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  tabTextActive: {
    color: THEME.colors.white,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.md,
    paddingBottom: 40,
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