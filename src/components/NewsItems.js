import React from "react";

const NewsItems = (props) => {
  
    let { title, description, imageUrl, newsUrl, author, date } = props;

    const truncateText = (text, limit) => {
      return text && text.length > limit ? text.slice(0, limit) + "..." : text;
    };
    return (
      <>
        <div className="my-3">
          <div className="card" style={{height: "35rem"}}>
            <img src={imageUrl} className="card-img-top" alt="..." style={{height: "15rem"}}/>
            <div className="card-body">
              <h5 className="card-title">{truncateText(title, 100)}</h5>
              <p className="card-text">{truncateText(description, 100)}</p>
              <p className="card-text">
                <small className="text-muted">
                  <b>Author:</b> {author ? author : "unknown"} <br />
                  <b>Published On:</b> {new Date(date).toGMTString()}
                </small>
              </p>

              <a href={newsUrl} target="_blank" className="btn btn-sm btn-dark">
                Read More
              </a>
            </div>
          </div>
        </div>
      </>
    );

}
export default NewsItems;