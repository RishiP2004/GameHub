import './GuestOption.css';
import { useHistory } from 'react-router-dom';

/**
 * Playing as guest on the website
 * Skips extra authentications with
 * setting user var to 0
 *
 * @returns {JSX.Element}
 * @constructor
 */
const GuestOption = () => {
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('user', 0);
        history.push('/');
    };
    return (
        <div className="guest-container">
            <button type="guest" className="btn" onSubmit={handleSubmit}>Play as Guest</button>
        </div>
    );
}

export default GuestOption;