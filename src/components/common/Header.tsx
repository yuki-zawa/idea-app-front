import React from 'react';
import HeaderIcon from "./../images/header-logo.png"
import { Settings } from 'react-feather';
import { Link } from 'react-router-dom';

type HeaderProps = {
  title: string,
  location?: string,
  history?: any,
};

export const Header: React.FC<HeaderProps> = (props) => {
  return (
    <header>
      <div className="header-container">
        <img className="header-icon" src={HeaderIcon} alt="STOCKROOM" onClick={() => window.location.href="/home"}/>
        <Link to='/settings'>
          <Settings color="#7A7A7A" size={24} />
        </Link>
      </div>
      
      <style jsx>{`
        header {
          width: 100%;
          height: 52px;
          padding: 10px 15px;
          background-color: white;
          box-sizing: border-box;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 100;
        }
        .header-container{
          max-width: 1000px;
          margin: 0 auto;
          justify-content: space-between;
          display: flex;
          align-items: center;
        }
        .header-icon{
          height: 32px;
          width: auto;
          cursor: pointer;
        }
        
        ul {
          height: 40px;
        }

        .title {
          width: 100px;
          text-align: center;
          line-height: 44px;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom :0;
          margin: auto;
          font-size: 12px;
        }

      `}</style>
    </header>
  );
}