import { Search, Bell, Sun, Moon, Menu } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import './Header.css';

const Header = ({ onMenuClick }) => {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className="header">
            <div className="header-left">
                <button className="menu-toggle" onClick={onMenuClick}>
                    <Menu size={20} />
                </button>
                <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search pets, customers, orders..."
                    />
                </div>
            </div>

            <div className="header-right">
                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <button className="notification-btn">
                    <Bell size={20} />
                    <span className="notification-badge" />
                </button>

                <div className="user-menu">
                    <div className="user-info">
                        <span className="user-name">{user?.name || 'User'}</span>
                        <span className="user-role">{user?.role || 'Staff'}</span>
                    </div>
                    <div className="avatar avatar-md">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} />
                        ) : (
                            getInitials(user?.name || 'User')
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
