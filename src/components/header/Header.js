import React, { Component } from 'react'
import Style from './style.scss'

class Header extends Component {
    render() {
        return (
            <div className={Style.header}>
                <img alt="logo" src={require('../../assets/logo.jpg')} />
            </div>
        );
    }
}

export default Header;