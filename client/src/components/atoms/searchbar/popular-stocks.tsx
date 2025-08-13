import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

interface PopularStocksProps {
  onStockSelect: (stock: string) => void;
  selectedStock?: string;
}

const Container = styled.View`
  padding: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background-color: #ffffff;
`;

const Title = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 12px;
  font-family: 'Space Grotesk';
`;

const StocksContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

const StockPill = styled(TouchableOpacity)<{ isSelected: boolean }>`
  padding: 4px 12px;
  border-radius: 20px;
  background-color: ${(props: { isSelected: boolean }) =>
    props.isSelected ? '#3b82f6' : 'transparent'};
  border: 1px solid
    ${(props: { isSelected: boolean }) =>
      props.isSelected ? '#3b82f6' : '#d1d5db'};
`;

const StockText = styled.Text<{ isSelected: boolean }>`
  font-size: 12px;
  font-weight: 500;
  color: ${(props: { isSelected: boolean }) =>
    props.isSelected ? '#ffffff' : '#374151'};
  font-family: 'Space Grotesk';
`;

export const PopularStocks: React.FC<PopularStocksProps> = ({
  onStockSelect,
  selectedStock,
}) => {
  const popularStocks = ['AAPL', 'GOOGL', 'MSFT', 'SPOT'];

  return (
    <Container>
      <Title>Popular</Title>
      <StocksContainer>
        {popularStocks.map(stock => (
          <StockPill
            key={stock}
            isSelected={selectedStock === stock}
            onPress={() => onStockSelect(stock)}
          >
            <StockText isSelected={selectedStock === stock}>{stock}</StockText>
          </StockPill>
        ))}
      </StocksContainer>
    </Container>
  );
};
