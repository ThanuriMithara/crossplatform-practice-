import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EventItem } from '../models/types';
import { THEME } from '../constants/theme';

interface EventCardProps {
  event: EventItem;
  onPress: () => void;
  style?: ViewStyle;
  compact?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  style,
  compact = false,
}) => {
  const seatsRatio = event.totalSeats > 0 ? (event.availableSeats / event.totalSeats) : 0;
  const isAlmostSoldOut = event.availableSeats > 0 && event.availableSeats <= 15;
  const isSoldOut = event.availableSeats === 0;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.card, compact && styles.compactCard, style]}
    >
      {/* Event Image & Badges */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: event.imageUrl }}
          style={[styles.image, compact && styles.compactImage]}
          resizeMode="cover"
        />
        <View style={styles.badgeRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{event.category}</Text>
          </View>
          {event.featured && (
            <View style={styles.featuredBadge}>
              <Ionicons name="star" size={12} color="#FDE047" style={{ marginRight: 3 }} />
              <Text style={styles.featuredText}>Featured</Text>
            </View>
          )}
        </View>

        {/* Price Floating Tag */}
        <View style={styles.priceTag}>
          <Text style={styles.priceText}>
            {event.price === 0 ? 'FREE' : `$${event.price}`}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={compact ? 1 : 2}>
          {event.title}
        </Text>

        {/* Organizer */}
        {event.organizerName ? (
          <Text style={styles.organizerText} numberOfLines={1}>
            By <Text style={styles.organizerName}>{event.organizerName}</Text>
          </Text>
        ) : null}

        {/* Date & Time */}
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={14} color={THEME.colors.primaryLight} />
          <Text style={styles.infoText}>
            {event.date} • {event.time}
          </Text>
        </View>

        {/* Venue & Location */}
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={14} color={THEME.colors.accent} />
          <Text style={styles.infoText} numberOfLines={1}>
            {event.venue}, {event.location}
          </Text>
        </View>

        {/* Seat Availability Bar */}
        <View style={styles.seatSection}>
          <View style={styles.seatHeader}>
            <Text
              style={[
                styles.seatStatusText,
                isSoldOut
                  ? { color: THEME.colors.danger }
                  : isAlmostSoldOut
                  ? { color: THEME.colors.warning }
                  : { color: THEME.colors.textSecondary },
              ]}
            >
              {isSoldOut
                ? 'Sold Out'
                : isAlmostSoldOut
                ? `Hurry! Only ${event.availableSeats} seats left`
                : `${event.availableSeats} of ${event.totalSeats} seats available`}
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.min(100, Math.max(5, seatsRatio * 100))}%` },
                isSoldOut
                  ? { backgroundColor: THEME.colors.danger }
                  : isAlmostSoldOut
                  ? { backgroundColor: THEME.colors.warning }
                  : { backgroundColor: THEME.colors.primaryLight },
              ]}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    marginBottom: THEME.spacing.md,
    overflow: 'hidden',
    ...THEME.shadows.card,
  },
  compactCard: {
    width: 280,
    marginRight: 14,
    marginBottom: 0,
  },
  imageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
    backgroundColor: '#1E293B',
  },
  compactImage: {
    height: 140,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    gap: 6,
  },
  categoryBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 0.8,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryText: {
    color: THEME.colors.white,
    fontSize: THEME.fontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  featuredBadge: {
    backgroundColor: 'rgba(217, 119, 6, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredText: {
    color: THEME.colors.white,
    fontSize: THEME.fontSize.xs,
    fontWeight: '700',
  },
  priceTag: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.borderRadius.md,
    ...THEME.shadows.button,
  },
  priceText: {
    color: THEME.colors.white,
    fontWeight: '800',
    fontSize: THEME.fontSize.sm,
  },
  content: {
    padding: 14,
  },
  title: {
    fontSize: THEME.fontSize.lg,
    fontWeight: '700',
    color: THEME.colors.text,
    marginBottom: 4,
    lineHeight: 22,
  },
  organizerText: {
    fontSize: THEME.fontSize.xs,
    color: THEME.colors.textMuted,
    marginBottom: 8,
  },
  organizerName: {
    color: THEME.colors.textSecondary,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  infoText: {
    fontSize: THEME.fontSize.xs,
    color: THEME.colors.textSecondary,
    flex: 1,
  },
  seatSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  seatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  seatStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  progressBarBg: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
});
