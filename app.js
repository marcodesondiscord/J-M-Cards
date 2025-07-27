import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover, FaCreditCard } from 'react-icons/fa';

// Styles
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Roboto', sans-serif"
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    padding: '30px 0',
    background: 'linear-gradient(135deg, #4a148c, #7b1fa2)',
    color: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  subtitle: {
    fontSize: '1.1rem',
    opacity: '0.9'
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '20px'
  },
  formContainer: {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)'
  },
  formTitle: {
    color: '#4a148c',
    marginBottom: '20px',
    fontSize: '1.5rem'
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#555'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '1rem',
    transition: 'border 0.3s'
  },
  button: {
    background: '#4a148c',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background 0.3s',
    width: '100%',
    marginTop: '10px'
  },
  cardPreview: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center'
  },
  cardContainer: {
    width: '300px',
    height: '180px',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    color: 'white',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    marginBottom: '20px'
  },
  cardLogo: {
    display: 'flex',
    justifyContent: 'flex-end',
    fontSize: '2.5rem'
  },
  cardNumber: {
    fontSize: '1.4rem',
    letterSpacing: '2px',
    margin: '15px 0',
    fontFamily: "'Courier New', monospace"
  },
  cardDetails: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  cardHolder: {
    fontSize: '0.9rem',
    textTransform: 'uppercase'
  },
  cardExpiry: {
    fontSize: '0.9rem'
  },
  listContainer: {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)'
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  cardItem: {
    cursor: 'pointer',
    transition: 'transform 0.3s',
    borderRadius: '12px',
    padding: '10px'
  },
  detailsContainer: {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
    marginTop: '20px'
  },
  detailItem: {
    marginBottom: '15px'
  },
  detailLabel: {
    fontWeight: '500',
    color: '#555',
    display: 'inline-block',
    width: '120px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '15px',
    margin: '20px 0'
  },
  statCard: {
    background: '#f5f5f5',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center'
  },
  trackerContainer: {
    margin: '25px 0',
    padding: '20px',
    background: '#f5f5f5',
    borderRadius: '8px'
  },
  alertsContainer: {
    margin: '25px 0',
    padding: '20px',
    background: '#fff3e0',
    borderRadius: '8px',
    borderLeft: '4px solid #ff9800'
  },
  alertItem: {
    padding: '10px',
    margin: '10px 0',
    background: 'white',
    borderRadius: '6px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  }
};

// Card Context
const CardContext = createContext();

const CardProvider = ({ children }) => {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [securityAlerts, setSecurityAlerts] = useState([]);

  useEffect(() => {
    const savedCards = JSON.parse(localStorage.getItem('jsm-cards')) || [];
    const savedAlerts = JSON.parse(localStorage.getItem('jsm-security-alerts')) || [];
    setCards(savedCards);
    setSecurityAlerts(savedAlerts);
  }, []);

  const saveCards = (updatedCards) => {
    setCards(updatedCards);
    localStorage.setItem('jsm-cards', JSON.stringify(updatedCards));
  };

  const saveAlerts = (updatedAlerts) => {
    setSecurityAlerts(updatedAlerts);
    localStorage.setItem('jsm-security-alerts', JSON.stringify(updatedAlerts));
  };

  const addCard = (card) => {
    const newCard = {
      ...card,
      id: Date.now().toString(),
      usageCount: 0,
      successCount: 0,
      declineCount: 0,
      usageHistory: [],
      createdAt: new Date().toISOString()
    };
    const updatedCards = [...cards, newCard];
    saveCards(updatedCards);
    return newCard;
  };

  const updateCard = (id, updates) => {
    const updatedCards = cards.map(card => 
      card.id === id ? { ...card, ...updates } : card
    );
    saveCards(updatedCards);
    if (selectedCard && selectedCard.id === id) {
      setSelectedCard({ ...selectedCard, ...updates });
    }
  };

  const deleteCard = (id) => {
    const updatedCards = cards.filter(card => card.id !== id);
    saveCards(updatedCards);
    if (selectedCard && selectedCard.id === id) {
      setSelectedCard(null);
    }
  };

  const trackUsage = (cardId, usageData) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    const newUsage = {
      id: Date.now().toString(),
      date: usageData.date || new Date().toISOString(),
      amount: parseFloat(usageData.amount),
      status: usageData.status,
      ipAddress: usageData.ipAddress,
      location: usageData.location
    };

    const updatedCard = {
      ...card,
      usageCount: card.usageCount + 1,
      successCount: card.successCount + (usageData.status === 'worked' ? 1 : 0),
      declineCount: card.declineCount + (usageData.status === 'declined' ? 1 : 0),
      lastUsed: new Date().toISOString(),
      usageHistory: [newUsage, ...card.usageHistory]
    };

    updateCard(cardId, updatedCard);
  };

  const addSecurityAlert = (alert) => {
    const newAlert = {
      ...alert,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      resolved: false
    };
    const updatedAlerts = [...securityAlerts, newAlert];
    saveAlerts(updatedAlerts);
  };

  const resolveAlert = (alertId) => {
    const updatedAlerts = securityAlerts.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    );
    saveAlerts(updatedAlerts);
  };

  return (
    <CardContext.Provider
      value={{
        cards,
        selectedCard,
        securityAlerts,
        setSelectedCard,
        addCard,
        updateCard,
        deleteCard,
        trackUsage,
        addSecurityAlert,
        resolveAlert
      }}
    >
      {children}
    </CardContext.Provider>
  );
};

