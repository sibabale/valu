import React from 'react';
import { SafeAreaView } from 'react-native';
import styled from 'styled-components/native';
import { Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
`;

const Section = styled.View`
  background-color: white;
  margin: 10px 0;
`;

const SectionHeader = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  padding: 15px 20px;
  background-color: #f8f8f8;
`;

const SettingItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 15px 20px;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
`;

const SettingText = styled.Text`
  font-size: 16px;
  color: #333;
  flex: 1;
  margin-left: 15px;
`;

const SettingValue = styled.Text`
  font-size: 14px;
  color: #666;
  margin-right: 10px;
`;

export const SettingsPage: React.FC = () => {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [biometric, setBiometric] = React.useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Container>
        <Section>
          <SectionHeader>Preferences</SectionHeader>
          <SettingItem>
            <Ionicons name="notifications-outline" size={20} color="#007AFF" />
            <SettingText>Push Notifications</SettingText>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={notifications ? '#007AFF' : '#f4f3f4'}
            />
          </SettingItem>
          <SettingItem>
            <Ionicons name="moon-outline" size={20} color="#007AFF" />
            <SettingText>Dark Mode</SettingText>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={darkMode ? '#007AFF' : '#f4f3f4'}
            />
          </SettingItem>
          <SettingItem>
            <Ionicons name="finger-print-outline" size={20} color="#007AFF" />
            <SettingText>Biometric Login</SettingText>
            <Switch
              value={biometric}
              onValueChange={setBiometric}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={biometric ? '#007AFF' : '#f4f3f4'}
            />
          </SettingItem>
        </Section>

        <Section>
          <SectionHeader>Account</SectionHeader>
          <SettingItem>
            <Ionicons name="person-outline" size={20} color="#007AFF" />
            <SettingText>Edit Profile</SettingText>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </SettingItem>
          <SettingItem>
            <Ionicons name="lock-closed-outline" size={20} color="#007AFF" />
            <SettingText>Change Password</SettingText>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </SettingItem>
          <SettingItem>
            <Ionicons name="shield-outline" size={20} color="#007AFF" />
            <SettingText>Privacy Settings</SettingText>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </SettingItem>
        </Section>

        <Section>
          <SectionHeader>Support</SectionHeader>
          <SettingItem>
            <Ionicons name="help-circle-outline" size={20} color="#007AFF" />
            <SettingText>Help & Support</SettingText>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </SettingItem>
          <SettingItem>
            <Ionicons name="document-text-outline" size={20} color="#007AFF" />
            <SettingText>Terms of Service</SettingText>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </SettingItem>
          <SettingItem>
            <Ionicons name="shield-checkmark-outline" size={20} color="#007AFF" />
            <SettingText>Privacy Policy</SettingText>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </SettingItem>
        </Section>

        <Section>
          <SectionHeader>About</SectionHeader>
          <SettingItem>
            <Ionicons name="information-circle-outline" size={20} color="#007AFF" />
            <SettingText>Version</SettingText>
            <SettingValue>1.0.0</SettingValue>
          </SettingItem>
        </Section>
      </Container>
    </SafeAreaView>
  );
}; 