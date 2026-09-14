import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="privacy-page">
      <h1>Privacy Policy</h1>
      
      <div className="privacy-content">
        <h2>Data Collection and Usage</h2>
        <p>
          Peak Translation is designed with privacy in mind. We collect minimal data 
          necessary to provide the translation and vocabulary features.
        </p>
        
        <h3>What We Collect</h3>
        <ul>
          <li>Selected text for translation (processed temporarily)</li>
          <li>Vocabulary words you choose to save</li>
          <li>Basic usage statistics (anonymous)</li>
        </ul>
        
        <h3>How We Use Your Data</h3>
        <ul>
          <li>Selected text is used only to provide translations and is not stored</li>
          <li>Saved vocabulary is stored locally in your browser/storage</li>
          <li>We do not sell or share your personal data with third parties</li>
        </ul>
        
        <h3>Data Storage</h3>
        <p>
          Your vocabulary is stored locally using browser storage mechanisms:
          <ul>
            <li>Firefox Extension: Uses browser.storage.sync</li>
            <li>Web Application: Uses localStorage</li>
          </ul>
          This means your data stays on your device unless you choose to export it.
        </p>
        
        <h3>External Services</h3>
        <p>
          Peak Translation may use external translation providers (like LibreTranslate) 
          to provide translation services. When using these services, your selected 
          text may be sent to their servers for processing. We recommend reviewing 
          their privacy policies if you have concerns.
        </p>
        
        <h3>Children's Privacy</h3>
        <p>
          Peak Translation is not directed at children under 13. We do not knowingly 
          collect personal information from children under 13.
        </p>
        
        <h3>Changes to This Policy</h3>
        <p>
          We may update our privacy policy from time to time. We will notify you 
          of any changes by posting the new privacy policy on this page.
        </p>
        
        <h3>Contact Us</h3>
        <p>
          If you have any questions about this privacy policy, please contact us 
          through our official channels.
        </p>
      </div>
    </div>
  );
};

export default Privacy;
