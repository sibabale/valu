import React from 'react';
import styled from 'styled-components/native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { RootState } from '../store';

const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
  padding: 20px;
`;

const ProfileCard = styled.View`
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const Avatar = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: #007aff;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
  align-self: center;
`;

const Name = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 5px;
`;

const Email = styled.Text`
  font-size: 16px;
  color: #666;
  text-align: center;
  margin-bottom: 20px;
`;

const InfoRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 15px 0;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
`;

const InfoText = styled.Text`
  font-size: 16px;
  color: #333;
  margin-left: 15px;
  flex: 1;
`;

const ProfileScreen: React.FC = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  if (!isAuthenticated || !user) {
    return (
      <Container>
        <ProfileCard>
          <Name>Please login to view profile</Name>
        </ProfileCard>
      </Container>
    );
  }

  return (
    <Container>
      <ProfileCard>
        <Avatar>
          <Ionicons name="person" size={40} color="white" />
        </Avatar>
        <Name>{user.name}</Name>
        <Email>{user.email}</Email>
      </ProfileCard>

      <ProfileCard>
        <InfoRow>
          <Ionicons name="person-outline" size={20} color="#007AFF" />
          <InfoText>Account ID: {user.id}</InfoText>
        </InfoRow>
        <InfoRow>
          <Ionicons name="mail-outline" size={20} color="#007AFF" />
          <InfoText>Email: {user.email}</InfoText>
        </InfoRow>
        <InfoRow>
          <Ionicons name="shield-checkmark-outline" size={20} color="#007AFF" />
          <InfoText>Status: Active</InfoText>
        </InfoRow>
      </ProfileCard>
    </Container>
  );
};

export default ProfileScreen;
