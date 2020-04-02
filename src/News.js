import React, { Component } from "react";
import "./App.css";
import "./News.css";

class News extends Component {
  render() {
    let {
      title,
      author,
      publishedDate,
      image,
      content,
      source,
      url
    } = this.props.news;
    return (
      <div className="news_main_middle">
        <h2
          className="font_18 news_title"
          dangerouslySetInnerHTML={{ __html: title }}
        ></h2>
        <div className="font_12 news_author_publishedDate">
          <span className="news_author">{author}</span>
          <span className="news_publishedDate">{publishedDate}</span>
        </div>
        <h6 className="font_12 news_source_url">
          Source:
          <a className="news_source" href={url} target="_blank">
            {source}
          </a>
        </h6>
        <div
          className="news_image"
          style={{ backgroundImage: `url(${image})` }}
        ></div>
        <p
          className="font_16 news_content"
          dangerouslySetInnerHTML={{ __html: content }}
        ></p>
      </div>
    );
  }
}

export default News;
