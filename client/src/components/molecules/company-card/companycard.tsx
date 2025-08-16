import React from 'react';
import { Image } from 'react-native';
import { CompanyCardProps } from './companycard.interface';
import {
  CardContainer,
  LeftSection,
  LogoContainer,
  LogoText,
  CompanyInfo,
  CompanyName,
  TickerSymbol,
  RightSection,
  Price,
} from './companycard.styles';
import { RecommendationLabel } from '../../atoms/recommendation-label/recommendationlabel';

export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  onPress,
  ...props
}) => {
  const firstLetter = company.name.charAt(0).toUpperCase();

  const renderLogo = () => {
    if (company.logoUrl) {
      return (
        <Image
          source={{ uri: company.logoUrl }}
          style={{ width: 40, height: 40, borderRadius: 20 }}
          resizeMode="contain"
        />
      );
    }
    return <LogoText>{firstLetter}</LogoText>;
  };

  return (
    <CardContainer onPress={onPress} activeOpacity={0.8} {...props}>
      <LeftSection>
        <LogoContainer color="#808080">
          {renderLogo()}
        </LogoContainer>
        <CompanyInfo>
          <CompanyName>{company.name}</CompanyName>
          <TickerSymbol>{company.symbol}</TickerSymbol>
        </CompanyInfo>
      </LeftSection>

      <RightSection>
        {company.price > 0 && <Price>${company.price.toFixed(2)}</Price>}

        <RecommendationLabel recommendation={company.recommendation} />
      </RightSection>
    </CardContainer>
  );
};
