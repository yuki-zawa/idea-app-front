import React, { useState, useEffect } from "react";
import { HomeLayout } from "../../common/HomeLayout";
import useReactRouter from "use-react-router";
import { useHistory } from 'react-router-dom';
import { Rating } from '@material-ui/lab';
import axios from 'axios';
import CircularProgress from "@material-ui/core/CircularProgress";
import { AddTagModal } from './../tag/AddModal'
import { Icon } from './../../common/Const'
import AddBtn from './../../images/add-btn.svg'
import StarIcon from '@material-ui/icons/Star';
import { X,   Edit2, Trash2, Check, PlusCircle } from 'react-feather';
import { Emoji } from 'emoji-mart';
import { IconsModal } from './../../common/IconsModal';
import { Card } from './Card'
import { ReactComponent as DefaultIcon } from './../../images/defaulticon.svg';
import { InitIdea } from "../../../types/Idea";

export interface EditParam {
  idea: any,
  genre_tag: any,
  idea_tags: any
}

const priorityLables = ["ひらめき度を設定しよう", "いいことを思いついた！", "なかなかいいひらめきだ！", "これはすごいひらめきだ！", "君は天才だ！", "世紀の大発見だ！"];

export const IdeaDetail: React.FC = () => {
  const history = useHistory();
  const { match }: any = useReactRouter();
  const [idea, setIdea] = useState(new InitIdea());
  const [editData, setEditData] = useState<EditParam>({
    idea: {
      icon: "",
      title: "",
      detail: "",
      priority: 0,
    },
    genre_tag: {
      id: 0
    },
    idea_tags: []
  })
//この下はやばい、直さないとやばい
  const [idea1, setIdea1] = useState(new InitIdea());
  const [idea2, setIdea2] = useState(new InitIdea());

  const [showLoader, setShowLoader] = React.useState(false);
  const [editState, setEditState] = React.useState(false);
  const [ideaIcon, setIdeaIcon] = useState("");
  const [openIconsModal, setOpenIconsModal] = useState(false);

  const [openAddTagModal, setOpenAddTagModal] = useState(false);
  const [tagState, setTagState] = useState(""); // "genre" or "idea"

  const [selectedGenreTag, setSelectedGenreTag] = useState({
    id: 0,
    name: "",
    color: "",
  });
  const [selectedIdeaTags, setSelectedIdeaTags] = useState([]);

  const fetchIdea = async () => {
    setShowLoader(true);

    let response = await axios
      .get(`/api/v1/ideas/${match.params.id}`)
      .then(result => result.data)
      .catch(error => console.log(error))
      .finally(() => {
        setShowLoader(false);
      });
    setIdea(response);

    setEditData({
      idea: {
        icon: response.icon,
        title: response.title,
        detail: response.detail,
        priority: response.priority,
      },
      genre_tag: {
        id: response.genreTags[0] ? response.genreTags[0].id : 0,
        name: response.genreTags[0] ? response.genreTags[0].name : '',
        color: response.genreTags[0] ? response.genreTags[0].color : '',
      },
      idea_tags: response.ideaTags
    })
    setSelectedGenreTag(response.genreTags[0] ? response.genreTags[0] : {
      id: 0,
      name: "",
      color: "",
    });
    setSelectedIdeaTags(response.ideaTags)
  }

  const putIdea = async () => {
    setShowLoader(true);
    let response = await axios
      .put(`/api/v1/ideas/${match.params.id}`, editData)
      .then((result: any) => result.data)
      .catch(error => console.log(error))
      .finally(() => {
        setShowLoader(false);
      });
    setIdea(response);
    setEditData({
      idea: {
        icon: response.icon,
        title: response.title,
        detail: response.detail,
        priority: response.priority,
      },
      genre_tag: {
        id: response.genreTags[0] ? response.genreTags[0].id : 0,
        name: response.genreTags[0] ? response.genreTags[0].name : '',
        color: response.genreTags[0] ? response.genreTags[0].color : '',
      },
      idea_tags: response.ideaTags
    })
  }

  const deleteIdea = async () => {
    if (window.confirm("このひらめきを削除しますか?")) { 
      await axios
        .delete(`/api/v1/ideas/${match.params.id}`)
        .then(res => {
          window.location.pathname = "/home";
        })
        .catch(err => console.log(err));
    }
  }

  const editMode = () => {
    setEditState(true);
  };

  const completeEdit = () => {
    setEditState(false);
    putIdea();
  }

  const openModal = (type: string) => {
    setTagState(type);
    setOpenAddTagModal(true);
  }

  const closeModal = () => {
    setOpenAddTagModal(false);
  }

  const selectDelete = (type: string, event: any) => {
    if (type === "idea") {
      setSelectedIdeaTags(selectedIdeaTags.filter((tag: any) => tag.id !== Number(event.target.dataset.id)))
    } else {
      setSelectedGenreTag({
        id: 0,
        name: "",
        color: "",
      })
    }
  }

  const changeIconsModal = (flag: boolean) => {
    setOpenIconsModal(flag);
  }

  const getIdeas = async () => {
    await axios
      .get(`/api/v1/ideas/${idea.followers[0].id}`)
      .then(result => setIdea1(result.data))
      .catch(error => console.log(error))
    
    await axios
      .get(`/api/v1/ideas/${idea.followers[1].id}`)
      .then(result => setIdea2(result.data))
      .catch(error => console.log(error))
  }

  useEffect(() => {
    var temp :Array<any> = [];
    selectedIdeaTags.map((tag: any) => {
      temp.push({"id": tag.id})
    });
    setEditData({
      ...editData,
      genre_tag: {
        id: selectedGenreTag.id
      },
      idea_tags: temp
    })
  },[selectedIdeaTags, selectedGenreTag]);

  useEffect(() => {
    fetchIdea();
  }, []);

  useEffect(() => {
    if(idea.followers.length !== 0){
      getIdeas();
    }
  }, [idea]);

  useEffect(() => {
    setEditData({
      ...editData,
      idea: {
        ...editData.idea,
        icon: ideaIcon
      }
    })
  },[ideaIcon]);

  return (
    <HomeLayout title="STOCKROOM">
      {editState && openIconsModal ? <IconsModal setIcon={setIdeaIcon} closeModal={changeIconsModal}/> : ""}
      <div className="container" onClick={() => {
        if (openIconsModal) {
          setOpenIconsModal(false)
        }
      }}>
        <div className="top-part"> 
          <button onClick={() => history.goBack()} className="cancel-btn">
            <X size={24} color="#333"/>
          </button>
          <p className="title">ひらめき詳細</p>
          { !showLoader && !editState ?
            <div className="btn-container">
              <span className="delete" onClick={deleteIdea}>
                <Trash2 size={24} color="#333" />
              </span>
              <span className="edit" onClick={editMode}>
                <  Edit2 size={24} color="#333" />
              </span>
            </div> : "" }
            
          { !showLoader && editState ? <button className="complete" onClick={completeEdit}>
            <Check size={24} color="#579AFF" />
          </button> : "" }
        </div>
        {
          showLoader ?
            <div style={{ textAlign: "center", paddingBottom: "10px" }}>
              <CircularProgress style={{ margin: "24px auto" }}/>
            </div> :
            <div className="input-container">
              <div className="add-icon-container">
                { 
                    !editState ?
                    <p className="icon">{idea.icon ? <Emoji emoji={idea.icon} size={40}/> : <DefaultIcon />
                    }</p>
                    :<div>
                      <button className="icon-add_btn" onClick={() => changeIconsModal(true)}>
                        {editData.idea.icon ? <Emoji emoji={editData.idea.icon} size={40}/> : "アイコンを追加"}
                      </button>
                    </div>
                  }
              </div>
              {/* https://material-ui.com/components/rating/ */}
              <div className="rating-container">
                <Rating 
                    name="size-large"
                    size="large"
                    style={{height: "auto", lineHeight: "auto"}}
                    defaultValue={0}
                    className="star"
                    icon={<StarIcon />}
                    value={!editState ? idea.priority : editData.idea.priority}
                    readOnly={!editState}
                    onChange={(event, newValue) => {
                    setEditData({
                        ...editData,
                        idea: {
                        ...editData.idea,
                        priority: newValue
                        }
                    });
                    }}
                />
                <div className="priority">
                    {!editState ?
                    <p className="priority-label">{priorityLables[Math.round(idea.priority)]}</p>
                    :<p className="priority-label">{priorityLables[Math.round(editData.idea.priority)]}</p>
                    }
                </div>
              </div>
              <div className="title-name-container">
                {
                  !editState ? 
                    <h1 className="idea-title">{idea.title}</h1>:
                    <div className="title-name_inner-container">
                      <input 
                        onChange={(event) => {
                          setEditData({
                            ...editData,
                            idea: {
                              ...editData.idea,
                              title: event.target.value
                            }
                          });
                        }}
                        value={editData.idea.title}
                        placeholder="ひらめきを一言で表すと？"
                        type="text"
                        className="title-input"
                      />
                    </div>
                }
              </div>

              <p className="tag-label">カテゴリー</p>
              <div className="genre-tag-container">
                {
                  !editState ?
                  (idea.genreTags[0] ? <span className="genre-tag tag" style={{backgroundColor: idea.genreTags[0].color}}>{idea.genreTags[0].name}</span> : ''):
                  <div className="genre-tag-container">
                    <span className="plus" onClick={() => openModal("genre")}>
                      <PlusCircle size={20} color="#333" />
                      {/* <img className="plus-img" src={AddBtn} alt="" id="genre"/> */}
                    </span>
                    {selectedGenreTag.id !== 0 ? 
                    <span className="genre-tag tag" style={{backgroundColor: selectedGenreTag.color}}>
                      <X size={14} onClick={(event) => selectDelete("genre", event)}/>
                      <span className="tag-name">{selectedGenreTag.name}</span>
                    </span> : ""}
                  </div>
                }
              </div>
              <p className="tag-label">タグ</p>
              <div className="idea-tag-container">
                {
                  !editState ?
                  idea.ideaTags.map((tag: any, index: number) => {
                    return(
                      <span className="idea-tag tag" key={index}>{tag.name}</span>
                    )
                  })
                  :
                  <div className="idea-tag-container">
                    <span className="plus" id="idea" onClick={() => openModal("idea")}>
                      <PlusCircle size={20} color="#333" />
                      {/* <img className="plus-img" src={AddBtn} alt="" id="idea"/> */}
                    </span>
                    {
                      selectedIdeaTags && selectedIdeaTags.map((tag: any, index: number) => {
                        return(
                          <span className="idea-tag tag" key={index}>
                            <X size={14} onClick={(event) => selectDelete("idea", event)} data-id={tag.id}/>
                            <span className="tag-name">{tag.name}</span>
                          </span>
                        )
                      })
                    }
                  </div>
                }
              </div>
              <p className="memo-label">メモ</p>
              {
                !editState ?
                  <div className="memo-container">
                    <p className="text">{idea.detail}</p>
                  </div>
                :
                  <textarea
                    className="memo-container"
                    placeholder="メモをしよう！"
                    onChange={(event) => {
                      setEditData({
                        ...editData,
                        idea: {
                          ...editData.idea,
                          detail: event.target.value
                        }
                      });
                    }}
                    value={editData.idea.detail}
                  />
              }
            </div>
        }
        {idea.followers.length !== 0 ? 
          <div className="origin-idea">
            <p>シャッフルした元のアイデア</p>
            {[idea1, idea2].map((idea: any) => {
              return (
                <Card 
                  idea={idea}
                  width={"100%"}
                  backgroundColor={"#FCFCFC"}
                  contentLine={2}
                />
              )
            })}
          </div>
        : ""}
        { openAddTagModal ? 
            <AddTagModal 
              tagState={tagState}
              closeFunc={closeModal}
              selectedGenreTag={selectedGenreTag}
              setSelectedGenreTag={setSelectedGenreTag}
              selectedIdeaTags={selectedIdeaTags}
              setSelectedIdeaTags={setSelectedIdeaTags}
            /> : ""
        }
      </div>
      <style jsx>{`
        // header部分
        .top-part {
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1000px;
          margin: 0 auto;  
          padding: 18px 0;    
        }
        .title{
          padding: 0;
          border: none;
          border-radius: 0;
          outline: none;
          background: none;
          pointer-events: none;
          font-size: 14px;
          color: #333;
          text-align: center;
        }
        
        .container {
          background-color: white;
          padding: 1.25rem 1rem;
          padding-top: calc(1.25rem + 40px);
          z-index: 5;
        }
        @media (min-width: 1000px){
          .container {
            padding: 52px calc(50% - 500px) 0 calc(50% - 500px);
          }
        }
        // アイコン追加
        .icon {
          height: 40px;
          width: 40px;
          font-size: 40px;
          margin-bottom: 16px;
        }
        .icon-add_btn{
          padding: 4px 11px;
          background: #EBEBEB;
          border-radius: 22px;
        }
        .add-icon-container{
          margin-bottom: 12px;
        }
        .input-container {
          padding-bottom: 16px;
          border-bottom: 2px solid #F1F1F1;
          z-index: 1;
        }
        .styled-select {
          /* デフォルトのスタイルを解除 */
          -moz-appearance: none;
          -webkit-appearance: none;
          appearance: none;
          /* スタイル */
          width: 120px;
          height: 20px;
          font-size: 10px;
          #7A7A7A;
          display: inline-block;
          cursor: pointer;
          background: none;
          border: none;
        }
        /* IEでデフォルトの矢印を消す */
        .styled-select::-ms-expand {
          display: none;
        }

        .edit {
          display: inline-block;
          float: right;
          height: 24px;
          width: 24px;
          line-height: 24px;
          font-size: 24px;
          font-weight: bold;
          margin-left: 8px;
          cursor: pointer;
        }

        .delete {
          cursor: pointer;
        }
        // 星
        .rating-container{
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        .star{
          font-size: 24px;
        }
        .star label{
          font-size: 24px;
        }
        .priority {
          position: relative;
          display: inline-block;
          padding: 4px 8px;
          max-width: 100%;
          background: #FEB342;
          border-radius: 2px;
          margin-left: 16px;
        }
        .priority:before {
          content: "";
          position: absolute;
          top: 50%;
          left: -12px;
          margin-top: -5px;
          border: 5px solid transparent;
          /* border-radius: 2px; */
          border-right: 8px solid #FEB342;
        }
        .priority-label {
          font-size: 12px;
          margin: 0;
          padding: 0;
        }

        // タイトル
        .title-name-container{
          border-bottom: 2px solid #F1F1F1;
          padding-bottom: 16px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          width: 100%;
        }
        .title-name_inner-container{
          width: 100%;
        }
        .idea-title {
          margin-left: 4px;
          font-size: 18px;
          color: #333;
        }
        .title-input {
          width: 100%;
          box-sizing: border-box;
          font-size: 16px;
          padding: 6px 8px;
          border: none;
        }

        // タグ
        .tag-label, .memo-label{
          font-size: 14px;
          margin-bottom: 10px;
        }
        .plus {
          width: 36px;
          height: 36px;
          padding: 7px 8px 9px 8px;
          margin-right: 8px;
          box-sizing: border-box;
        }
        .plus-img{
          margin: 10px 0;
          width: 24px;
          height: auto;
        }
        .tag {
          display: inline-block;
          padding: 2px 4px;
          font-size: 14px;
          line-height: 14px;
          color: #333;
          border-radius: 2px;
          box-sizing: border-box;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .tag-name{
          margin-left: 4px;
        }
        .idea-tag-container, .genre-tag-container {
          min-height: 20px;
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        .idea-tag-container::-webkit-scrollbar {
          display:none;
        }
        .idea-tag {
          margin-right: 8px;
          background-color: rgb(232, 240, 254);
          diplay: block;
        }

        //メモ
        .memo-container {
          height: 160px;
          width: 100%;
          box-sizing: border-box;
          overflow-y: scroll;
          border: 1px #333 solid;
          border-radius: 2px;
          padding: 10px 8px;
          font-size: 16px;
          color: #434343;
          line-height: 1.6em;
        }

        .origin-idea {
          margin-top: 16px;
        }

        .origin-idea p {
          margin: 8px 0;
        }

      `}</style>
    </HomeLayout>
  );
}
