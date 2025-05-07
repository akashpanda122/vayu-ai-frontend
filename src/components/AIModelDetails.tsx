import React from 'react';
import styled from 'styled-components';

// Extend DefaultTheme to ensure theme is properly typed
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      background: string;
    }
  }
}

// Define styled components with proper types and fallback values
const Container = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: ${({ theme }) => theme?.colors?.primary || '#000'};
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

const DetailCard = styled.div`
  padding: 15px;
  background: ${({ theme }) => theme?.colors?.background || '#f5f5f5'};
  border-radius: 8px;

  h3 {
    color: ${({ theme }) => theme?.colors?.secondary || '#333'};
    margin-bottom: 10px;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 5px;
    font-size: 14px;
  }
`;

interface ProgressBarProps {
  value: number;
}

const ProgressBar = styled.div<ProgressBarProps>`
  height: 8px;
  background: #ddd;
  border-radius: 4px;
  margin-top: 5px;
  overflow: hidden;

  div {
    height: 100%;
    width: ${props => props.value}%;
    background: ${({ theme }) => theme?.colors?.secondary || '#4a90e2'};
  }
`;

// Define model details interface
interface ModelDetails {
  accuracy: number;
  dataPoints: string;
  updateFreq: string;
  features: string[];
}

// Define props interface
interface AIModelDetailsProps {
  modelId: string;
}

const AIModelDetails: React.FC<AIModelDetailsProps> = ({ modelId }) => {
  const getModelDetails = (modelId: string): ModelDetails => {
    const baseDetails: Record<string, ModelDetails> = {
      'medium-res': {
        accuracy: 85,
        dataPoints: '1.2B',
        updateFreq: '2 hours',
        features: ['Temperature', 'Humidity', 'Wind', 'Precipitation']
      },
      'high-res': {
        accuracy: 92,
        dataPoints: '2.5B',
        updateFreq: '1 hour',
        features: ['Local Temperature', 'Humidity', 'Wind', 'Precipitation', 'Cloud Cover']
      },
      'pollution': {
        accuracy: 88,
        dataPoints: '800M',
        updateFreq: '3 hours',
        features: ['PM2.5', 'PM10', 'NO2', 'SO2', 'O3']
      },
      'ocean': {
        accuracy: 90,
        dataPoints: '1.5B',
        updateFreq: '4 hours',
        features: ['Wave Height', 'Wind Speed', 'Current Direction', 'Temperature']
      }
    };

    return baseDetails[modelId] || baseDetails['medium-res'];
  };

  const details: ModelDetails = getModelDetails(modelId);

  return (
    <Container>
      <Title>AI Model Specifications</Title>
      <DetailGrid>
        <DetailCard>
          <h3>Model Performance</h3>
          <div className="text-black">Accuracy: {details.accuracy}%</div>
          <ProgressBar value={details.accuracy}>
            <div />
          </ProgressBar>
          <p className="text-black">Data Points: {details.dataPoints}</p>
          <p className="text-black">Update Frequency: {details.updateFreq}</p>
        </DetailCard>

        <DetailCard>
          <h3>Features Tracked</h3>
          <ul className="text-black">
            {details.features.map((feature, index) => (
              <li key={index}>• {feature}</li>
            ))}
          </ul>
        </DetailCard>

        <DetailCard>
          <h3>Training Sources</h3>
          <ul>
            <li className="text-black">• ERA5 Reanalysis Data</li>
            <li className="text-black">• CMIP6 Climate Models</li>
            <li className="text-black">• Weather Station Networks</li>
            <li className="text-black">• Satellite Observations</li>
          </ul>
        </DetailCard>
      </DetailGrid>
    </Container>
  );
};

export default AIModelDetails;