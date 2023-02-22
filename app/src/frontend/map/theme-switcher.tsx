import React from 'react';

import './map-button.css';

interface ThemeSwitcherProps {
    currentTheme: string;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = (props) => (
    <form className={`theme-switcher map-button ${props.currentTheme}`} onSubmit={props.onSubmit}>
        <button className="btn btn-outline btn-outline-dark"
            type="submit">
            Kartenansicht umschalten ({(props.currentTheme === 'light')? 'hell' : 'dunkel'})
        </button>
    </form>
);

export default ThemeSwitcher;
