import React from 'react';
import { message } from 'antd';
import { FaFacebook, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { MdContentCopy } from "react-icons/md";
import { QRCodeSVG } from 'qrcode.react';
import { FiDownload } from "react-icons/fi";
import html2canvas from 'html2canvas'; // Import html2canvas
import { FaXTwitter } from "react-icons/fa6";
import { GrClose } from "react-icons/gr";
const ShareModal = ({ url, onClose, name, qCardId}) => {
  const text = encodeURIComponent(`${url}`);
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${text}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${text}`,
    whatsapp: `https://wa.me/?text=${text}`,
  };

  const handleShare = (platform) => {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
  };

  const handleCopy = (textToCopy) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        message.destroy();
        message.success('Copied successfully!');
      }).catch(err => {
        console.error('Failed to copy text: ', err);
        message.error('Failed to copy.');
      });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        message.destroy();
        message.success('Copied successfully!');
    
      } catch (err) {
        console.error('Fallback: Failed to copy text: ', err);
        message.error('Failed to copy.');
      }
      document.body.removeChild(textArea);
    }
  };

  const downloadQRCode = () => {
    const qrCodeElement = document.getElementById("qrCodeElement");
    html2canvas(qrCodeElement, { backgroundColor: '#fff' }).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${name}.png`;
      link.click();
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'start',
        width: '90%',
        maxWidth: '450px',
        position: 'relative', // Make the container relative for absolute positioning of the close button
      }}>
        {/* Close Button */}
        <button onClick={onClose} style={{
          position: 'absolute',
          top: '20px',
          right: '15px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '20px',
          color: '#6E7172',
        }}>
          <GrClose />
        </button>
        
        <div style={{ fontFamily: 'Inter', fontSize: '1.5rem', color: '#000000', paddingBottom: '20px' }}>Share card</div>
        
        {/* QR Code Section */}
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '10px',
          marginBottom: '20px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div id="qrCodeElement" style={{ padding: '10px' }}>
            <QRCodeSVG value={url} size={128} />
          </div>
          <div style={{ 
            flex: 1,
            marginLeft: '10px', 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{ 
              fontFamily: 'Inter', 
              fontSize: '1.2rem', 
              color: '#000000',
              marginBottom: '5px' // Space between lines
            }}>
              Your business card
            </div>
            <div style={{ 
              fontFamily: 'Inter', 
              fontSize: '1.2rem', 
              color: '#677379'
            }}>
              QR code
            </div>
          </div>
          <button onClick={downloadQRCode} style={{
            background: 'none',
            color: '#6E7172',
            border: 'none',
            borderRadius: '4px',
            padding: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            marginLeft: '10px' // Space between text and button
          }}>
            <FiDownload style={{ fontSize: '20px' }} />
          </button>
        </div>

        {/* Unique ID Section */}
        <div style={{
          textAlign: 'left',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '10px',
          marginBottom: '20px'
        }}>
          <div style={{ fontFamily: 'Inter', fontSize: '1.2rem', color: '#000000', marginBottom: '10px' }}>Your Unique ID</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{color: '#677379'}}>{qCardId}</span>
            <button onClick={() => handleCopy(`${qCardId}`)} style={{
              background: 'none',
              color: '#6E7172',
              border: 'none',
              borderRadius: '4px',
              padding: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}>
              <MdContentCopy style={{ fontSize: '20px' }} />
            </button>
          </div>
        </div>

        {/* Card Link Section */}
        <div style={{
          textAlign: 'left',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '10px',
          marginBottom: '20px'
        }}>
          <div style={{ fontFamily: 'Inter', fontSize: '1.2rem', color: '#000000', marginBottom: '10px' }}>Your Card Link</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <a href={url} target="_blank" rel="noopener noreferrer" style={{
              color: '#6E7172',
              textDecoration: 'none',
              marginRight: '10px'
            }}>{url}</a>
            <button onClick={() => handleCopy(url)} style={{
              border: 'none',
              borderRadius: '4px',
              padding: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              background: 'none',
              color: '#6E7172',
            }}>
              <MdContentCopy style={{ fontSize: '20px' }} />
            </button>
          </div>
        </div>

        {/* Social Media Share Section */}
        <div style={{
          border: '1px solid #ddd',
          padding: '20px',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start'
        }}>
          <div style={{ 
            fontFamily: 'Inter', 
            fontSize: '1.2rem', 
            color: '#000000', 
            marginBottom: '20px'
          }}>
            Share via
          </div>
          <div style={{
            display: 'flex',
            gap: '30px',
          }}>
            <button onClick={() => handleShare('facebook')} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px',
              backgroundColor: '#242C30',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              width: '50px',
              height: '50px',
            }}>
              <FaFacebook style={{ fontSize: '24px' }} />
            </button>
            <button onClick={() => handleShare('twitter')} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px',
              backgroundColor: '#242C30',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              width: '50px',
              height: '50px',
            }}>
              <FaXTwitter style={{ fontSize: '24px' }} />
            </button>
            <button onClick={() => handleShare('linkedin')} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px',
              backgroundColor: '#242C30',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              width: '50px',
              height: '50px',
            }}>
              <FaLinkedin style={{ fontSize: '24px' }} />
            </button>
            <button onClick={() => handleShare('whatsapp')} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px',
              backgroundColor: '#242C30',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              width: '50px',
              height: '50px',
            }}>
              <FaWhatsapp style={{ fontSize: '24px' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
