import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AlertsPage.css';

interface WeatherAlert {
  id: number;
  type: 'warning' | 'alert' | 'info';
  title: string;
  description: string;
  region: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  timestamp: string;
}

interface NationalHighlight {
  title: string;
  value: string;
  icon: string;
  description: string;
}

export default function AlertsPage() {
  const [alerts] = useState<WeatherAlert[]>([
    {
      id: 1,
      type: 'warning',
      title: 'Heavy Rain Warning',
      description: 'Heavy rain expected with rainfall amounts of 2-3 inches possible. Minor flooding may occur in poor drainage areas.',
      region: 'Northern California',
      severity: 'high',
      timestamp: '2026-02-13 14:30',
    },
    {
      id: 2,
      type: 'alert',
      title: 'Wind Advisory',
      description: 'Strong winds expected with gusts up to 45 mph. Light outdoor objects may be blown around.',
      region: 'Pacific Northwest',
      severity: 'moderate',
      timestamp: '2026-02-13 12:00',
    },
    {
      id: 3,
      type: 'warning',
      title: 'Extreme Heat Warning',
      description: 'Dangerously hot conditions expected. Heat index values up to 110°F. Stay hydrated and limit outdoor activities.',
      region: 'Southwest Region',
      severity: 'critical',
      timestamp: '2026-02-13 10:15',
    },
    {
      id: 4,
      type: 'info',
      title: 'Frost Advisory',
      description: 'Frost conditions possible tonight. Temperatures may drop to 28-32°F. Protect sensitive plants.',
      region: 'Mountain Region',
      severity: 'low',
      timestamp: '2026-02-12 22:45',
    },
  ]);

  const [nationalHighlights] = useState<NationalHighlight[]>([
    {
      title: 'Highest Temperature',
      value: '95°F',
      icon: '🌡️',
      description: 'Recorded in Phoenix, Arizona',
    },
    {
      title: 'Lowest Temperature',
      value: '-15°F',
      icon: '❄️',
      description: 'Recorded in Fargo, North Dakota',
    },
    {
      title: 'Highest Wind Gust',
      value: '68 mph',
      icon: '💨',
      description: 'Recorded in Denver, Colorado',
    },
    {
      title: 'Most Precipitation',
      value: '2.8 inches',
      icon: '🌧️',
      description: 'Recorded in Seattle, Washington',
    },
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '#dc2626';
      case 'high':
        return '#ea580c';
      case 'moderate':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'alert':
        return '🚨';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  return (
    <div className="alerts-page">
      <div className="page-header">
        <Link to="/welcome" className="back-link">
          ← Back to Home
        </Link>
      </div>
      <div className="alerts-header">
        <h1>🚨 Weather Alerts</h1>
        <p>Active weather alerts and warnings for your area</p>
      </div>

      <div className="alerts-section">
        <h2>Active Alerts</h2>
        <div className="alerts-container">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="alert-box"
                style={{
                  borderLeftColor: getSeverityColor(alert.severity),
                }}
              >
                <div className="alert-header">
                  <span className="alert-icon">{getAlertIcon(alert.type)}</span>
                  <div className="alert-title-section">
                    <h3 className="alert-title">{alert.title}</h3>
                    <span className="alert-region">{alert.region}</span>
                  </div>
                  <span
                    className="severity-badge"
                    style={{ backgroundColor: getSeverityColor(alert.severity) }}
                  >
                    {alert.severity.toUpperCase()}
                  </span>
                </div>

                <p className="alert-description">{alert.description}</p>

                <div className="alert-footer">
                  <span className="alert-timestamp">
                    📅 {alert.timestamp}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-alerts">
              <p>✅ No active weather alerts at this time</p>
            </div>
          )}
        </div>
      </div>

      <div className="highlights-section">
        <h2>National Weather Highlights</h2>
        <div className="highlights-container">
          {nationalHighlights.map((highlight, index) => (
            <div key={index} className="highlight-box">
              <div className="highlight-icon">{highlight.icon}</div>
              <h3 className="highlight-title">{highlight.title}</h3>
              <div className="highlight-value">{highlight.value}</div>
              <p className="highlight-description">{highlight.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
