import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Login.css";
import MessageModal from './MessageModal';
import "./ModalPopup.css";

const Login = () => {
    const navigate = useNavigate();  // Initialize useNavigate
    const [modalMessage, setModalMessage] = useState(''); // Modal Popup Messages.
    const [showMessageModal, setShowMessageModal] = useState(false); // State to control modal visibility

    const handleSubmit = async (e, endpoint) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);
            const response = await fetch(`/${endpoint}`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            

            if (data.access === 'Granted') {
                sessionStorage.setItem('access_token', data.access_token);
                // sessionStorage.setItem('logged_in', 'true'); //Using String fro Session Checking
                // Countdown for redirection
                let count = 3;
                const countdown = setInterval(() => {
                    setModalMessage(`Redirecting to Home in ${count} seconds...`);
                    setShowMessageModal(true)
                    count--;
                    if (count < 0) {
                        clearInterval(countdown);
                        window.location.href = '/';
                    }
                }, 1000);

            } else if (data.access === 'Denied') {
                setModalMessage(data.message);
                setShowMessageModal(true);

            } else {
                setModalMessage(data.error);
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
                    <form onSubmit={(e) => handleSubmit(e, 'login')} className="form" id="login" method="post">
                        <h1 className="form__title">Login</h1>
                        <div className="form__input-group">
                            <input type="email" name="login_id" className="form__input" autoFocus placeholder="Username or email" required />
                            <div className="form__input-error-message" />
                        </div>
                        <div className="form__input-group">
                            <input type="password" name="password" className="form__input" autoFocus placeholder="Password" required />
                            <div className="form__input-error-message" />
                        </div>
                        <button className="form__button" type="submit">Continue</button>
                        <p className="form__text">
                            <a href="./Forgot" className="form__link">Forgot your password?</a>
                        </p>
                        <p className="form__text">
                            <a className="form__link" href="/Account" id="linkCreateAccount">Don't have an account? Create account</a>
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

export default Login;