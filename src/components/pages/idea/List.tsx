import React, { useState, useEffect } from "react";
import { HomeLayout } from "../../common/HomeLayout";
import axios from 'axios';
import InfiniteScroll from "react-infinite-scroller";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputBase from '@material-ui/core/InputBase';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { Search, List, Shuffle, Plus, Settings, Grid } from 'react-feather';
import Sort from '../../images/sort.svg'
import { Card } from './Card';
import { Card2 } from './Card2';
import { ShuffleModal } from "./ShuffleModal";
import { TagSearch } from "./TagSearch";
import { SortModal } from "./SortModal";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    inputRoot: {
      width: '100%'
    },
    inputInput: {
      padding: theme.spacing(0),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        '&:focus': {
        },
      },
    },
  }),
);

export const IdeaList: React.FC = (props: any) => {
  const classes = useStyles();

  const [ideas, setIdeas] = useState([]);
  const [openShuffleModal, setOpenShuffleModal] = useState(false);
  const [openSortModal, setOpenSortModal] = useState(false);
  const [showLoader, setShowLoader] = React.useState(false);
  const [listState, setListState] = useState(false);
  const [pagenation, setPagenation] = React.useState({
    total: 0,
    perPage: 12,
    currentPage: 1
  });

  const [tagSearchQuery, setTagSearchQuery] = useState('&sort=new');

  const fetchIdeas = async () => {
    setShowLoader(true);

    let response = await axios
      .get(`/api/v1/ideas?page=${1}&limit=${12}${tagSearchQuery}`)
      .then(result => result.data)
      .catch(error => console.log(error))
      .finally(() => {
        setShowLoader(false);
      });

    setIdeas(response.data);
    setPagenation({
      total: response.meta.total,
      perPage: response.meta.perPage,
      currentPage: response.meta.currentPage
    });
  }

  const fetchMoreIdeas = async () => {
    setShowLoader(true);
    let response = await axios
      .get(
        `/api/v1/ideas?page=${pagenation.currentPage + 1}&limit=${pagenation.perPage}${tagSearchQuery}`
      )
      .then(result => result.data)
      .catch(error => console.log(error))
      .finally(() => {
        setShowLoader(false);
      });
    // 配列の後ろに追加
    setIdeas(ideas.concat(response.data));
    setPagenation({
      total: response.meta.total,
      perPage: response.meta.perPage,
      currentPage: response.meta.currentPage
    });
  }

  const handleChangeListState = (bool: boolean) => {
    setListState(bool);
  }

  const shuffle = () => {
    if(pagenation.total < 2) {
      window.alert("ひらめきを二つ以上登録してください");
      return;
    }
    setOpenShuffleModal(true);
  }

  const closeShuffleModal = () => {
    setOpenShuffleModal(false);
  }

  const handleChange = (event: any) => {
    var queryString = tagSearchQuery.replace(/&word=.*(?=&)|&word=.*(?!&)/g, '');
    setTagSearchQuery(queryString + `&word=${event.target.value}`);
  }

  const handleChangeSortOpen = (bool: boolean) => {
    setOpenSortModal(bool);
  }

  useEffect(() => {
    fetchIdeas();
  }, [tagSearchQuery]);


  return (
    <HomeLayout title="STOCKROOM" position="fixed">
      <div className="list-header">
        <div className="list-header-inner">
          <div className="search">
            <InputBase
              placeholder="ひらめきを検索"
              inputProps={{ 'aria-label': 'search' }}
              classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                      }}
              onChange={handleChange}
            />
            <div className="search-icon">
              <Search size={16} color="#7A7A7A" />
            </div>
          </div>
          <div className="header-btn">
            <div className="sort">
              <img className="sort-icon" src={ Sort } alt="sort-icon" onClick={() => handleChangeSortOpen(true)}/>
            </div>
            <div className="switch">
              {
                listState ?
                  <Grid className="grid-icon" size="18" onClick={() => handleChangeListState(false)}/>
                  :
                  <List className="switch-icon" size="18" onClick={() => handleChangeListState(true)}/>
              }
            </div>
          </div>
        </div>
      </div>
      {openSortModal ?
        <SortModal
          handleChangeSortOpen={handleChangeSortOpen}
          setQuery={setTagSearchQuery}
          currentQuery={tagSearchQuery}
        />
        : ""}
      <TagSearch 
        setQuery={setTagSearchQuery}
        currentQuery={tagSearchQuery}
      />
      <div className="bg-gray"></div>
      <div className={`container`}>
        <InfiniteScroll
          pageStart={1}
          hasMore={!showLoader && ideas && pagenation.total > ideas.length}
          loadMore={fetchMoreIdeas}
          initialLoad={false}
          useWindow={false}
          // style={{display: "flex",flexWrap: "wrap",margin: "0 auto"}}
          style={{width: "100%"}}
        >
          {
            !(!showLoader && ideas.length === 0) ? ideas && ideas.map((idea, index) => {
              return (
                listState ? 
                  <Card2
                    idea={idea} 
                    key={index}
                  /> :
                  <Card
                    idea={idea} 
                    key={index}
                    width={"48%"}
                    height={"200px"}
                    contentLine={4}
                  />
              )
            }) : 
            <div className="no-idea">
              <p className="no-idea_text">まだひらめきがありません。</p>
              <p className="no-idea_text">ひらめきを追加しましょう！</p>
            </div>
          }
        </InfiniteScroll>
        <div style={{ textAlign: "center", paddingBottom: "10px" }}>
          {showLoader ? <CircularProgress style={{ margin: "24px auto" }}/> : ""}
        </div>
      </div>
        <div className="footer-menu">
            {/* <Link to='/home'>
                <div className="home-btn footer-btn">
                    <Home color="white" size="28"/>
                </div>
            </Link> */}
            <button className="shuffle-btn footer-btn" onClick={shuffle}>
                <Shuffle color="white" size="28"/>
            </button>
            <Link to='/ideas/new'>
                <button className="add-btn" >
                    <Plus size="36"/>
                </button>
            </Link>
            {/* <Link to='/ideas/new'>
                <div className="search-btn footer-btn">
                    <Search color="white" size="28"/>
                </div>
            </Link> */}
            
        </div>
        
        
      <div className="blur" />
      { openShuffleModal ? 
          <ShuffleModal 
            closeShuffleModal={closeShuffleModal}
          />
        : "" 
      }
      <style jsx>{`
        main{
          position: fixed;
        }
        main::-webkit-scrollbar {
          display:none;
        }
        .bg-gray{
          width: 100%;
          height: 100vh;
          top: 0;
          left: 0;
          position: fixed;
          background-color: #F5F5F5;
        }
        .container {
          height: calc(100vh - 32px);
          width: 100%;
          padding: 48px 12px 180px 12px;
          box-sizing: border-box;
          overflow-y: scroll;
          background-color: #F5F5F5;
          max-width: 1000px;
          top: 108px;
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          -webkit- transform: translateX(-50%);
        }
        @media (max-width: 1000px){
          .container {
            max-width: 640px;
          }
        }
        .blur{
          display: ${openShuffleModal ? ";" : "none;"};
          z-index: 900;
          height: 100vh;
          width: 100%;
          position: absolute;
          top: 0px;
          background: rgba(0, 0, 0, 0.6);
          mix-blend-mode: normal;
          backdrop-filter: blur(8px);
        }

        .list-header {
          width: 100%;
          top: 52px;
          height: 56px;
          z-index: 100;
          padding: 10px 16px 0 16px;
          box-sizing: border-box;
          background-color: white;
          position: fixed;
          border-bottom: 1px solid rgba(196, 196, 196, 0.5);
        }
        .list-header-inner{
          max-width: 1000px;
          margin: auto;
          display: flex;
          justify-content: space-between;
        }

        .search {
          background-color: #EBEBEB;
          border-radius: 2px;
          margin-right: 12px;
          width: calc(100% - 80px);
          max-width: 400px;
          display: flex;
          padding: 8px;
          box-sizing: border-box;
          justify-content: space-between;
          align-items: center;
        }
        .header-btn{
          display: flex;
        }
        .sort{
          width: 32px;
          height: 32px;
          border-radius: 4px;
          border: 1px solid #c4c4c4;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 8px;
          cursor: pointer;
        }

        .switch{
          width: 32px;
          height: 32px;
          border-radius: 4px;
          border: 1px solid #c4c4c4;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .footer-menu {
          width: 132px;
          height: 62px;
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          -webkit- transform: translateX(-50%);
          bottom: 24px;
          display: flex;
          justify-content: space-between;
        }

        .add-btn{
          height: 62px;
          width: 62px;
          border-radius: 50%;
          background-color: #FEB342;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #333;
        }

        .add-btn:hover{
          color: white;
          background: #EC920C;
        }

        .shuffle-btn{
          height: 62px;
          width: 62px;
          border-radius: 50%;
          background-color: #579AFF;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .shuffle-btn:hover{
          background: #2E72D8;
        }

        .no-idea {
          margin-top: 60px;
          text-align: center;
        }

        .no-idea_text {
          margin-bottom: 10px;
          font-size: 20px;
        }

        
      `}</style>
    </HomeLayout>
  );
}
