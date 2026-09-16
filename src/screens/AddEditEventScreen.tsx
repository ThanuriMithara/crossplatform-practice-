import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Switch,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME, CATEGORIES } from '../constants/theme';
import { EventCategory, EventItem } from '../models/types';
import { eventService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';

const PRESET_IMAGES = [
  { label: 'Conference / Tech', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Concert / Music', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Art Gallery', url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Sports Match', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Food Festival', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80' },
];

export default function AddEditEventScreen({ route, navigation }: any) {
  const { isEditing, event }: { isEditing?: boolean; event?: EventItem } = route.params || {};
  const { user } = useAuth();

  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [category, setCategory] = useState<EventCategory>(event?.category || 'Tech');
  const [date, setDate] = useState(event?.date || '2026-10-20');
  const [time, setTime] = useState(event?.time || '06:00 PM - 10:00 PM');
  const [location, setLocation] = useState(event?.location || 'Colombo, Sri Lanka');
  const [venue, setVenue] = useState(event?.venue || 'BMICH Hall A');
  const [price, setPrice] = useState(event?.price !== undefined ? event.price.toString() : '20');
  const [totalSeats, setTotalSeats] = useState(event?.totalSeats !== undefined ? event.totalSeats.toString() : '100');
  const [imageUrl, setImageUrl] = useState(event?.imageUrl || PRESET_IMAGES[0].url);
  const [featured, setFeatured] = useState(event?.featured || false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: any = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!date.trim()) newErrors.date = 'Date is required';
    if (!time.trim()) newErrors.time = 'Time is required';
    if (!venue.trim()) newErrors.venue = 'Venue name is required';
    if (!location.trim()) newErrors.location = 'City / Location is required';
    if (!price.trim() || isNaN(Number(price))) newErrors.price = 'Valid price is required';
    if (!totalSeats.trim() || isNaN(Number(totalSeats)) || Number(totalSeats) < 1) {
      newErrors.totalSeats = 'Capacity must be at least 1';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);

    try {
      const payload: Partial<EventItem> = {
        title: title.trim(),
        description: description.trim(),
        category,
        date: date.trim(),
        time: time.trim(),
        location: location.trim(),
        venue: venue.trim(),
        price: parseFloat(price) || 0,
        totalSeats: parseInt(totalSeats, 10) || 50,
        imageUrl,
        featured,
        organizerName: user?.name || 'Verified Organizer',
      };

      if (isEditing && event) {
        await eventService.updateEvent(event._id || (event as any).id, payload);
        Alert.alert('Success', 'Event details updated successfully!');
      } else {
        await eventService.createEvent(payload);
        Alert.alert('Success', '🎉 Your event has been published successfully!');
      }

      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || err.message || 'Failed to save event');
    } finally {
      setIsLoading(false);
    }
  };

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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={THEME.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{isEditing ? 'Edit Event' : 'Create New Event'}</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Cover Image Preview */}
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: imageUrl }} style={styles.imagePreview} resizeMode="cover" />
          <Text style={styles.imageLabel}>Cover Image Preview</Text>
        </View>

        {/* Preset Image Chooser */}
        <Text style={styles.sectionLabel}>Select Cover Photo</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
          {PRESET_IMAGES.map((preset, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setImageUrl(preset.url)}
              style={[
                styles.presetChip,
                imageUrl === preset.url && styles.presetChipActive,
              ]}
            >
              <Text
                style={[
                  styles.presetChipText,
                  imageUrl === preset.url && styles.presetChipTextActive,
                ]}
              >
                {preset.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <CustomInput
          label="Custom Image URL (Optional)"
          placeholder="https://..."
          value={imageUrl}
          onChangeText={setImageUrl}
          icon="image-outline"
        />

        {/* Event Info Card */}
        <View style={styles.formCard}>
          <CustomInput
            label="Event Title *"
            placeholder="e.g. AI Revolution Hackathon"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
            }}
            icon="create-outline"
            error={errors.title}
          />

          {/* Category Selector */}
          <Text style={styles.fieldLabel}>Category *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {CATEGORIES.filter((c) => c.id !== 'All').map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setCategory(cat.id as EventCategory)}
                style={[
                  styles.catOption,
                  category === cat.id && styles.catOptionActive,
                ]}
              >
                <Text
                  style={[
                    styles.catOptionText,
                    category === cat.id && styles.catOptionTextActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <CustomInput
                label="Date (YYYY-MM-DD) *"
                placeholder="2026-10-25"
                value={date}
                onChangeText={(text) => {
                  setDate(text);
                  if (errors.date) setErrors((prev) => ({ ...prev, date: '' }));
                }}
                icon="calendar-outline"
                error={errors.date}
              />
            </View>
            <View style={{ flex: 1 }}>
              <CustomInput
                label="Time *"
                placeholder="06:00 PM"
                value={time}
                onChangeText={(text) => {
                  setTime(text);
                  if (errors.time) setErrors((prev) => ({ ...prev, time: '' }));
                }}
                icon="time-outline"
                error={errors.time}
              />
            </View>
          </View>

          <CustomInput
            label="Venue Name *"
            placeholder="e.g. Grand Hall, BMICH"
            value={venue}
            onChangeText={(text) => {
              setVenue(text);
              if (errors.venue) setErrors((prev) => ({ ...prev, venue: '' }));
            }}
            icon="business-outline"
            error={errors.venue}
          />

          <CustomInput
            label="City / Location *"
            placeholder="e.g. Colombo, Sri Lanka"
            value={location}
            onChangeText={(text) => {
              setLocation(text);
              if (errors.location) setErrors((prev) => ({ ...prev, location: '' }));
            }}
            icon="location-outline"
            error={errors.location}
          />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <CustomInput
                label="Price ($) *"
                placeholder="0 for Free"
                value={price}
                onChangeText={(text) => {
                  setPrice(text);
                  if (errors.price) setErrors((prev) => ({ ...prev, price: '' }));
                }}
                icon="pricetag-outline"
                keyboardType="numeric"
                error={errors.price}
              />
            </View>
            <View style={{ flex: 1 }}>
              <CustomInput
                label="Total Capacity / Seats *"
                placeholder="e.g. 150"
                value={totalSeats}
                onChangeText={(text) => {
                  setTotalSeats(text);
                  if (errors.totalSeats) setErrors((prev) => ({ ...prev, totalSeats: '' }));
                }}
                icon="people-outline"
                keyboardType="numeric"
                error={errors.totalSeats}
              />
            </View>
          </View>

          <CustomInput
            label="Detailed Description *"
            placeholder="Describe your event highlights, speakers, agenda..."
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
            }}
            icon="document-text-outline"
            multiline
            numberOfLines={4}
            error={errors.description}
          />

          {/* Featured Toggle */}
          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchLabel}>Mark as Featured Highlight</Text>
              <Text style={styles.switchSub}>Displays event prominently on Home screen carousel</Text>
            </View>
            <Switch
              value={featured}
              onValueChange={setFeatured}
              trackColor={{ false: THEME.colors.cardBorder, true: THEME.colors.primary }}
              thumbColor={featured ? THEME.colors.white : '#94A3B8'}
            />
          </View>
        </View>

        {/* Action Button */}
        <CustomButton
          title={isEditing ? 'Save Changes' : 'Publish Event'}
          onPress={handleSubmit}
          loading={isLoading}
          icon={isEditing ? 'save-outline' : 'rocket-outline'}
          size="lg"
          style={styles.submitBtn}
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
  imagePreviewContainer: {
    width: '100%',
    height: 160,
    borderRadius: THEME.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
    backgroundColor: '#1E293B',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imageLabel: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: THEME.colors.white,
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  sectionLabel: {
    fontSize: THEME.fontSize.xs,
    fontWeight: '700',
    color: THEME.colors.textSecondary,
    marginBottom: 8,
  },
  presetScroll: {
    marginBottom: 12,
  },
  presetChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.full,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    marginRight: 8,
  },
  presetChipActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primaryLight,
  },
  presetChipText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    fontWeight: '600',
  },
  presetChipTextActive: {
    color: THEME.colors.white,
  },
  formCard: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: THEME.fontSize.sm,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    marginBottom: 8,
  },
  categoryScroll: {
    marginBottom: 16,
  },
  catOption: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: THEME.colors.inputBg,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    marginRight: 8,
  },
  catOptionActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primaryLight,
  },
  catOptionText: {
    fontSize: THEME.fontSize.xs,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  catOptionTextActive: {
    color: THEME.colors.white,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  switchLabel: {
    fontSize: THEME.fontSize.sm,
    fontWeight: '700',
    color: THEME.colors.text,
  },
  switchSub: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
    maxWidth: 240,
  },
  submitBtn: {
    marginBottom: 10,
  },
});
