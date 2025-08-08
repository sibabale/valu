import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import {
  Container,
  Title,
  StatusText,
  Button,
  ButtonText,
} from './HomeScreen.styles';
import { RootState } from '../store';
import { loginSuccess, logout } from '../store/slices/authSlice';

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
