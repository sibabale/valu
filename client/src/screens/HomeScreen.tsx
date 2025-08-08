import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import styled from 'styled-components/native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { RootState } from '../store';
import { loginSuccess, logout } from '../store/slices/authSlice';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  padding: 20px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
`;

const Button = styled.TouchableOpacity`
  background-color: #007aff;
  padding: 15px 30px;
  border-radius: 8px;
  margin: 10px 0;
  flex-direction: row;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: bold;
  margin-left: 10px;
`;

const StatusText = styled.Text`
  font-size: 16px;
  color: #666;
  margin: 10px 0;
`;

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleLogin = () => {
    dispatch(
      loginSuccess({
        user: {
          id: '1',
          email: 'user@example.com',
          name: 'John Doe',
        },
        token: 'sample-token',
      })
    );
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Container>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <Title>Welcome to Valu App</Title>

        <StatusText>
          Status: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
        </StatusText>

        {user && <StatusText>User: {user.name}</StatusText>}

        {!isAuthenticated ? (
          <Button onPress={handleLogin}>
            <Ionicons name="log-in" size={20} color="white" />
            <ButtonText>Login</ButtonText>
          </Button>
        ) : (
          <Button onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color="white" />
            <ButtonText>Logout</ButtonText>
          </Button>
        )}
      </Animated.View>
    </Container>
  );
};

export default HomeScreen;
