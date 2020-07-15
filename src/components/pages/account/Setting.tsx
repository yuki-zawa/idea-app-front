import React, { useContext } from 'react';
import axios from "axios";
import { X, Mail, Lock, HelpCircle, LogOut, AlertTriangle} from 'react-feather';
import { useHistory, Link } from 'react-router-dom';
import { HomeLayout } from "../../common/HomeLayout";
import { AuthContext } from "./../../common/context/provider";
import { ReactComponent as DefaultIcon } from './../../images/defaulticon.svg';

const backLinkStyle = {
  display: "inline-block",
  height: "24px",
  width: "24px",
  cursor: "pointer",
  fontWeight: "bold" as "bold",
  fontSize: "24px"
};

export const Setting: React.FC = () => {
  const history = useHistory();
  const { authState, setAuth } = useContext(AuthContext);

  const send = async () => {
    await axios
      //httpsからhttpは無効化されるからどうしよう
      .put('http://www.stockroom.work/api/v1/users/1')
      .catch(err => console.log(err));

    axios.defaults.headers.common['Authorization'] = '';
    //cookie削除
    document.cookie = "token=; max-age=0";
    localStorage.removeItem("token");
    window.location.pathname = '/'
    setAuth({
      isLogged: false,
      user: null
    });
    return;
  }

  const deleteAccount = async () => {
    if(window.confirm("アカウントを削除すると、STOCKROOMに関する全てのデータが削除されます。本当によろしいですか？")){
      await axios
        .delete(`/api/v1/users/${authState.user.id}`)
        .catch(err => console.log(err));
      axios.defaults.headers.common['Authorization'] = '';
      //cookie削除
      document.cookie = "token=; max-age=0";
      localStorage.removeItem("token");
      window.location.pathname = '/'
      setAuth({
        isLogged: false,
        user: null
      });
    }

    return;
  }

  return (
    <HomeLayout title="STOCKROOM">
      <div className="container">
        <div className="top-part">
          <button className="x-icon" onClick={() => history.goBack()} style={backLinkStyle}>
            <X size={20} color="#7A7A7A" />
          </button>
          <p className="title">設定とアカウント情報</p>
        </div>
        <div className="inner-container">
          <div className="block mail-container">
            <span className="icon">
              <Mail size={20} color="#7A7A7A" />
            </span>
            <div className="mail-contents">
              <button className="change-btn">メールアドレスを変更</button>
              <p className="mail-address">{authState.user.email}</p>
            </div>
          </div>
          <div className="block pass-container">
          <span className="icon">
            <Lock size={20} color="#7A7A7A" />
          </span>
          <div className="pass-contents">
            <button className="change-btn">パスワードを変更</button>
          </div>
          </div>
          <div className="line"></div>
          <div className="block logout-container">
            <span className="icon">
              <LogOut size={20} color="#7A7A7A" />
            </span>
            <button className="link-text" onClick={send}>ログアウト</button>
          </div>
          <div className="block delete-container">
            <span className="icon">
              <AlertTriangle className="icon" size={20} color="#7A7A7A" />
            </span>
            <button className="link-text" onClick={deleteAccount}>アカウントを削除</button>
          </div>
          <div className="line"></div>
          <div className="block about-container">
            <span className="icon">
              <DefaultIcon />
            </span>
            <span className="link-text">
              <Link to="/introduction">STOCKROOMについて</Link>
            </span>
          </div>
          <div className="block help-container">
            <span className="icon">
              <HelpCircle size={20} color="#7A7A7A" />
            </span>
            <span className="link-text">
              <Link to="/help">ヘルプ</Link>
            </span>
          </div>
          
        </div>
        <style jsx>{`
          .top-part {
            margin-bottom: 20px;
            max-width: 1000px;
            margin: 0 auto;
            padding: 18px 0;
          }
          .x-icon{
            position: absolute;
          }
          .title{
            font-size: 14px;
            color: #333;
            text-align: center;
            line-height: 28px;
          }

          .container {
            background-color: white;
            padding: 60px 12px 72px 12px;
            z-index: 5;
          }
          .inner-container {
            width: 100%;
            max-width: 400px;
            padding: 20px;
            box-sizing: border-box;
          }

          .line{
            border: 1px solid #F1F1F1;
            width: 100%;
            height: 0px;
            margin-bottom: 24px;
          }
          .block{
            display: flex;
            margin-bottom: 24px;
            font-size: 16px;
            color: #333;
          }

          .icon{
            width: 20px;
            height: auto;
            display: inline-block;
            color: #7A7A7A;
            margin-right: 20px;
          }
          
          .change-btn, .link-text{
            color: #333;
            font-size: 16px;
            line-height: 22px;
            font-weight: bold;
          }
          .link-text a{
            color: #333;
            font-size: 16px;
            line-height: 22px;
            font-weight: bold;
          }
          .mail-address{
            font-size: 14px;
            line-height: 24px;
            margin-left: 4px;
            color: #7A7A7A;
          }
        `}</style>
      </div>
    </HomeLayout>
  );
}