import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { EventItem } from '../models/types';
import { eventService } from '../services/api';
import { CustomButton } from '../components/CustomButton';

export default function EventDetailsScreen({ route, navigation }: any) {
  const { eventId } = route.params;
  const [event, setEvent] = useState<EventItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await eventService.getEventById(eventId);
        setEvent(data);
      } catch (err) {
        Alert.alert('Error', 'Failed to load event details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [eventId]);

  const handleShare = async () => {
    if (!event) return;
    try {
      await Share.share({
        message: `Check out ${event.title} at ${event.venue} on ${event.date}! Book tickets now on EventHub.`,
        title: event.title,
      });
    } catch (e) {
      // ignore
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Event not found</Text>
        <CustomButton title="Go Back" onPress={() => navigation.goBack()} style={{ marginTop: 16 }} />
      </View>
    );
  }

  const isSoldOut = event.availableSeats === 0;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Image & Floating Controls */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: event.imageUrl }} style={styles.image} resizeMode="cover" />
          <View style={styles.headerControls}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.floatingButton}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={22} color={THEME.colors.white} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShare}
              style={styles.floatingButton}
              activeOpacity={0.8}
            >
              <Ionicons name="share-social-outline" size={22} color={THEME.colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.categoryChip}>
            <Text style={styles.categoryChipText}>{event.category}</Text>
          </View>
        </View>

        {/* Event Body Content */}
        <View style={styles.content}>
          <Text style={styles.title}>{event.title}</Text>

          {/* Quick Stats Banner */}
          <View style={styles.statsBanner}>
            <View style={styles.statItem}>
              <Ionicons name="ticket" size={20} color={THEME.colors.primaryLight} />
              <View>
                <Text style={styles.statValue}>
                  {isSoldOut ? 'Sold Out' : `${event.availableSeats} Left`}
                </Text>
                <Text style={styles.statLabel}>Available Seats</Text>
              </View>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Ionicons name="pricetag" size={20} color={THEME.colors.success} />
              <View>
                <Text style={[styles.statValue, { color: THEME.colors.success }]}>
                  {event.price === 0 ? 'FREE' : `$${event.price}`}
                </Text>
                <Text style={styles.statLabel}>Per Ticket</Text>
              </View>
            </View>
          </View>

          {/* Schedule & Location Card */}
          <View style={styles.infoCard}>
            <View style={styles.cardRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="calendar" size={20} color={THEME.colors.primaryLight} />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardLabel}>Date & Time</Text>
                <Text style={styles.cardValue}>{event.date}</Text>
                <Text style={styles.cardSubValue}>{event.time}</Text>
              </View>
            </View>

            <View style={styles.horizontalDivider} />

            <View style={styles.cardRow}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(236, 72, 153, 0.15)' }]}>
                <Ionicons name="location" size={20} color={THEME.colors.accent} />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardLabel}>Venue & Location</Text>
                <Text style={styles.cardValue}>{event.venue}</Text>
                <Text style={styles.cardSubValue}>{event.location}</Text>
              </View>
            </View>
          </View>

          {/* Organizer Info */}
          <View style={styles.organizerCard}>
            <View style={styles.organizerAvatar}>
              <Ionicons name="person-circle" size={36} color={THEME.colors.primaryLight} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.organizerRole}>ORGANIZER</Text>
              <Text style={styles.organizerName}>{event.organizerName || 'Verified Host'}</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Ionicons name="shield-checkmark" size={14} color={THEME.colors.success} />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </View>

          {/* About Event Description */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>About This Event</Text>
            <Text style={styles.descriptionText}>{event.description}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Booking Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomPriceLabel}>Total Price</Text>
          <Text style={styles.bottomPriceValue}>
            {event.price === 0 ? 'Free Event' : `$${event.price}`}
          </Text>
        </View>

        <CustomButton
          title={isSoldOut ? 'Sold Out' : 'Book Tickets Now'}
          onPress={() => navigation.navigate('Booking', { event })}
          disabled={isSoldOut}
          variant={isSoldOut ? 'secondary' : 'primary'}
          icon={isSoldOut ? 'close-circle' : 'ticket-outline'}
          size="lg"
          style={styles.bookNowButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.fontSize.md,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  imageContainer: {
    width: '100%',
    height: 280,
    position: 'relative',
    backgroundColor: '#1E293B',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  headerControls: {
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  floatingButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryChip: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.full,
    ...THEME.shadows.button,
  },
  categoryChipText: {
    color: THEME.colors.white,
    fontWeight: '700',
    fontSize: THEME.fontSize.xs,
  },
  content: {
    padding: THEME.spacing.md,
  },
  title: {
    fontSize: THEME.fontSize.xxl,
    fontWeight: '800',
    color: THEME.colors.text,
    marginBottom: 16,
    lineHeight: 32,
  },
  statsBanner: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statDivider: {
    width: 1,
    backgroundColor: THEME.colors.cardBorder,
    marginHorizontal: 12,
  },
  statValue: {
    fontSize: THEME.fontSize.md,
    fontWeight: '800',
    color: THEME.colors.text,
  },
  statLabel: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: THEME.colors.cardBorder,
    marginVertical: 14,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextContainer: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardValue: {
    fontSize: THEME.fontSize.sm,
    fontWeight: '700',
    color: THEME.colors.text,
    marginTop: 2,
  },
  cardSubValue: {
    fontSize: THEME.fontSize.xs,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  organizerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    marginBottom: 20,
    gap: 12,
  },
  organizerAvatar: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  organizerRole: {
    fontSize: 9,
    fontWeight: '700',
    color: THEME.colors.textMuted,
  },
  organizerName: {
    fontSize: THEME.fontSize.sm,
    fontWeight: '700',
    color: THEME.colors.text,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.full,
  },
  verifiedText: {
    fontSize: 10,
    color: THEME.colors.success,
    fontWeight: '700',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: THEME.fontSize.lg,
    fontWeight: '800',
    color: THEME.colors.text,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: THEME.fontSize.sm,
    color: THEME.colors.textSecondary,
    lineHeight: 22,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: THEME.colors.card,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingBottom: 28,
  },
  bottomPriceLabel: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    fontWeight: '600',
  },
  bottomPriceValue: {
    fontSize: THEME.fontSize.xl,
    fontWeight: '800',
    color: THEME.colors.primaryLight,
  },
  bookNowButton: {
    minWidth: 180,
  },
});
