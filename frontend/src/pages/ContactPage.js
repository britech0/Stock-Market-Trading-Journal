import React, { useState } from 'react';
import axios from 'axios';
import '../ContactPage.css';
import { useNavigate } from 'react-router-dom';

function ContactPage() {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();


  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message) {
      setStatus('Cannot send an empty message');
      return;
    }

    try {
      
      await axios.post('/api/contact', { message });
      setStatus('Message sent successfully!');
      setMessage(''); 


    } catch (error) {
      setStatus('An error occurred. Please try again.');
      console.error('Error sending message:', error);
    }
  };

  const backHome = () => {
    navigate('/');
  }

  return (
    <div className="contact-page">
  
      <button onClick={backHome} className="back-button">Back to Homepage</button>

      <div className="faq-section">
        <h2>Help and Contact</h2>
        <p>
          Here are some frequently asked questions and information about our services:
        </p>
        <ul>
          <li><strong>Question 1:</strong> How can I get started using the Trade Tracker Journal?</li>
          <li><strong>Answer:</strong> You can start by going to the homepage and clicking the green "Add Trade" button.
          from there you will see the line graph be updated along with your trade entries below. You're able to set the timeframe of the linegraph
          to 3 modes, last 3-months, 6-months or all-time. You will be able to visually see how each trade impacts your performance on a given day. You can add as many trades as you like,
          and if you need to edit or delete a trade, then the buttons to handle that are next to each trade entry. The graph will be updated per change to trade history.</li>

          <li><strong>Question 2:</strong> I made a mistake, how do I edit my trade entry?</li>
          <li><strong>Answer:</strong> Go to the homepage's trade history, locate the specific trade, and on the right there is a blue "edit" button.</li>

          <li><strong>Question 3:</strong> How do I delete a trade entry?</li>
          <li><strong>Answer:</strong> On the homepage's trade history, locate the specific trade, and on the right click the red "delete" button.</li>

          <li><strong>Question 4:</strong> How does the graph timeframe work?</li>
          <li><strong>Answer:</strong> The time that your trade plots on the graph will be the exit date of the trade.</li>

          <li><strong>Question 5:</strong> How do I get into contact with the developer?</li>
          <li><strong>Answer:</strong> You can get in touch by sending a message below or by emailing: canb@oregonstate.edu</li>

        </ul>
        </div>

      
      <div className="message">
        <h3>Send a Message to the Developers</h3>

        <form onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            rows="5"
            className="message-box"
          />

          <button type="submit">Send Message</button>
        </form>

        {status && <p className="status-message">{status}</p>}
      </div>
      </div>
  );
}

export default ContactPage;
