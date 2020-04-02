import React, { Component } from "react";
import News from "./News";
import "./App.css";
import "./mediaqueries.css";

const newsApiUrl = "https://newsapi.org/v2/top-headlines?country=us";
const nytApiUrl =
  "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=trump&sort=newest&api-key=pQ4BKb1jHvw1WlQ1UaxGHFDfftLosi8D";
const nytImageBasePath = "https://www.nytimes.com/";

const maxDisplayCount = 10;

let newsCount = 0;

class App extends Component {
  constructor() {
    super();
    this.state = {
      apiIndex: 0,
      renderList: [],
      currentNewsIndex: 0,
      newsListParsed: [],
      nytListParsed: []
    };
  }

  fetchFromNewsApi = e => {
    e.preventDefault();
    e.target.style.background = "#4e7ca0";
    document.querySelector("#queryNytApi").style.background = "";
    this.getNewsListFromNewsApi();
  };

  fetchFromNytApi = e => {
    e.preventDefault();
    e.target.style.background = "#4e7ca0";
    document.querySelector("#queryNewsApi").style.background = "";
    this.getNewsListFromNytApi();
  };

  componentDidMount() {
    document.querySelector("#queryNewsApi").style.background = "#4e7ca0";
    this.getNewsListFromNewsApi();
  }

  getNewsListFromNewsApi = () => {
    fetch(`${newsApiUrl}`, {
      headers: {
        "X-Api-Key": "94c943336a554a92a9fd546cdef192fa"
      }
    })
      .then(res => res.json())
      .then(res => {
        let newsList = [];
        let newsListParsed = [];
        let renderList = [];
        if (res.articles.length > 0) {
          for (let i = 0; i < res.articles.length; i++) {
            // just get the news which includes image
            let urlToImage = res.articles[i].urlToImage;
            if (urlToImage !== null && urlToImage !== "") {
              newsList.push(res.articles[i]);
            }
          }
          newsCount =
            newsList.length > maxDisplayCount
              ? maxDisplayCount
              : newsList.length;
          // parse the original news list
          newsListParsed = this.parseNewsListFromNewsApi(newsList);
          renderList = [...newsListParsed];
        }
        this.setState({
          apiIndex: 0,
          currentNewsIndex: 0,
          renderList: renderList,
          newsListParsed: newsListParsed
        });
      })
      .catch(err => {
        console.log("Something went wrong", err);
      });
  };

  parseNewsListFromNewsApi = list => {
    let newsListParsed = [];
    for (let i = 0; i < newsCount; i++) {
      let originNews = list[i];

      // parse the title
      let title = originNews.title === null ? "" : originNews.title;

      // parse the author
      let author = originNews.author === null ? "" : originNews.author;

      // parse the published date
      let publishedDate =
        originNews.publishedAt === null ? "" : originNews.publishedAt;
      if (publishedDate.length >= 10) {
        // just get the date, no time
        publishedDate = publishedDate.slice(0, 10);
      }

      // parse the image's url
      let image = originNews.urlToImage === null ? "" : originNews.urlToImage;

      // parse the content
      let content = originNews.content === null ? "" : originNews.content;
      if (content !== "") {
        // replace the "\r\n" to '<br/><br/>'
        content = content.replace(/\r\n/g, "<br/><br/>");
        // replace the last "[  ]" to ""
        let idxBegin = content.lastIndexOf("[");
        if (idxBegin !== -1) {
          let idxEnd = content.indexOf("]", idxBegin + 1);
          if (idxEnd !== -1) {
            let firstPart = content.substr(0, idxBegin);
            if (idxEnd < content.length - 1) {
              let lastPart = content.substr(idxEnd + 1);
              content = firstPart + lastPart;
            } else {
              content = firstPart;
            }
          }
        }
      } else {
        // if there is no content, then using description
        let description =
          originNews.description === null ? "" : originNews.description;
        content = description;
      }

      // parse the source
      let source = "";
      if (originNews.source !== null) {
        source = originNews.source.name === null ? "" : originNews.source.name;
      }

      // parse the source url
      let url = originNews.url === null ? "" : originNews.url;
      let news = {
        title,
        author,
        publishedDate,
        image,
        content,
        source,
        url
      };
      newsListParsed.push(news);
    }
    return newsListParsed;
  };

