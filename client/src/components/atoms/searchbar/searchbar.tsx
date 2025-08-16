import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, ScrollView, Animated, View, Keyboard } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { usePostHog } from 'posthog-react-native';
import { RootState } from '../../../store';
import TrendUpIcon from '../icons/trend-up';
import HistoryIcon from '../icons/history';
import SearchIcon from '../icons/search';
import CloseIcon from '../icons/close';
import {
  addRecentSearch,
  clearRecentSearches,
} from '../../../store/slices/searchSlice';
import { SearchbarProps } from './searchbar.interface';

import {
  Container,
  SearchContainer,
  SearchIconContainer,
  IconContainer,
  SearchInput,
  CloseButton,
  DropdownContainer,
  DropdownCard,
  DropdownContent,
  SectionHeader,
  SectionTitle,
  ClearButtonText,
  TagsContainer,
  TagButton,
  TagText,
} from './searchbar.styles';

export const Searchbar: React.FC<SearchbarProps> = ({
  disabled,
  searchQuery,
  popularStocks,
  onSearchChange,
  companiesData = [],
}) => {
  const posthog = usePostHog();
  const dispatch = useDispatch();
  const { recentSearches, popularStocks: reduxPopularStocks } = useSelector(
    (state: RootState) => state.search
  );
  const stocksToShow = popularStocks || reduxPopularStocks;

  const [isFocused, setIsFocused] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [spinInAnim] = useState(new Animated.Value(0));
  const [spinOutAnim] = useState(new Animated.Value(1));
  const [scaleAnim] = useState(new Animated.Value(1));
  const [showXIcon, setShowXIcon] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<View>(null);
  const searchInputRef = useRef<any>(null);
  const isDropdownInteraction = useRef(false);

  useEffect(() => {
    if (isFocused && !searchQuery) {
      // Delay dropdown appearance to midway through scale animation
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      }, 250); // Delay by 250ms (midway through 500ms scale animation)
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [isFocused, searchQuery, fadeAnim]);

  // Animate X icon when input is focused
  useEffect(() => {
    if (isFocused) {
      // Delay X icon animation to quarter way through scale animation
      setTimeout(() => {
        // Animate in - reset out animation and animate in
        spinOutAnim.setValue(0);
        Animated.timing(spinInAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      }, 200); // Delay by 200ms (quarter way through 800ms scale animation)
    } else {
      // Animate out - reset in animation and animate out
      spinInAnim.setValue(0);
      Animated.timing(spinOutAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [isFocused, spinInAnim, spinOutAnim]);

  // Resolve search term to ticker symbol
  const resolveToTickerSymbol = (query: string): string | null => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return null;

    // If companiesData is empty, use simple regex validation
    if (companiesData.length === 0) {
      const tickerRegex = /^[A-Z]{1,5}$/;
      return tickerRegex.test(trimmedQuery.toUpperCase()) ? trimmedQuery.toUpperCase() : null;
    }

    // Find exact ticker symbol match first
    const exactSymbolMatch = companiesData.find(
      company => company.symbol?.toUpperCase() === trimmedQuery.toUpperCase()
    );
    if (exactSymbolMatch) {
      return exactSymbolMatch.symbol?.toUpperCase() || null;
    }

    // Find company name match
    const nameMatches = companiesData.filter(
      company => company.name.toUpperCase().includes(trimmedQuery.toUpperCase())
    );

    // Only return if there's exactly one match
    if (nameMatches.length === 1) {
      return nameMatches[0].symbol?.toUpperCase() || null;
    }

    return null;
  };

  const addToRecent = (query: string) => {
    const tickerSymbol = resolveToTickerSymbol(query);
    if (tickerSymbol) {
      dispatch(addRecentSearch(tickerSymbol));
    }
  };

  const handleSearch = (query: string) => {
    if (disabled) return;
    onSearchChange(query);

    // Track search query (debounced to avoid spam)
    if (posthog && query.length >= 2) {
      const searchResults = companiesData.filter(
        company => {
          const name = company.name?.toLowerCase() || '';
          const symbol = company.symbol?.toLowerCase() || '';
          const sector = company.sector?.toLowerCase() || '';
          const industry = company.industry?.toLowerCase() || '';
          const searchTerm = query.toLowerCase();

          return name.includes(searchTerm) || symbol.includes(searchTerm) || sector.includes(searchTerm) || industry.includes(searchTerm);
        }
      );

      posthog.capture('search_query_entered', {
        query: query.toLowerCase(),
        query_length: query.length,
        results_count: searchResults.length,
        has_results: searchResults.length > 0,
        timestamp: new Date().toISOString(),
      });
    }

    // Don't automatically add to recent searches on every keystroke
    // Only add when a valid company is selected
  };

  const handleClearInput = () => {
    if (disabled) return;

    // Track search clear action
    if (posthog && searchQuery) {
      posthog.capture('search_cleared', {
        had_query: !!searchQuery,
        query_length: searchQuery.length,
        timestamp: new Date().toISOString(),
      });
    }

    onSearchChange('');
    setIsFocused(false);

    // Defocus the input field
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  };

  const clearRecent = () => {
    // Track recent searches clear action
    if (posthog && recentSearches.length > 0) {
      posthog.capture('recent_searches_cleared', {
        searches_cleared: recentSearches.length,
        timestamp: new Date().toISOString(),
      });
    }

    dispatch(clearRecentSearches());
  };

  const handleFocus = () => {
    if (disabled) return;
    setIsFocused(true);

    // Bounce animation when focused
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Track search focus
    if (posthog) {
      posthog.capture('search_focused', {
        timestamp: new Date().toISOString(),
        has_recent_searches: recentSearches.length > 0,
        recent_searches_count: recentSearches.length,
      });
    }
  };

  const handleBlur = () => {
    // Only dismiss dropdown if we're not interacting with it
    if (!isDropdownInteraction.current) {
      setTimeout(() => setIsFocused(false), 200);

      // Track search abandonment
      if (posthog && searchQuery && searchQuery.length >= 2) {
        const searchResults = companiesData.filter(
          company => {
            const name = company.name?.toLowerCase() || '';
            const symbol = company.symbol?.toLowerCase() || '';
            const searchTerm = searchQuery.toLowerCase();
            return name.includes(searchTerm) || symbol.includes(searchTerm);
          }
        );

        posthog.capture('search_abandoned', {
          query: searchQuery.toLowerCase(),
          query_length: searchQuery.length,
          results_available: searchResults.length,
          had_results: searchResults.length > 0,
          timestamp: new Date().toISOString(),
        });
      }

      // Add to recent searches when blurring if there's a valid search query
      if (searchQuery.trim()) {
        addToRecent(searchQuery.trim());
      }
    }
  };

  const handleDropdownPressIn = () => {
    isDropdownInteraction.current = true;
  };

  const handleDropdownPressOut = () => {
    // Reset the flag after a short delay to allow for the onPress to execute
    setTimeout(() => {
      isDropdownInteraction.current = false;
    }, 100);
  };

  return (
    <>
      <Container>
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
          }}
        >
          <SearchContainer isFocused={isFocused} disabled={disabled}>
            <SearchIconContainer>
              <SearchIcon fill="#99a1af" height="20px" width="20px" />
            </SearchIconContainer>

            <SearchInput
              ref={searchInputRef}
              placeholder="Search stocks..."
              placeholderTextColor={disabled ? "#d1d5db" : "#9ca3af"}
              value={searchQuery}
              onChangeText={handleSearch}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onSubmitEditing={() => {
                if (disabled) return;
                // Add to recent searches when user submits the search
                if (searchQuery.trim()) {
                  addToRecent(searchQuery.trim());
                }
              }}

              editable={!disabled}
            />

            <Animated.View
              style={{
                opacity: Animated.subtract(1, spinOutAnim),
                transform: [
                  {
                    rotate: Animated.add(
                      spinInAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '90deg'],
                      }),
                      spinOutAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['90deg', '0deg'],
                      })
                    ),
                  },
                ],
              }}
            >
              <CloseButton testID="close-button" onPress={handleClearInput}>
                <CloseIcon fill="#99a1af" height="20px" width="20px" />
              </CloseButton>
            </Animated.View>
          </SearchContainer>
        </Animated.View>
      </Container>

      <Animated.View
          ref={dropdownRef}
          onTouchStart={handleDropdownPressIn}
          onTouchEnd={handleDropdownPressOut}
          style={{
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-10, 0],
                }),
              },
            ],
          }}
        >
          <DropdownContainer>
            <DropdownCard>
              <DropdownContent>
                {recentSearches.length > 0 && (
                  <ScrollView>
                    <SectionHeader>
                      <IconContainer>
                        <HistoryIcon
                          height="16px"
                          width="16px"
                          fill="#1E2939"
                        />
                      </IconContainer>
                      <SectionTitle>Recent</SectionTitle>
                      <TouchableOpacity
                        onPressIn={handleDropdownPressIn}
                        onPress={clearRecent}
                        style={{ marginLeft: 'auto' }}
                      >
                        <ClearButtonText>Clear</ClearButtonText>
                      </TouchableOpacity>
                    </SectionHeader>

                    <TagsContainer>
                      {recentSearches.map((search) => (
                        <TagButton
                          key={search}
                          onPressIn={handleDropdownPressIn}
                          onPress={() => {
                            handleSearch(search);

                            // Track recent search selection
                            if (posthog) {
                              posthog.capture('recent_search_selected', {
                                search_term: search,
                                timestamp: new Date().toISOString(),
                              });
                            }

                            Keyboard.dismiss();
                            setIsFocused(false);
                          }}
                        >
                          <TagText>{search.toUpperCase()}</TagText>
                        </TagButton>
                      ))}
                    </TagsContainer>
                  </ScrollView>
                )}

                {stocksToShow && stocksToShow.length > 0 && (
                  <ScrollView>
                    <SectionHeader>
                      <IconContainer>
                        <TrendUpIcon
                          height="16px"
                          width="16px"
                          fill="#1E2939"
                        />
                      </IconContainer>
                      <SectionTitle>Popular</SectionTitle>
                    </SectionHeader>

                    <TagsContainer>
                      {stocksToShow.map((stock) => (
                        <TagButton
                          key={stock}
                          onPressIn={handleDropdownPressIn}
                          onPress={() => {
                            handleSearch(stock);
                            dispatch(addRecentSearch(stock));

                            // Track popular stock selection
                            if (posthog) {
                              posthog.capture('popular_stock_selected', {
                                stock_symbol: stock,
                                timestamp: new Date().toISOString(),
                              });
                            }

                            Keyboard.dismiss();
                            setIsFocused(false);
                          }}
                        >
                          <TagText>{stock}</TagText>
                        </TagButton>
                      ))}
                    </TagsContainer>
                  </ScrollView>
                )}
              </DropdownContent>
            </DropdownCard>
          </DropdownContainer>
        </Animated.View>
      )}
    </>
  );
};
