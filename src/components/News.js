import React, { useState } from "react";
import { useEffect } from "react";
import NewsItems from "./NewsItems";
import Spinner from "./Spinner";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [apiLimitExceeded, setApiLimitExceeded] = useState(false);

  const capitalFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateNews = async () => {
    props.setProgress(10);
    setLoading(true);

    const url = `${process.env.REACT_APP_BACKEND_URL}/news?category=${props.category}&page=${page}&pageSize=${props.pageSize}`;

    try {
      let data = await fetch(url);
      let parsedData = await data.json();

      props.setProgress(70);

      if (parsedData.status === "error" && parsedData.code === "rateLimited") {
        setArticles([]);
        setTotalResults(0);
        setLoading(false);
        alert("⚠️ API limit exceeded! Try again after 24 hours.");
        return;
      }

      setArticles(parsedData.articles);
      setTotalResults(parsedData.totalResults);
    } catch (error) {
      console.error("Error fetching news:", error);
      alert("❌ Failed to fetch news. Please check your internet connection.");
    }

    setLoading(false);
    props.setProgress(100);
  };

  useEffect(() => {
    updateNews();
  }, []);

  const fetchMoreData = async () => {
    setPage(page + 1);
    setLoading(true);

    const url = `${process.env.REACT_APP_BACKEND_URL}/news?category=${props.category}&page=${page}&pageSize=${props.pageSize}`;

    try {
      let data = await fetch(url);
      let parsedData = await data.json();

      if (parsedData.status === "error" && parsedData.code === "rateLimited") {
        alert("⚠️ API limit exceeded! Try again after 24 hours.");
        return;
      }

      setArticles(articles.concat(parsedData.articles));
      setTotalResults(parsedData.totalResults);
    } catch (error) {
      console.error("Error fetching news:", error);
      alert("❌ Failed to fetch news. Please check your internet connection.");
    }

    setLoading(false);
  };

  return (
    <>
      <>
        <h1
          className="text-center"
          style={{ marginTop: "80px", marginBottom: "30px" }}
        >
          Newsify - Top {capitalFirstLetter(props.category)} Headlines
        </h1>

        {loading && articles.length === 0 ? (
          <div className="text-center">
            <Spinner />
          </div>
        ) : apiLimitExceeded ? (
          <h2 className="text-center text-danger">
            ⚠️ API limit exceeded! Try again after 24 hours.
          </h2>
        ) : (
          <InfiniteScroll
            dataLength={articles.length}
            next={fetchMoreData}
            hasMore={articles.length < totalResults}
            loader={<Spinner />}
          >
            <div className="container">
              <div className="row">
                {articles.map((element, index) => {
                  return (
                    <div className="col-md-4" key={`${element.url}-${index}`}>
                      <NewsItems
                        title={element ? element.title : ""}
                        description={element ? element.description : ""}
                        imageUrl={element.urlToImage}
                        newsUrl={element.url}
                        author={element.author}
                        date={element.publishedAt}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </InfiniteScroll>
        )}
      </>
    </>
  );
};

export default News;