  getNewsListFromNytApi = () => {
    fetch(nytApiUrl)
      .then(res => res.json())
      .then(res => {
        let newsList = [];
        let renderList = [];
        let nytListParsed = [];
        if (res.response.docs.length > 0) {
          for (let i = 0; i < res.response.docs.length; i++) {
            // just get the news which includes image
            if (res.response.docs[i].multimedia.length > 0) {
              newsList.push(res.response.docs[i]);
            }
          }
          newsCount =
            newsList.length > maxDisplayCount
              ? maxDisplayCount
              : newsList.length;
          // parse the original news list
          nytListParsed = this.parseNewsListFromNytApi(newsList);
          renderList = [...nytListParsed];
        }
        this.setState({
          apiIndex: 1,
          currentNewsIndex: 0,
          renderList: renderList,
          nytListParsed: nytListParsed
        });
      })
      .catch(err => {
        console.log("Something went wrong", err);
      });
  };

  parseNewsListFromNytApi = list => {
    let nytListParsed = [];
    for (let i = 0; i < newsCount; i++) {
      let originNews = list[i];

      // parse the title
      let headline = originNews.headline;
      let title = "";
      if (headline !== null) {
        title = headline.main === null ? "" : headline.main;
        if (title === "") {
          title =
            headline.print_headline === null ? "" : headline.print_headline;
        }
      }

      // parse the author
      let byline = originNews.byline;
      let author = "";
      if (byline !== null) {
        author = byline.original === null ? "" : byline.original;
      }

      // parse the published date
      let publishedDate =
        originNews.pub_date === null ? "" : originNews.pub_date;
      if (publishedDate.length >= 10) {
        // just get the date, no time
        publishedDate = publishedDate.slice(0, 10);
      }

      // parse the image's url
      let multimedia = originNews.multimedia;
      let image = "";
      if (multimedia !== null && multimedia.length > 0) {
        let imageUrl = "";
        if (multimedia.length >= 2) {
          imageUrl = multimedia[0].url === null ? "" : multimedia[0].url;
        } else {
          imageUrl = multimedia[0].url === null ? "" : multimedia[0].url;
        }
        image = nytImageBasePath + imageUrl;
      }

      // parse the content
      let content =
        originNews.lead_paragraph === null ? "" : originNews.lead_paragraph;
      if (content === "") {
        // if there is no content, then using abstract
        content = originNews.abstract === null ? "" : originNews.abstract;
      }

      // parse the source
      let source = originNews.source === null ? "" : originNews.source;

      // parse the source url
      let url = originNews.web_url === null ? "" : originNews.web_url;
      nytListParsed.push({
        title,
        author,
        publishedDate,
        image,
        content,
        source,
        url
      });
    }
    return nytListParsed;
  };

  goPreNewsHandle = e => {
    e.preventDefault();

    let currentNewsIndex = this.state.currentNewsIndex;
    // go Previous
    currentNewsIndex -= 1;
    if (currentNewsIndex < 0) {
      currentNewsIndex = this.state.renderList.length - 1;
    }

    this.setState({ currentNewsIndex: currentNewsIndex });
  };

  goNextNewsHandle = e => {
    e.preventDefault();

    let currentNewsIndex = this.state.currentNewsIndex;
    // go Next
    currentNewsIndex += 1;
    if (currentNewsIndex > this.state.renderList.length - 1) {
      currentNewsIndex = 0;
    }

    this.setState({ currentNewsIndex: currentNewsIndex });
  };

  render() {
    let news = this.state.renderList[this.state.currentNewsIndex];
    if (news === undefined) {
      news = {
        title: "",
        author: "",
        publishedDate: "",
        image: "",
        content: "",
        source: "",
        url: ""
      };
    }
    return (
      <div className="App">
        <header className="header">
          <div
            id="queryNewsApi"
            className="font_14 news_header"
            onClick={this.fetchFromNewsApi}
            data-apiindex="0"
            data-querytime="0"
          >
            News Api
          </div>
          <div
            id="queryNytApi"
            className="font_14 news_header"
            onClick={this.fetchFromNytApi}
          >
            NYT Api
          </div>
        </header>
        <main>
          <div className="news_main">
            <div className="news_main_left">
              <div
                className="goPrevious triangle_left"
                onClick={this.goPreNewsHandle}
              ></div>
            </div>
            <News news={news} />
            <div className="news_main_right">
              <div
                className="goNext triangle_right"
                onClick={this.goNextNewsHandle}
              ></div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