// Card Image Component
const CardImage = ({ card }) => {
  const getCardIcon = (type) => {
    switch(type) {
      case 'Visa': return <FaCcVisa />;
      case 'Mastercard': return <FaCcMastercard />;
      case 'Amex': return <FaCcAmex />;
      case 'Discover': return <FaCcDiscover />;
      default: return <FaCreditCard />;
    }
  };

  const formatCardNumber = (number) => {
    if (!number) return '•••• •••• •••• ••••';
    const lastFour = number.slice(-4);
    return `•••• •••• •••• ${lastFour}`;
  };

  const getCardBackground = (type) => {
    switch(type) {
      case 'Visa': return 'linear-gradient(135deg, #1a1f71, #f79a1e)';
      case 'Mastercard': return 'linear-gradient(135deg, #eb001b, #f79e1b)';
      case 'Amex': return 'linear-gradient(135deg, #016fd0, #9cc2e1)';
      case 'Discover': return 'linear-gradient(135deg, #ff6000, #ff9900)';
      default: return 'linear-gradient(135deg, #4a148c, #7b1fa2)';
    }
  };

  return (
    <div style={{ ...styles.cardContainer, background: getCardBackground(card.type) }}>
      <div style={styles.cardLogo}>
        {getCardIcon(card.type)}
      </div>
      <div style={styles.cardNumber}>
        {formatCardNumber(card.number)}
      </div>
      <div style={styles.cardDetails}>
        <div style={styles.cardHolder}>
          {card.cardholderName || 'CARDHOLDER NAME'}
        </div>
        <div style={styles.cardExpiry}>
          {card.expiry || '••/••'}
        </div>
      </div>
    </div>
  );
};

