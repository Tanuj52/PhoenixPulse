import React, { Component } from 'react'
import NewsItem from './NewsItem'
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component'
import Spinner from './Spinner'

export default class News extends Component {
    // API key defined as a class property
    static API_KEY = '4991a0afe5e94f8ea28eb60875ac3b80';

    static defaultProps = {
        country: 'us',
        pageSize: 15,
        category: 'general'
    }

    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string
    }

    capitalizeFirstLetter = (string) => {
        if (string.length === 0) return ""; 
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            loading: true,
            page: 1,
            totalArticles: 0
        }
        document.title = `Phoenix Pulse-${this.capitalizeFirstLetter(this.props.category)}`
    }

    async componentDidMount() {
        this.updateNews();
    }

    updateNews = async () => {
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${News.API_KEY}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.props.setProgress(10)
        this.setState({ loading: true })
        try {
            let data = await fetch(url);
            let parsedData = await data.json();
            if (parsedData.status === 'error') {
                console.error('API Error:', parsedData.message);
                this.setState({ loading: false });
                return;
            }
            this.setState({
                articles: parsedData.articles,
                totalArticles: parsedData.totalResults,
                loading: false
            });
        } catch (error) {
            console.error('Fetch Error:', error);
            this.setState({ loading: false });
        }
        this.props.setProgress(100)
    }

    handlePreviousClick = async () => {
        this.setState({ page: this.state.page - 1 }, this.updateNews);
    }

    handleNextClick = async () => {
        this.setState({ page: this.state.page + 1 }, this.updateNews);
    }

    fetchMoreData = async () => {
        const nextPage = this.state.page + 1;
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${News.API_KEY}&page=${nextPage}&pageSize=${this.props.pageSize}`;
        
        try {
            let data = await fetch(url);
            let parsedData = await data.json();
            if (parsedData.status === 'error') {
                console.error('API Error:', parsedData.message);
                return;
            }
            this.setState(prevState => ({
                articles: [...prevState.articles, ...parsedData.articles],
                totalArticles: parsedData.totalResults,
                page: nextPage,
                loading: false
            }));
        } catch (error) {
            console.error('Fetch Error:', error);
        }
    }

    render() {
        const filteredArticles = this.state.articles.filter(article => 
            article && article.url && !article.url.includes("removed.com")
        );

        return (
            <div className='container my-3'>
                <h1 className='text-center' style={{ 
                    margin: '35px 0px', 
                    color: '#FFD700', 
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' 
                }}>
                    Phoenix Pulse - Top {this.capitalizeFirstLetter(this.props.category)} Headlines
                </h1>
                
                {this.state.loading && <Spinner />}
                
                <InfiniteScroll
                    style={{ overflowX: 'hidden' }}
                    dataLength={this.state.articles.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.articles.length < this.state.totalArticles}
                    loader={<Spinner />}
                >
                    <div className='container'>
                        <div className='row'>
                            {filteredArticles.map((element, index) => (
                                <div className='col-md-4' key={`${element.url}-${index}`}>
                                    <NewsItem 
                                        title={element.title?.slice(0, 200) || " "}
                                        description={element.description || " "}
                                        imageUrl={element.urlToImage}
                                        newsUrl={element.url}
                                        author={element.author}
                                        date={element.publishedAt}
                                        source={element.source?.name}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </InfiniteScroll>
            </div>
        )
    }
}
