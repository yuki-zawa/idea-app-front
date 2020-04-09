import React, { useState, useEffect, useRef } from "react";
import { HomeLayout } from "../../common/HomeLayout";
import axios from 'axios';
import InfiniteScroll from "react-infinite-scroller";
import CircularProgress from "@material-ui/core/CircularProgress";
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import { Card } from './Card'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    inputRoot: {
      color: 'inherit',
      backgroundColor: "#E3EAF5",
      borderRadius: "5px",
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(0.25rem + ${theme.spacing(3)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }),
);

export const IdeaList: React.FC = (props: any) => {
  const classes = useStyles();

  const [ideas, setIdeas] = useState([]);
  const [showLoader, setShowLoader] = React.useState(false);
  const [pagenation, setPagenation] = React.useState({
    total: 0,
    perPage: 10,
    currentPage: 1
  });

  const fetchIdeas = async () => {
    setShowLoader(true);

    let response = await axios
      .get(`/api/v1/ideas?page=${pagenation.currentPage}&limit=${pagenation.perPage}`)
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
        `/api/v1/ideas?page=${pagenation.currentPage + 1}&limit=${pagenation.perPage}`
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

  useEffect(() => {
    fetchIdeas();
  }, []);

  return (
    <HomeLayout title="idea list">
      <div className="list-header">
        <div className="search">
          <div className="search-icon">
            <SearchIcon />
          </div>
          <InputBase
            placeholder="アイデアを検索する"
            inputProps={{ 'aria-label': 'search' }}
            classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
          />
        </div>
      </div>
      <div className="tag-search-header">
        <p>タグで絞り込む▼</p>
      </div>
      <div className="container">
        <InfiniteScroll
          pageStart={1}
          hasMore={!showLoader && ideas && pagenation.total > ideas.length}
          loadMore={fetchMoreIdeas}
          initialLoad={false}
        >
          {
            ideas && ideas.map((idea, index) => {
              return (
                <Card 
                  idea={idea} 
                  key={index}
                />
              )
            })
          }
        </InfiniteScroll>
        <div style={{ textAlign: "center", paddingBottom: "10px" }}>
          {showLoader ? <CircularProgress style={{ margin: "24px auto" }}/> : ""}
        </div>
        <div className="btns">
          <Link to='/ideas/new'>
            <button className="plus">
              ＋
            </button>
          </Link>
          <button className="shuffle">
            ⇆
          </button>
        </div>
      </div>
      <style jsx>{`
        .container {
          padding: 1.25rem 1rem;
          overflow: auto;
          clear: both;
          margin-top: 72px;
        }

        .list-header {
          height: 40px;
          background-color: white;
          position: absolute;
          width: 100%;
          top: 40px;
          z-index: 100;
        }

        .search {
          position: relative;
          display: inline-block;
          padding: 0 0.5rem;
        }

        .search-icon {
          position: absolute;
          z-index: 111;
          height: 32px;
          position-events: none;
          display: flex;
          align-items: center;
          justify-content: center; 
        }

        .tag-search-header {
          text-align: center;
          height: 32px;
          position: absolute;
            width: 100%;
            top: 80px;
            z-index: 100;
          background-color: black;
          color: white;
          border-radius: 0px 0px 10px 10px;
        }

        .tag-search-header p {
          line-height: 32px;
          font-weight: bold;
        }

        .btns {
          position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%)
        }

        .btns button {
          height: 64px;
          width: 64px;
          font-size: 48px;
          line-height: 64px;
          border-radius: 50%;
          box-shadow: 0px 0px 10px gray;
          margin: 0.5rem 0.75rem;
        }

        .plus {
          background-color: #FEB342;
        }

        .shuffle {
          background-color: #E3EAF5;
        }
      `}</style>
    </HomeLayout>
  );
}