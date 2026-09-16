import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { THEME } from '../constants/theme';
import { CustomButton } from '../components/CustomButton';
import { CustomInput } from '../components/CustomInput';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout, switchRole, updateUser } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  // Edit Profile Modal State
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleOpenEdit = () => {
    setEditName(user?.name || '');
    setEditPhone(user?.phone || '');
    setEditBio(user?.bio || '');
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert('Validation', 'Name cannot be empty');
      return;
    }
    setIsUpdating(true);
    try {
      await updateUser({
        name: editName.trim(),
        phone: editPhone.trim(),
        bio: editBio.trim(),
      });
      setIsEditModalVisible(false);
      Alert.alert('Profile Updated', 'Your profile details have been saved successfully.');
    } catch (e: any) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of EventHub?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  const isOrganizer = user?.role === 'organizer';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>{user?.name?.charAt(0) || 'U'}</Text>
              </View>
            )}
            <View style={styles.roleTag}>
              <Ionicons
                name={isOrganizer ? 'megaphone' : 'ticket'}
                size={12}
                color={THEME.colors.white}
              />
              <Text style={styles.roleTagText}>{user?.role?.toUpperCase() || 'ATTENDEE'}</Text>
            </View>
          </View>

          <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'guest@eventhub.com'}</Text>
          {user?.bio ? <Text style={styles.userBio}>{user.bio}</Text> : null}

          <CustomButton
            title="Edit Profile"
            variant="outline"
            size="sm"
            icon="create-outline"
            onPress={handleOpenEdit}
            style={styles.editBtn}
          />
        </View>

        {/* Role Switch Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Account Mode</Text>
          <View style={styles.roleSwitchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.roleTitle}>
                {isOrganizer ? 'Organizer Mode (Active)' : 'Attendee Mode (Active)'}
              </Text>
              <Text style={styles.roleSubtitle}>
                {isOrganizer
                  ? 'You have access to create events, manage capacity, and see attendee rosters.'
                  : 'You can discover and book tickets for all events.'}
              </Text>
            </View>
            <CustomButton
              title={isOrganizer ? 'Switch to Attendee' : 'Switch to Organizer'}
              variant="secondary"
              size="sm"
              onPress={() => switchRole(isOrganizer ? 'attendee' : 'organizer')}
            />
          </View>
        </View>

        {/* Notifications & Preferences */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Preferences & Notifications</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={20} color={THEME.colors.primaryLight} />
              <View>
                <Text style={styles.settingTitle}>Booking Notifications</Text>
                <Text style={styles.settingSub}>Receive instant alerts when tickets are confirmed</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: THEME.colors.cardBorder, true: THEME.colors.primary }}
              thumbColor={notificationsEnabled ? THEME.colors.white : '#94A3B8'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="alarm-outline" size={20} color={THEME.colors.accent} />
              <View>
                <Text style={styles.settingTitle}>Event Reminders</Text>
                <Text style={styles.settingSub}>Get reminded 24 hours before your booked event</Text>
              </View>
            </View>
            <Switch
              value={remindersEnabled}
              onValueChange={setRemindersEnabled}
              trackColor={{ false: THEME.colors.cardBorder, true: THEME.colors.primary }}
              thumbColor={remindersEnabled ? THEME.colors.white : '#94A3B8'}
            />
          </View>
        </View>

        {/* App Info & About */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>About EventHub</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0 (Production Release)</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Architecture</Text>
            <Text style={styles.infoValue}>React Native Expo + Node.js REST API</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Database</Text>
            <Text style={styles.infoValue}>MongoDB Atlas (Connected)</Text>
          </View>
        </View>

        {/* Sign Out Button */}
        <CustomButton
          title="Sign Out"
          variant="danger"
          size="lg"
          icon="log-out-outline"
          onPress={handleLogout}
          style={styles.logoutBtn}
        />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={isEditModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={THEME.colors.text} />
              </TouchableOpacity>
            </View>

            <CustomInput
              label="Full Name"
              value={editName}
              onChangeText={setEditName}
              icon="person-outline"
            />

            <CustomInput
              label="Phone Number"
              value={editPhone}
              onChangeText={setEditPhone}
              icon="call-outline"
              keyboardType="phone-pad"
            />

            <CustomInput
              label="Bio"
              placeholder="Tell others about yourself..."
              value={editBio}
              onChangeText={setEditBio}
              icon="information-circle-outline"
              multiline
              numberOfLines={3}
            />

            <CustomButton
              title="Save Changes"
              onPress={handleSaveProfile}
              loading={isUpdating}
              size="md"
              style={{ marginTop: 8 }}
            />
          </View>
        </View>
      </Modal>
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
    paddingTop: THEME.spacing.lg,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.xl,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    marginBottom: 16,
    ...THEME.shadows.card,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: THEME.colors.primary,
  },
  avatarPlaceholder: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 32,
    fontWeight: '800',
    color: THEME.colors.white,
  },
  roleTag: {
    position: 'absolute',
    bottom: -4,
    alignSelf: 'center',
    backgroundColor: THEME.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.borderRadius.full,
    gap: 4,
    ...THEME.shadows.button,
  },
  roleTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: THEME.colors.white,
  },
  userName: {
    fontSize: THEME.fontSize.xl,
    fontWeight: '800',
    color: THEME.colors.text,
    marginTop: 8,
  },
  userEmail: {
    fontSize: THEME.fontSize.xs,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
  userBio: {
    fontSize: THEME.fontSize.xs,
    color: THEME.colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  editBtn: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  sectionCard: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.borderRadius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: THEME.fontSize.md,
    fontWeight: '700',
    color: THEME.colors.text,
    marginBottom: 12,
  },
  roleSwitchRow: {
    flexDirection: 'column',
    gap: 12,
  },
  roleTitle: {
    fontSize: THEME.fontSize.sm,
    fontWeight: '700',
    color: THEME.colors.primaryLight,
  },
  roleSubtitle: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 10,
  },
  settingTitle: {
    fontSize: THEME.fontSize.sm,
    fontWeight: '600',
    color: THEME.colors.text,
  },
  settingSub: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: THEME.fontSize.xs,
    color: THEME.colors.textMuted,
  },
  infoValue: {
    fontSize: THEME.fontSize.xs,
    color: THEME.colors.textSecondary,
    fontWeight: '600',
  },
  logoutBtn: {
    marginTop: 8,
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: THEME.colors.card,
    borderTopLeftRadius: THEME.borderRadius.xl,
    borderTopRightRadius: THEME.borderRadius.xl,
    padding: 24,
    borderTopWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: THEME.fontSize.lg,
    fontWeight: '800',
    color: THEME.colors.text,
  },
});