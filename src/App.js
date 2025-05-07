import React, { useState, useEffect } from 'react';
import WebFont from 'webfontloader';
import './App.css';
import { db } from './firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

// Load Futura Lt BT font from CDN
WebFont.load({
  custom: {
    families: ['Futura Lt BT:400,700'],
    urls: ['https://fonts.cdnfonts.com/css/futura-lt-bt']
  }
});

function App() {
  const [timeLeft, setTimeLeft] = useState({
    days: 18,
    hours: 8,
    minutes: 43,
    seconds: 31
  });
  const [animate, setAnimate] = useState({
    days: false,
    hours: false,
    minutes: false,
    seconds: false
  });

  const [email, setEmail] = useState('');
  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    success: false,
    error: null
  });

  useEffect(() => {
    // Set the countdown date (for demo purposes, we'll use a fixed time in the future)
    const countDownDate = new Date();
    countDownDate.setDate(countDownDate.getDate() + timeLeft.days);
    countDownDate.setHours(countDownDate.getHours() + timeLeft.hours);
    countDownDate.setMinutes(countDownDate.getMinutes() + timeLeft.minutes);
    countDownDate.setSeconds(countDownDate.getSeconds() + timeLeft.seconds);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(prev => {
        // Animate only if value changed
        if (days !== prev.days) triggerAnimate('days');
        if (hours !== prev.hours) triggerAnimate('hours');
        if (minutes !== prev.minutes) triggerAnimate('minutes');
        if (seconds !== prev.seconds) triggerAnimate('seconds');
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) return;
    
    // Set loading state
    setSubmitStatus({ loading: true, success: false, error: null });
    
    try {
      // Add email to Firestore collection
      await addDoc(collection(db, 'subscribers'), {
        email: email,
        subscribedAt: Timestamp.now()
      });
      
      // Success state
      setSubmitStatus({ loading: false, success: true, error: null });
      setEmail('');
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitStatus({ loading: false, success: false, error: null });
      }, 3000);
      
    } catch (error) {
      console.error('Error adding subscriber: ', error);
      setSubmitStatus({ loading: false, success: false, error: error.message });
    }
  };

  // Helper to trigger animation for a unit
  const triggerAnimate = (unit) => {
    setAnimate(prev => ({ ...prev, [unit]: false }));
    setTimeout(() => {
      setAnimate(prev => ({ ...prev, [unit]: true }));
      setTimeout(() => {
        setAnimate(prev => ({ ...prev, [unit]: false }));
      }, 600); // match animation duration
    }, 10);
  };

  // Function to format numbers with leading zeros
  const formatNumber = (num) => {
    return num < 10 ? `0${num}` : `${num}`;
  };

  return (
    <>
      {/* Background image that can be scrolled */}
      <div className="scrollable-bg">
        <img src="/Background.png" alt="BB Studios Background" className="background-image" />
      </div>
      
      {/* Fixed content overlay */}
      <div className="fixed-content">
        <div className="logo">BB</div>
        <div className="studio-text">STUDIOS</div>
        
        <div className="coming-soon">
          We are Coming soon
        </div>
        
        <div className="countdown-container">
          {/* Days - split into individual digits */}
          <div className="digit-container">
            {formatNumber(timeLeft.days).split('').map((digit, index) => (
              <div key={`days-${index}`} className="countdown-digit">
                <div className={`digit-number${animate.days ? ' timer-animate' : ''}`}>{digit}</div>
              </div>
            ))}
          </div>
          
          <div className="countdown-separator">:</div>
          
          {/* Hours - split into individual digits */}
          <div className="digit-container">
            {formatNumber(timeLeft.hours).split('').map((digit, index) => (
              <div key={`hours-${index}`} className="countdown-digit">
                <div className={`digit-number${animate.hours ? ' timer-animate' : ''}`}>{digit}</div>
              </div>
            ))}
          </div>
          
          <div className="countdown-separator">:</div>
          
          {/* Minutes - split into individual digits */}
          <div className="digit-container">
            {formatNumber(timeLeft.minutes).split('').map((digit, index) => (
              <div key={`minutes-${index}`} className="countdown-digit">
                <div className={`digit-number${animate.minutes ? ' timer-animate' : ''}`}>{digit}</div>
              </div>
            ))}
          </div>
          
          <div className="countdown-separator">:</div>
          
          {/* Seconds - split into individual digits */}
          <div className="digit-container">
            {formatNumber(timeLeft.seconds).split('').map((digit, index) => (
              <div key={`seconds-${index}`} className="countdown-digit">
                <div className={`digit-number${animate.seconds ? ' timer-animate' : ''}`}>{digit}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="notification-text">
          <p>Get ready to notify when we are ready</p>
        </div>
        
        <form className="email-form" onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Enter Your Email" 
            value={email} 
            onChange={handleEmailChange} 
            disabled={submitStatus.loading}
            required 
          />
          <button 
            type="submit" 
            disabled={submitStatus.loading}
            className={submitStatus.loading ? 'loading' : ''}
          >
            {submitStatus.loading ? 'SENDING...' : 'SEND'}
          </button>
          
          {submitStatus.success && (
            <div className="success-message">
              Thank you for subscribing! We'll notify you when we launch.
            </div>
          )}
          
          {submitStatus.error && (
            <div className="error-message">
              Error: {submitStatus.error}
            </div>
          )}
        </form>
      </div>
    </>
  );
}

export default App;
