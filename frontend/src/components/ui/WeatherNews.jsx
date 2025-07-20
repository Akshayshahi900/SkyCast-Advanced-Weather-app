import React, { useState, useEffect } from 'react';

const Card = ({ children, className }) => (
  <div className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, disabled, className, href, target }) => {
  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${className}`}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

function WeatherNews() {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL
}/api/news`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setNewsData(data);
    } catch (error) {
      console.error("Error fetching news:", error);
      setError(error.name === "SyntaxError"
        ? 'There was an issue with fetching the data. Please check the API URL.'
        : 'Failed to load news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filteredNewsData = newsData.filter(article =>
    article.title !== '[Removed]' && article.source.name !== '[Removed]'
  );

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Weather News</h2>
        <Button onClick={fetchNews} disabled={loading}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 inline" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array(6).fill(0).map((_, index) => (
            <Card key={index}>
              <Skeleton className="h-48 w-full" />
              <div className="p-4">
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </Card>
          ))
          : filteredNewsData.map((article, index) => (
            <Card key={index}>
              {article.urlToImage && (
                <div className="relative h-48 w-full">
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 line-clamp-2">{article.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{article.description}</p>
                {article.source.name !== "[Removed]" && (
                  <p className="text-sm font-medium text-gray-500 mb-4">Source: {article.source.name}</p>
                )}
                <Button
                  href={article.url}
                  target="_blank"
                  className="w-full text-center inline-flex items-center justify-center"
                >
                  Read Article
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                </Button>
              </div>
            </Card>
          ))
        }
      </div>
    </section>
  );
}

export default WeatherNews;