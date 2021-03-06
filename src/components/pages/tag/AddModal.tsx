import React, { useState, useRef, useEffect } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from 'axios';
import { X, Check } from 'react-feather';

type AddTagModalProps = {
  tagState: string,
  closeFunc: any,
  selectedGenreTag: any,
  setSelectedGenreTag: any,
  selectedIdeaTags: Array<any>,
  setSelectedIdeaTags: any,
};

export interface AddGenreTagParam {
  color: string,
  name: string,
  user_id: number,
}

export interface AddIdeaTagParam {
  name: string,
  user_id: number,
}

const colors = ["#FFDADB", "#FCE9FF", "#FFF6CB", "#FFE5C7", "#CEF9DF", "#D0E0FF", "#E9DFFF", "#F1FFC8", "#E0FAFF", "#EFEFEF"];

export const AddTagModal: React.FC<AddTagModalProps> = (props: any) => {
  const nameRef = useRef(document.createElement("input"));

  const [showLoader, setShowLoader] = useState(true);
  const [tags, setTags] = useState([]);
  const [tagState, setTagState] = useState(props.tagState); // "genre" or "idea"

  const [addGenreTag, setAddGenreTag] = useState<AddGenreTagParam>({
    color: "",
    name: "",
    user_id: 0
  });

  const [addIdeaTag, setAddIdeaTag] = useState<AddIdeaTagParam>({
    name: "",
    user_id: 0
  });

  const [selectedGenreTag, setSelectedGenreTag] = useState(props.selectedGenreTag);
  const [selectedIdeaTags, setSelectedIdeaTags] = useState(props.selectedIdeaTags);

  const handleChange = () => {
    if (tagState === "genre"){
      setAddGenreTag({
        ...addGenreTag,
        name: nameRef.current.value,
        color: colors[Math.floor(Math.random()*10)]
      })
    } else {
      setAddIdeaTag({
        ...addIdeaTag,
        name: nameRef.current.value
      })
    }
  }

  const postTag = async () => {
    if (nameRef.current.value === ''){
      //FIXME エラー表示させる
      window.alert("空白のタグは追加できません。")
    }
    var url;
    if (tagState === "genre"){
      setAddGenreTag({
        ...addGenreTag,
        name: nameRef.current.value
      })
      url ="/api/v1/genre_tags";
      await axios
        .post(url, addGenreTag)
        .then(res => {
          nameRef.current.value = '';
          if (selectedGenreTag.id !== 0) {
            setTags(tags.concat(selectedGenreTag))
          }
          setSelectedGenreTag(res.data)
        })
        .catch(err => console.log(err));
    } else {
      setAddIdeaTag({
        ...addIdeaTag,
        name: nameRef.current.value
      })
      url ="/api/v1/idea_tags";
      await axios
        .post(url, addIdeaTag)
        .then(res => {
          nameRef.current.value = '';
          setSelectedIdeaTags(selectedIdeaTags.concat(res.data));
        })
        .catch(err => console.log(err))
    }
  }

  const changeTag = (event: any) => {
    setTagState(event.target.id);
  }

  const selectTag = (event: any) => {
    if (tagState === "genre"){
      setSelectedGenreTag(tags[event.target.dataset.id]);
      tags.splice(event.target.dataset.id, 1);
      setTags(tags.concat(selectedGenreTag).sort((a: any, b: any) => { return a.id > b.id ? 1 : -1 }));
      // setTags(temp.sort((a: any, b: any) => { return a.id > b.id ? 1 : -1 }));
    } else {
      setSelectedIdeaTags(selectedIdeaTags.concat(tags[event.target.dataset.id]));
      tags.splice(event.target.dataset.id, 1)
      setTags(tags);
    }
  }

  const completeModal = () => {
    props.setSelectedIdeaTags(selectedIdeaTags);
    props.setSelectedGenreTag(selectedGenreTag);
    props.closeFunc();
  }

  const fetchTags = async () => {
    var url;
    setShowLoader(true);
    if (tagState === "genre"){
      url ="/api/v1/genre_tags?page=1&limit=100"
    } else {
      url ="/api/v1/idea_tags?page=1&limit=100"
    }
    await axios
      .get(url)
      .then(res => {
        if (tagState === "genre"){
          setTags(res.data.data.filter((value: any) => { return value.id !== selectedGenreTag.id }));
        } else {
          var tempArray = res.data.data
          selectedIdeaTags.map((value: any) => {
            tempArray = tempArray.filter((data: any) => { return value.id !== data.id })
          })
          setTags(tempArray);
        }
        setShowLoader(false);
      })
      .catch(err => console.log(err));
  }

  const selectDelete = (type: string, event: any) => {
    if (type === "idea") {
      setSelectedIdeaTags(selectedIdeaTags.filter((tag: any) => {
        if(tag.id === Number(event.target.dataset.id)){
          setTags(tags.concat(tag).sort((a: any, b: any) => { return a.id > b.id ? 1 : -1 }));
        }
        return tag.id !== Number(event.target.dataset.id)
      }))
    } else {
      setTags(tags.concat(selectedGenreTag).sort((a: any, b: any) => { return a.id > b.id ? 1 : -1 }));
      setSelectedGenreTag({
        id: 0,
        name: "",
        color: "",
      })
    }
  }

  useEffect(() => {
    fetchTags();
  },[tagState]);


  return (
    <div className="container">
        <div className="top-part"> 
          <span onClick={props.closeFunc} className="cross-btn">
            <X size={20} />
          </span>
          <p className="header-title">タグの編集</p>
          <span onClick={completeModal} className="check-btn">
            <Check size={24} color="#579AFF" />
          </span>
        </div>
      
      <div className="change-tag">
        <span id="genre" onClick={changeTag} style={{color: tagState === "genre" ? "" : "lightgray"}}>カテゴリー</span>｜<span id="idea" onClick={changeTag} style={{color: tagState === "idea" ? "" : "lightgray"}}>タグ</span>
      </div>

      <p className="label">選択中のカテゴリー</p>
      <div className="selected-tag-container">
        {
          tagState === "genre" ?
            selectedGenreTag.id !== 0 ? 
            <p className="tag" style={{backgroundColor: selectedGenreTag.color}}>
              <X size={14} className="tag-icon" onClick={(event) => selectDelete("genre", event)}/>
              <span>{selectedGenreTag.name}</span>
            </p> : ""
          :
          selectedIdeaTags.map((tag: any, index: number) => {
            return(
              <p className="tag" key={index} style={{backgroundColor: "rgb(232, 240, 254)"}}>
                <X size={14} onClick={(event) => selectDelete("idea", event)} data-id={tag.id}/>
                <span>{tag.name}</span>
              </p>
            )
          })
        }
      </div>
      <p className="label">カテゴリーを選択する</p>
      <div className="btn-container">
        <input ref={nameRef} onChange={handleChange} className="input-name" placeholder="新しいカテゴリーを作成"/>
        <button onClick={postTag} className="add-btn">
          追加する
        </button>
      </div>
      
      <div className="tag-container">
        {
          !showLoader && tags.map((tag: any, index: number) => {
            return(
              <p className="tag" key={index} data-id={index} onClick={selectTag} style={{backgroundColor: tagState === "genre"? tag.color :"rgb(232, 240, 254)"}}>{tag.name}</p>
            )
          })
        }
      </div>
      <div style={{ textAlign: "center", paddingBottom: "10px" }}>
        {showLoader ? <CircularProgress style={{ margin: "24px auto" }}/> : ""}
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
          font-size: 14px;
          color: #333;
        }
        .container {
          height: calc(100% - 40px);
          position: absolute;
          top: 40px;
          left: 0;
          width: 100%;
          padding: 1.25rem 1rem;
          box-sizing: border-box;
          background-color: white;
          z-index: 100;
        }
        .change-tag{
          text-align: center;
          margin-bottom: 36px;
        }

        .input-name {
          font-size: 16px;
          line-height: 18px;
          box-sizing: border-box;
          padding: 6px 8px;
          background: #FFFFFF;
          border-radius: 4px;
          width: calc(100% - 80px);
          color: #333;
          border: 1px solid #C4C4C4;
        }
        .input-name::placeholder {
          color: #c4c4c4;
        }

        .btn-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1000px;
          margin: 0 auto 24px auto;
        }

        .add-btn {
          padding: 7px 9px;
          font-size: 14px;
          line-height: 18px;
          right: 20.5px;
          background-color: #EBEBEB;
          box-sizing: border-box;
          border-radius: 4px;
          text-align: center;
          color: #333;
          
        }

        .label {
          font-size: 14px;
          color: #333;
          max-width: 1000px;
          margin: 0 auto 12px auto;
        }

        .selected-tag-container {
          height: 32px;
          width: auto;
          white-space:nowrap;
          overflow-x: scroll;
          -ms-overflow-style: none;
          max-width: 1000px;
          margin: 0 auto;
          flex-wrap: wrap;
          height: fit-content;
          min-height: 26px;
        }

        .selected-tag-container::-webkit-scrollbar {
          display:none;
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

          display: flex;
          width: fit-content;
          align-items: center;
          margin: 0 12px 8px 0;
        }
        .selected-tag-container {
          padding-top: 4px;
          margin-bottom: 44px;
          display: flex;
        }

        .tag-container{
          display: flex;
          flex-wrap: wrap;
          max-width: 1000px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
}