// Card Form Component
const CardForm = () => {
  const { addCard } = React.useContext(CardContext);
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: '',
    type: '',
    cardholderName: '',
    address: '',
    city: '',
    state: '',
    postalCode: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCard = addCard(formData);
    setFormData({
      name: '',
      number: '',
      expiry: '',
      cvv: '',
      type: '',
      cardholderName: '',
      address: '',
      city: '',
      state: '',
      postalCode: ''
    });
  };

  return (
    <div style={styles.formContainer}>
      <h2 style={styles.formTitle}>Add New Card</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="name">Card Nickname</label>
          <input
            style={styles.input}
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g. My Primary Card"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="number">Card Number</label>
          <input
            style={styles.input}
            type="text"
            id="number"
            value={formData.number}
            onChange={handleChange}
            required
            placeholder="1234 5678 9012 3456"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="expiry">Expiry Date</label>
            <input
              style={styles.input}
              type="text"
              id="expiry"
              value={formData.expiry}
              onChange={handleChange}
              required
              placeholder="MM/YY"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="cvv">CVV</label>
            <input
              style={styles.input}
              type="text"
              id="cvv"
              value={formData.cvv}
              onChange={handleChange}
              required
              placeholder="123"
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="type">Card Type</label>
          <select
            style={{ ...styles.input, background: 'white' }}
            id="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="">Select Card Type</option>
            <option value="Visa">Visa</option>
            <option value="Mastercard">Mastercard</option>
            <option value="Amex">American Express</option>
            <option value="Discover">Discover</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="cardholderName">Cardholder Name</label>
          <input
            style={styles.input}
            type="text"
            id="cardholderName"
            value={formData.cardholderName}
            onChange={handleChange}
            required
            placeholder="John Doe"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="address">Address</label>
          <input
            style={styles.input}
            type="text"
            id="address"
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="123 Main St"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="city">City</label>
            <input
              style={styles.input}
              type="text"
              id="city"
              value={formData.city}
              onChange={handleChange}
              required
              placeholder="New York"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="state">State</label>
            <input
              style={styles.input}
              type="text"
              id="state"
              value={formData.state}
              onChange={handleChange}
              required
              placeholder="NY"
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="postalCode">Postal Code</label>
          <input
            style={styles.input}
            type="text"
            id="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            required
            placeholder="10001"
          />
        </div>

        <button style={styles.button} type="submit">Add Card</button>
      </form>

      <div style={styles.cardPreview}>
        <CardImage card={formData} />
      </div>
    </div>
  );
};

