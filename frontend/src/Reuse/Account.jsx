import React, { useState } from 'react';
import MessageModal from './MessageModal';
import "./Account.css";
import "./ModalPopup.css";

const Account = ({}) => {
    const [modalMessage, setModalMessage] = useState(''); // Modal Popup Messages.
    const [showMessageModal, setShowMessageModal] = useState(false); // State to control Message modal visibility

    const handleRegistration = async (e) => {
        e.preventDefault();
        try {
            const token = sessionStorage.getItem('access_token');
            const formData = new FormData(e.target);

            const password = formData.get('password');
            const confirm_password = formData.get('confirm_password');

            if (password !== confirm_password) {
                setModalMessage('Passwords entered do not match.');
                setShowMessageModal(true);
                return;
            }

            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the JWT token in the Authorization header
                },
                credentials: 'include',  // Include cookies in the request
                body: formData,
            });
            const data = await response.json();

            if (data.access === 'Granted') {
                window.location.href = `/Otp?email=${data.email}`;
            } else {
                setModalMessage(data.access === 'Denied' ? data.message : data.error);
                setShowMessageModal(true);
            }

        } catch (error) {
            console.log(error);
            setModalMessage('Failed to login/register');
            setShowMessageModal(true);
        }
    };

    return (
        <div>
            <header>
                <div className="container2">
                    {/* Register Form */}
                    <form action="/register" className="form" id="createAccount" method="post" onSubmit={handleRegistration}>
                        <h1 className="form__title">Create Account</h1>
                        <div className="form__input-group">
                            <input type="text" name="name" id="signupUsername" className="form__input" autoFocus placeholder="Username" required />
                            <div className="form__input-error-message" />
                        </div>
                        <div className="form__input-group">
                            <input type="email" name="login_id" className="form__input" autoFocus placeholder="Email Address" required />
                            <div className="form__input-error-message" />
                        </div>
                        <div className="form__input-group">
                            <input type="password" name="password" className="form__input" autoFocus placeholder="Password" minlength="8" required />
                            <div className="form__input-error-message" />
                        </div>
                        <div className="form__input-group">
                            <input type="password" name="confirm_password" className="form__input" autoFocus placeholder="Confrim Password" minlength="8" required />
                            <div className="form__input-error-message" />
                        </div>
                        <button className="form__button" type="submit">Continue</button>
                        <p className="form__text">
                            <a className="form__link" href="/Login" id="linkLogin">Already have an account? Login</a>
                        </p>
                    </form>
                    <MessageModal
                        show={showMessageModal}
                        onClose={() => setShowMessageModal(false)}
                        message={modalMessage}
                    />
                </div>
            </header>
        </div>
    );
};

export default Account;