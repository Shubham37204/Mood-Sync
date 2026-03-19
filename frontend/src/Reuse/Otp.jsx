import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./Otp.css";
import "./ModalPopup.css"

const Otp = () => {
  const [screenMessage, setScreenMessage] = useState('');
  const [email, setEmail] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [access, setAccess] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    const searchParams = new URLSearchParams(location.search);
    const emailParam = searchParams.get('email');

    if (emailParam) {
      setEmail(emailParam);
      localStorage.setItem('email', emailParam);
    } else if (storedEmail) {
      setEmail(storedEmail);
    }
  }, [location.search]);

  const handleVerification = async (e, formData) => {
    e.preventDefault();
    try {
      const response = await fetch('/verify_otp', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log(data.message);

      if (data.access === 'Granted') {
        setAccess(true);
        setModalMessage(data.message);
        setShowModal(true);

      } else if (data.access === 'Denied') {
        setScreenMessage(data.message);

      } else {
        setModalMessage(data.error);
        setShowModal(true);
      }

    } catch (error) {
      console.error('Error during OTP verification:', error);
      setModalMessage('Failed to login/register');
      setShowModal(true);
    }
  };

  const handleResend = async () => {
    try {
      setScreenMessage('');

      const response = await fetch('/resend', {
        method: 'POST'
      });

      const data = await response.json();

      if (data.access === 'Granted') {
        setModalMessage(`OTP Resend Successfully to email: ${email}`);
        setShowModal(true);
        setRefresh(true);
      } else {
        setModalMessage(data.error);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error during OTP resend:', error);
      setModalMessage('An error occurred during OTP resend.');
      setShowModal(true);
    }
  };


  const handleContinue = async (e) => {
    e.preventDefault();

    const otpInput = document.getElementById('otp');
    const otpValue = otpInput.value.trim();

    if (!otpValue) {
      setModalMessage('Please enter the OTP.');
      setShowModal(true);
      return;
    }

    const formData = new FormData(document.getElementById('otp-form'));
    await handleVerification(e, formData); 
  };

  const handlePaste = (e) => {
    const pastedValue = e.clipboardData.getData('text/plain').trim();
    document.getElementById('otp').value = pastedValue;
    e.preventDefault();
  };

  const handleModalOkClick = () => {
    setShowModal(false);

    if (access) {
      window.location.href = '/Login';
    }
    else if (refresh) {
      window.location.reload();
    }
  };


  return (
    <div>
      <div className="h-screen py-20 px-3">
        <div className="container mx-auto">
          <div className="max-w-sm mx-auto md:max-w-lg">
            <div className="w-full">
              <div className="bg-white h-64 py-3 rounded text-center">
                <h1 className="text-2xl font-bold">Verification</h1>
                <div className="flex flex-col mt-4">
                  <span style={{
                    "font-weight": " 700",
                    "font-size": " 1.5pc"
                  }}>Enter the OTP you received at <span className="font-semibold">{email}</span></span>
                </div> 
                <form id="otp-form" className="flex flex-row justify-center text-center px-2 mt-5">
                  <input type="text" name="otp" id="otp" className="py-3 px-4 w-full block border-2 border-black-200 rounded-md text-2xl focus:border-blue-500 focus:ring-blue-500 shadow-sm" aria-describedby="email-error" style={{ height: "4pc" }} required onPaste={handlePaste} />
                </form>
                <div className="flex justify-center text-center mt-2">
                  <span className="text-black-500 font-bold" id="otp-error-message">{screenMessage}</span>
                </div>
                <div className="flex justify-center text-center mt-5">
                  <a to="#_" onClick={(e) => handleContinue(e)} class="rounded px-5 mr-14 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300">
                    <span class="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                    <span class="relative">Continue</span>
                  </a>
                  <a to="#_" onClick={handleResend} class="rounded px-5 mr-5 py-2.5 overflow-hidden group bg-green-500 relative hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300">
                    <span class="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                    <span class="relative">Resend OTP</span>
                  </a>
                  <i className='bx bx-caret-right ml-1'></i>
                </div>
                {showModal && (
                  <div className="modal-overlay">
                    <div className="modal-content">
                      <p className="modal-content">{modalMessage}</p>
                      <button className="modal-ok-button" onClick={handleModalOkClick}>OK</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Otp;
