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
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { THEME } from '../constants/theme';
import { EventItem } from '../models/types';
import { eventService } from '../services/api';
import { CustomButton } from '../components/CustomButton';
import { EmptyState } from '../components/EmptyState';

export default function OrganizerDashboardScreen({ navigation }: any) {
  const { user, isOrganizer, switchRole } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchMyEvents = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const data = await eventService.getMyOrganizedEvents();
      setEvents(data);
    } catch (err) {
      console.error('Error fetching organized events:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchMyEvents();
    });
    fetchMyEvents();
    return unsubscribe;
  }, [navigation, fetchMyEvents]);

  const handleDelete = (eventId: string, eventTitle: string) => {
    Alert.alert(
      'Delete Event',
      `Are you sure you want to permanently delete "${eventTitle}"? This will cancel all bookings.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await eventService.deleteEvent(eventId);
              Alert.alert('Event Deleted', 'The event was removed successfully.');
              fetchMyEvents();
            } catch (e: any) {
              Alert.alert('Error', 'Failed to delete event');
            }
          },
        },
      ]
    );
  };

  // Quick stats calculations
  const totalEvents = events.length;
  const totalCapacity = events.reduce((sum, e) => sum + e.totalSeats, 0);
  const totalBooked = events.reduce((sum, e) => sum + (e.totalSeats - e.availableSeats), 0);
  const estimatedRevenue = events.reduce((sum, e) => sum + ((e.totalSeats - e.availableSeats) * e.price), 0);

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Organizer Hub</Text>
          <Text style={styles.subtitle}>Manage your events, capacity & tickets</Text>
        </View>

        <CustomButton
          title="+ Add Event"
          onPress={() => navigation.navigate('AddEditEvent', { isEditing: false })}
          size="sm"
          icon="add"
          style={styles.addBtn}
        />
      </View>

      {/* Role Notice if user is attendee */}
      {!isOrganizer && (
        <View style={styles.roleBanner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.roleBannerTitle}>Organizer Mode</Text>
            <Text style={styles.roleBannerSub}>
              You are currently viewing as an attendee. Switch to organizer mode to publish events.
            </Text>
          </View>
          <CustomButton
            title="Enable"
            size="sm"
            variant="secondary"
            onPress={() => switchRole('organizer')}
          />
        </View>
      )}

      {isLoading && !isRefreshing ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={THEME.colors.primary} />
          <Text style={styles.loaderText}>Loading dashboard metrics...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchMyEvents(true)}
              tintColor={THEME.colors.primaryLight}
              colors={[THEME.colors.primary]}
            />
          }
        >
          {/* Metrics Grid */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <View style={[styles.metricIconBox, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
                <Ionicons name="calendar-sharp" size={20} color={THEME.colors.primaryLight} />
              </View>
              <Text style={styles.metricNumber}>{totalEvents}</Text>
              <Text style={styles.metricLabel}>Hosted Events</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <Ionicons name="ticket" size={20} color={THEME.colors.success} />
              </View>
              <Text style={[styles.metricNumber, { color: THEME.colors.success }]}>{totalBooked}</Text>
              <Text style={styles.metricLabel}>Tickets Sold</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                <Ionicons name="cash-outline" size={20} color={THEME.colors.warning} />
              </View>
              <Text style={[styles.metricNumber, { color: THEME.colors.warning }]}>
                ${estimatedRevenue}
              </Text>
              <Text style={styles.metricLabel}>Est. Revenue</Text>
            </View>
          </View>

          {/* Events List */}
          <View style={styles.eventsSection}>
            <Text style={styles.sectionTitle}>My Published Events</Text>

            {events.length === 0 ? (
              <EmptyState
                icon="calendar-outline"
                title="No Events Created"
                description="You have not created any events yet. Tap '+ Add Event' to launch your first event!"
                actionTitle="Create First Event"
                onAction={() => navigation.navigate('AddEditEvent', { isEditing: false })}
              />
            ) : (
              events.map((evt) => {
                const bookedSeats = evt.totalSeats - evt.availableSeats;
                return (
                  <View key={evt._id || (evt as any).id} style={styles.eventItemCard}>
                    <Image source={{ uri: evt.imageUrl }} style={styles.eventImg} />

                    <View style={styles.eventContent}>
                      <View style={styles.eventTopRow}>
                        <Text style={styles.categoryBadge}>{evt.category}</Text>
                        <Text style={styles.priceText}>
                          {evt.price === 0 ? 'FREE' : `$${evt.price}`}
                        </Text>
                      </View>

                      <Text style={styles.eventTitle} numberOfLines={1}>
                        {evt.title}
                      </Text>

                      <Text style={styles.eventSchedule}>
                        <Ionicons name="calendar-outline" size={12} color={THEME.colors.primaryLight} />{' '}
                        {evt.date} • {evt.time}
                      </Text>

                      {/* Capacity bar */}
                      <View style={styles.capacityRow}>
                        <Text style={styles.capacityText}>
                          Tickets: <Text style={{ color: THEME.colors.text }}>{bookedSeats}/{evt.totalSeats} Sold</Text>
                        </Text>
                        <Text style={styles.capacityPercent}>
                          {Math.round((bookedSeats / (evt.totalSeats || 1)) * 100)}%
                        </Text>
                      </View>

                      {/* Action Buttons */}
                      <View style={styles.actionButtonsRow}>
                        <TouchableOpacity
                          style={styles.actionBtn}
                          onPress={() => navigation.navigate('EventAttendees', { eventId: evt._id || evt.id, eventTitle: evt.title })}
                        >
                          <Ionicons name="people-outline" size={14} color={THEME.colors.primaryLight} />
                          <Text style={styles.actionBtnText}>Attendees</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.actionBtn}
                          onPress={() => navigation.navigate('AddEditEvent', { isEditing: true, event: evt })}
                        >
                          <Ionicons name="create-outline" size={14} color={THEME.colors.warning} />
                          <Text style={[styles.actionBtnText, { color: THEME.colors.warning }]}>Edit</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.actionBtn}
                          onPress={() => handleDelete(evt._id || evt.id || '', evt.title)}
                        >
                          <Ionicons name="trash-outline" size={14} color={THEME.colors.danger} />
                          <Text style={[styles.actionBtnText, { color: THEME.colors.danger }]}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addBtn: {
    paddingHorizontal: 16,
  },
  roleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    marginHorizontal: THEME.spacing.md,
    marginBottom: 12,
    padding: 12,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    gap: 12,
  },
  roleBannerTitle: {
    fontSize: THEME.fontSize.xs,
    fontWeight: '700',
    color: THEME.colors.primaryLight,
  },
  roleBannerSub: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.md,
    paddingBottom: 40,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.lg,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  metricIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  metricNumber: {
    fontSize: THEME.fontSize.lg,
    fontWeight: '800',
    color: THEME.colors.text,
  },
  metricLabel: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  eventsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: THEME.fontSize.lg,
    fontWeight: '800',
    color: THEME.colors.text,
    marginBottom: 14,
  },
  eventItemCard: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    marginBottom: 14,
    overflow: 'hidden',
  },
  eventImg: {
    width: '100%',
    height: 120,
    backgroundColor: '#1E293B',
  },
  eventContent: {
    padding: 14,
  },
  eventTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryBadge: {
    fontSize: 10,
    color: THEME.colors.primaryLight,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  priceText: {
    fontSize: THEME.fontSize.xs,
    color: THEME.colors.success,
    fontWeight: '800',
  },
  eventTitle: {
    fontSize: THEME.fontSize.md,
    fontWeight: '700',
    color: THEME.colors.text,
    marginBottom: 4,
  },
  eventSchedule: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginBottom: 8,
  },
  capacityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#131B2A',
    padding: 8,
    borderRadius: THEME.borderRadius.sm,
    marginBottom: 12,
  },
  capacityText: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
  capacityPercent: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.primaryLight,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.sm,
    backgroundColor: THEME.colors.cardElevated,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    gap: 4,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.primaryLight,
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
