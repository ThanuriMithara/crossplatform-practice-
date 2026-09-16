import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { THEME } from '../constants/theme';
import { EventCategory, EventItem } from '../models/types';
import { eventService } from '../services/api';
import { CustomInput } from '../components/CustomInput';
import { CategoryChips } from '../components/CategoryChips';
import { EventCard } from '../components/EventCard';
import { EmptyState } from '../components/EmptyState';

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchEvents = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const data = await eventService.getEvents({
        search: searchQuery.trim() || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
      });
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const featuredEvents = events.filter((e) => e.featured);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchEvents(true)}
            tintColor={THEME.colors.primaryLight}
            colors={[THEME.colors.primary]}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Header Bar */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.greetingText}>
              Welcome back, {user?.name?.split(' ')[0] || 'Explorer'} 👋
            </Text>
            <Text style={styles.locationSubText}>
              <Ionicons name="location-sharp" size={14} color={THEME.colors.accent} /> Colombo, Sri Lanka
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Profile')}
            style={styles.avatarButton}
          >
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>{user?.name?.charAt(0) || 'U'}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <CustomInput
            placeholder="Search events, concerts, workshops..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            icon="search-outline"
            containerStyle={{ marginBottom: 0 }}
          />
        </View>

        {/* Category Horizontal Pills */}
        <CategoryChips
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {isLoading && !isRefreshing ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={THEME.colors.primary} />
            <Text style={styles.loaderText}>Discovering experiences...</Text>
          </View>
        ) : (
          <>
            {/* Featured Events Horizontal Slider */}
            {featuredEvents.length > 0 && !searchQuery && selectedCategory === 'All' && (
              <View style={styles.featuredSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>🔥 Featured Highlights</Text>
                  <Text style={styles.sectionSub}>Handpicked popular experiences</Text>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.featuredList}
                >
                  {featuredEvents.map((evt) => (
                    <EventCard
                      key={evt._id || evt.id}
                      event={evt}
                      compact
                      onPress={() => navigation.navigate('EventDetails', { eventId: evt._id || evt.id })}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            {/* All Events Vertical Feed */}
            <View style={styles.allEventsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {selectedCategory === 'All' ? 'Upcoming Events' : `${selectedCategory} Events`}
                </Text>
                <Text style={styles.resultsCount}>
                  {events.length} {events.length === 1 ? 'event' : 'events'} found
                </Text>
              </View>

              {events.length === 0 ? (
                <EmptyState
                  icon="search"
                  title="No Events Found"
                  description="We couldn't find any events matching your criteria. Try changing category or search terms."
                  actionTitle="Reset Filters"
                  onAction={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                />
              ) : (
                events.map((evt) => (
                  <EventCard
                    key={evt._id || evt.id}
                    event={evt}
                    onPress={() => navigation.navigate('EventDetails', { eventId: evt._id || evt.id })}
                  />
                ))
              )}
            </View>
          </>
        )}
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
    paddingBottom: 40,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
    paddingTop: THEME.spacing.lg,
    marginBottom: THEME.spacing.md,
  },
  greetingText: {
    fontSize: THEME.fontSize.xl,
    fontWeight: '800',
    color: THEME.colors.text,
  },
  locationSubText: {
    fontSize: THEME.fontSize.xs,
    color: THEME.colors.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  avatarButton: {
    borderWidth: 2,
    borderColor: THEME.colors.primary,
    borderRadius: 22,
    overflow: 'hidden',
  },
  avatarImg: {
    width: 44,
    height: 44,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: THEME.colors.white,
    fontWeight: '800',
    fontSize: 18,
  },
  searchSection: {
    paddingHorizontal: THEME.spacing.md,
    marginBottom: 4,
  },
  featuredSection: {
    marginVertical: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: THEME.spacing.md,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: THEME.fontSize.lg,
    fontWeight: '800',
    color: THEME.colors.text,
  },
  sectionSub: {
    fontSize: THEME.fontSize.xs,
    color: THEME.colors.textMuted,
  },
  resultsCount: {
    fontSize: THEME.fontSize.xs,
    color: THEME.colors.textSecondary,
    fontWeight: '600',
  },
  featuredList: {
    paddingHorizontal: THEME.spacing.md,
  },
  allEventsSection: {
    paddingHorizontal: THEME.spacing.md,
    marginTop: 12,
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
  },
  loaderText: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.fontSize.sm,
    marginTop: 12,
  },
});