// Card List Component
const CardList = () => {
  const { cards, selectedCard, setSelectedCard } = React.useContext(CardContext);

  return (
    <div style={styles.listContainer}>
      <h2 style={styles.formTitle}>Your Cards ({cards.length})</h2>
      {cards.length === 0 ? (
        <p>No cards added yet. Add your first card above.</p>
      ) : (
        <div style={styles.cardsGrid}>
          {cards.map(card => (
            <div 
              key={card.id} 
              style={{ 
                ...styles.cardItem,
                background: selectedCard && selectedCard.id === card.id ? '#f3e5f5' : 'transparent'
              }}
              onClick={() => setSelectedCard(card)}
            >
              <CardImage card={card} />
              <h3 style={{ marginTop: '10px', color: '#333', fontSize: '1.1rem' }}>{card.name}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '0.9rem', color: '#666' }}>
                <span style={{ color: '#4caf50' }}>✓ {card.successCount}</span>
                <span style={{ color: '#f44336' }}>✗ {card.declineCount}</span>
                <span>Total: {card.usageCount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Usage Tracker Component
const UsageTracker = ({ card, ipInfo }) => {
  const { trackUsage } = React.useContext(CardContext);
  const [usageData, setUsageData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    status: 'worked'
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUsageData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    trackUsage(card.id, {
      ...usageData,
      ipAddress: ipInfo?.ip || 'Unknown',
      location: ipInfo ? {
        city: ipInfo.city,
        region: ipInfo.region,
        country: ipInfo.country_name
      } : null
    });
    setUsageData({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      status: 'worked'
    });
  };

  return (
    <div style={styles.trackerContainer}>
      <h3 style={{ marginBottom: '15px', color: '#4a148c' }}>Track Card Usage</h3>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="date">Date Used</label>
          <input
            style={styles.input}
            type="date"
            id="date"
            value={usageData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="amount">Amount ($)</label>
          <input
            style={styles.input}
            type="number"
            id="amount"
            value={usageData.amount}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            placeholder="0.00"
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="status">Status</label>
          <select
            style={{ ...styles.input, background: 'white' }}
            id="status"
            value={usageData.status}
            onChange={handleChange}
            required
          >
            <option value="worked">Worked</option>
            <option value="declined">Declined</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Detected IP: {ipInfo?.ip || 'Loading...'}</label>
          {ipInfo && (
            <label style={styles.label}>Location: {ipInfo.city}, {ipInfo.country_name}</label>
          )}
        </div>
        <button style={styles.button} type="submit">Add Usage</button>
      </form>
    </div>
  );
};

// Security Alerts Component
const SecurityAlerts = ({ card, ipInfo }) => {
  const { securityAlerts, addSecurityAlert, resolveAlert } = React.useContext(CardContext);
  const [reportText, setReportText] = useState('');
  const [showReportForm, setShowReportForm] = useState(false);

  const cardAlerts = securityAlerts.filter(alert => alert.cardId === card.id);

  const handleReportSubmit = () => {
    if (!reportText.trim()) return;
    
    addSecurityAlert({
      cardId: card.id,
      type: 'manual_report',
      message: reportText,
      ipAddress: ipInfo?.ip || 'Unknown',
      location: ipInfo ? `${ipInfo.city}, ${ipInfo.country_name}` : 'Unknown'
    });
    
    setReportText('');
    setShowReportForm(false);
  };

  return (
    <div style={styles.alertsContainer}>
      <h3 style={{ marginBottom: '15px', color: '#e65100', display: 'flex', alignItems: 'center' }}>
        <span>Security Alerts ({cardAlerts.length})</span>
      </h3>

      {cardAlerts.length === 0 ? (
        <p>No security alerts for this card.</p>
      ) : (
        cardAlerts.map(alert => (
          <div 
            key={alert.id} 
            style={{ 
              ...styles.alertItem,
              borderLeft: `4px solid ${alert.resolved ? '#4caf50' : '#f44336'}`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '500', color: alert.resolved ? '#4caf50' : '#f44336' }}>
              <span>
                {alert.type === 'manual_report' ? 'Manual Report' : 'Suspicious Activity'}
              </span>
              <span>
                {alert.resolved ? 'Resolved' : 'Active'}
              </span>
            </div>
            <div style={{ marginTop: '5px', fontSize: '0.9rem', color: '#555' }}>
              {alert.message}
              {alert.ipAddress && (
                <div>IP: {alert.ipAddress}</div>
              )}
              {alert.location && (
                <div>Location: {alert.location}</div>
              )}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>
              {new Date(alert.timestamp).toLocaleString()}
            </div>
            {!alert.resolved && (
              <button 
                style={{ 
                  background: alert.resolved ? '#4caf50' : '#f44336',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  marginTop: '5px'
                }}
                onClick={() => resolveAlert(alert.id)}
              >
                Mark as Resolved
              </button>
            )}
          </div>
        ))
      )}

      {showReportForm ? (
        <div style={{ marginTop: '15px' }}>
          <textarea
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              marginBottom: '10px',
              minHeight: '80px'
            }}
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder="Describe the suspicious activity..."
          />
          <div>
            <button 
              style={{ 
                background: '#f44336',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
              onClick={handleReportSubmit}
            >
              Submit Report
            </button>
            <button 
              style={{ 
                background: '#9e9e9e',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                marginLeft: '10px'
              }}
              onClick={() => setShowReportForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button 
          style={{ 
            background: '#ff9800',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            marginTop: '10px'
          }}
          onClick={() => setShowReportForm(true)}
        >
          Report Suspicious Activity
        </button>
      )}
    </div>
  );
};

// Card Details Component
const CardDetails = () => {
  const { selectedCard, deleteCard } = React.useContext(CardContext);
  const [ipInfo, setIpInfo] = useState(null);

  useEffect(() => {
    const fetchIpInfo = async () => {
      try {
        const response = await axios.get('https://ipapi.co/json/');
        setIpInfo(response.data);
      } catch (error) {
        console.error('Error fetching IP info:', error);
      }
    };
    
    fetchIpInfo();
  }, []);

  if (!selectedCard) {
    return (
      <div style={styles.detailsContainer}>
        <h2 style={styles.formTitle}>Card Details</h2>
        <p>Select a card to view details</p>
      </div>
    );
  }

  const successRate = selectedCard.usageCount > 0 
    ? Math.round((selectedCard.successCount / selectedCard.usageCount) * 100) 
    : 0;
  
  const declineRate = selectedCard.usageCount > 0 
    ? Math.round((selectedCard.declineCount / selectedCard.usageCount) * 100) 
    : 0;

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      deleteCard(selectedCard.id);
    }
  };

  return (
    <div style={styles.detailsContainer}>
      <h2 style={styles.formTitle}>Card Details: {selectedCard.name}</h2>
      
      <div style={{ marginBottom: '30px' }}>
        <h3>Card Information</h3>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>Card Type:</span>
          <span>{selectedCard.type}</span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>Number:</span>
          <span>•••• •••• •••• {selectedCard.number.slice(-4)}</span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>Expiry:</span>
          <span>{selectedCard.expiry}</span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>CVV:</span>
          <span>•••</span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>Cardholder:</span>
          <span>{selectedCard.cardholderName}</span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>Billing Address:</span>
          <span>
            {selectedCard.address}, {selectedCard.city}, {selectedCard.state} {selectedCard.postalCode}
          </span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>Added On:</span>
          <span>{new Date(selectedCard.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>Usage Statistics</h3>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#4a148c' }}>
              {selectedCard.usageCount}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Total Uses</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#4caf50' }}>
              {selectedCard.successCount}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Successful ({successRate}%)</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#f44336' }}>
              {selectedCard.declineCount}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Declined ({declineRate}%)</div>
          </div>
        </div>
      </div>

      <UsageTracker card={selectedCard} ipInfo={ipInfo} />

      {selectedCard.usageHistory.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h3>Usage History</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left', background: '#f5f5f5', fontWeight: '500' }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'left', background: '#f5f5f5', fontWeight: '500' }}>Amount</th>
                <th style={{ padding: '12px', textAlign: 'left', background: '#f5f5f5', fontWeight: '500' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', background: '#f5f5f5', fontWeight: '500' }}>IP Address</th>
                <th style={{ padding: '12px', textAlign: 'left', background: '#f5f5f5', fontWeight: '500' }}>Location</th>
              </tr>
            </thead>
            <tbody>
              {selectedCard.usageHistory.map(usage => (
                <tr 
                  key={usage.id} 
                  style={{ 
                    borderBottom: '1px solid #eee',
                    background: usage.status === 'worked' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'
                  }}
                >
                  <td style={{ padding: '12px', color: usage.status === 'worked' ? '#4caf50' : '#f44336' }}>
                    {new Date(usage.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px', color: usage.status === 'worked' ? '#4caf50' : '#f44336' }}>
                    ${usage.amount.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px', color: usage.status === 'worked' ? '#4caf50' : '#f44336' }}>
                    {usage.status === 'worked' ? '✓ Worked' : '✗ Declined'}
                  </td>
                  <td style={{ padding: '12px', color: usage.status === 'worked' ? '#4caf50' : '#f44336' }}>
                    {usage.ipAddress || 'N/A'}
                  </td>
                  <td style={{ padding: '12px', color: usage.status === 'worked' ? '#4caf50' : '#f44336' }}>
                    {usage.location ? `${usage.location.city}, ${usage.location.country}` : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <SecurityAlerts card={selectedCard} ipInfo={ipInfo} />

      <button 
        style={{ 
          background: '#f44336',
          color: 'white',
          border: 'none',
          padding: '8px 15px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          marginTop: '20px'
        }}
        onClick={handleDelete}
      >
        Delete This Card
      </button>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <CardProvider>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>
            <span role="img" aria-label="credit card">💳</span> J$M Cards
          </h1>
          <p style={styles.subtitle}>Manage your payment cards and track their usage</p>
        </header>

        <main style={styles.mainContent}>
          <CardForm />
          <CardList />
        </main>

        <CardDetails />
      </div>
    </CardProvider>
  );
};

export default App;
