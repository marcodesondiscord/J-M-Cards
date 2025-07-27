 <label>Type of Card:</label>
                  <select
                    name="cardType"
                    value={formData.cardType}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Type</option>
                    <option value="Visa">Visa</option>
                    <option value="Mastercard">Mastercard</option>
                    <option value="American Express">American Express</option>
                    <option value="Discover">Discover</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Debit or Credit:</label>
                  <select
                    name="debitOrCredit"
                    value={formData.debitOrCredit}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Type</option>
                    <option value="Debit">Debit</option>
                    <option value="Credit">Credit</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">💳 Generate Secure Card</button>
                <button type="button" onClick={() => setShowForm(false)} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="cards-grid">
          {cards.length === 0 ? (
            <div className="no-cards">
              <div className="empty-state">
                <div className="empty-icon-container">
                  <div className="empty-icon">💳</div>
                  <div className="empty-sparkles">
                    <span className="sparkle">✨</span>
                    <span className="sparkle">💫</span>
                    <span className="sparkle">⭐</span>
                  </div>
                </div>
                <h3>No payment methods added yet</h3>
                <p>Add your first secure payment method to get started</p>
              </div>
            </div>
          ) : (
            cards.map(card => (
              <div key={card.id} className="card-wrapper">
                <div 
                  className="credit-card clickable-card"
                  style={{ background: getCardBrandImage(card.cardType) }}
                  onClick={() => toggleCardExpansion(card.id)}
                >
                  <div className="card-top">
                    <div className="card-chip"></div>
                    <div className="card-brand">{card.cardType}</div>
                  </div>
                  <div className="card-number">
                    {card.maskedNumber}
                  </div>
                  <div className="card-bottom">
                    <div className="card-holder">
                      <div className="label">CARDHOLDER</div>
                      <div className="name">{card.cardholderName}</div>
                    </div>
                    <div className="card-expiry">
                      <div className="label">EXPIRES</div>
                      <div className="date">{card.expiryDate}</div>
                    </div>
                  </div>
                  <div className="card-hologram"></div>
                  <div className="expand-indicator">
                    {card.isExpanded ? '▼' : '▶'} Click to {card.isExpanded ? 'collapse' : 'expand'}
                  </div>
                </div>
                
                {card.isExpanded && (
                <div className="card-details">
                  <div className="card-header">
                    <h3>{card.nickname}</h3>
                    <div className="card-actions">
                      <span className={`status-indicator ${card.status?.toLowerCase().replace(' ', '-')}`}>
                        {card.status === 'Working' ? '✅' : card.status === 'Not Working' ? '❌' : '⏳'} {card.status}
                      </span>
                      <button onClick={() => handleDeleteRequest(card.id)} className="delete-btn">×</button>
                    </div>
                  </div>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="label">Type:</span>
                      <span className="value">{card.debitOrCredit} {card.cardType}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">CCV:</span>
                      <span className="value clickable" onClick={() => copyToClipboard(card.ccv)}>{card.ccv}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Address:</span>
                      <span className="value">{card.address}, {card.city}, {card.state} {card.postalCode}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Phone:</span>
                      <span className="value clickable" onClick={() => copyToClipboard(card.phoneNumber)}>{card.phoneNumber}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Added:</span>
                      <span className="value">{card.dateAdded}</span>
                    </div>
                  </div>
                  
                  <div className="card-reviews">
                    <div className="review-header">
                      <h4>Reviews & Status</h4>
                      <button 
                        className="add-review-btn" 
                        onClick={() => {
                          setShowReviewForm(card.id);
                          if (!reviewData[card.id]) {
                            setReviewData({ ...reviewData, [card.id]: { status: '', comment: '' } });
                          }
                        }}
                      >
                        + Add Review
                      </button>
                    </div>
                    
                    {card.reviews && card.reviews.length > 0 && (
                      <div className="reviews-list">
                        {card.reviews.map(review => (
                          <div key={review.id} className="review-item">
                            <div className="review-status">
                              {review.status === 'Working' ? '✅' : '❌'} {review.status}
                              {review.username && <span style={{marginLeft: '0.5rem', fontWeight: 'normal', color: '#667eea'}}>by {review.username}</span>}
                            </div>
                            <div className="review-comment">{review.comment}</div>
                            <div className="review-date">{review.date} at {review.time}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {showReviewForm === card.id && (
                      <div className="review-form">
                        <select 
                          value={reviewData[card.id]?.status || ''}
                          onChange={(e) => updateReviewData(card.id, 'status', e.target.value)}
                          className="review-status-select"
                        >
                          <option value="">Select Status</option>
                          <option value="Working">✅ Working</option>
                          <option value="Not Working">❌ Not Working</option>
                        </select>
                        <textarea
                          value={reviewData[card.id]?.comment || ''}
                          onChange={(e) => updateReviewData(card.id, 'comment', e.target.value)}
                          placeholder="Add your review comments..."
                          className="review-comment-input"
                          rows="3"
                        />
                        <div className="review-actions">
                          <button onClick={() => handleReviewSubmit(card.id)} className="submit-review-btn">
                            Submit Review
                          </button>
                          <button onClick={() => setShowReviewForm(null)} className="cancel-review-btn">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                )}
                
                {showDeleteConfirm === card.id && (
                  <div className="delete-confirm-overlay">
                    <div className="delete-confirm-modal">
                      <h3>🔐 Password Required</h3>
                      <p>Enter password to delete this card:</p>
                      <input
                        type="password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder="Enter password"
                        className="delete-password-input"
                      />
                      <div className="delete-confirm-actions">
                        <button onClick={() => confirmDelete(card.id)} className="confirm-delete-btn">
                          Delete Card
                        </button>
                        <button onClick={() => setShowDeleteConfirm(null)} className="cancel-delete-btn">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
