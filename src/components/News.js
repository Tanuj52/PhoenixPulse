import React, { Component } from 'react'
import NewsItem from './NewsItem'
// import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component'
import Spinner from './Spinner'

export default class News extends Component {
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
        if (string.length === 0) return ""; // Return empty string if input is empty
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    constructor(props) {
        super(props);
        console.log("Hello I am a constructor form news component");
        this.state = {
            articles: [],
            loading: true,
            page: 1,
            totalArticles: 0
        }
        document.title = `Phoenix Pulse-${this.capitalizeFirstLetter(this.props.category)}`
    };

    async componentDidMount() {
        this.updateNews();
    }

    updateNews = async () => {
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.props.setProgress(10)
        this.setState({ loading: true })
        let data = await fetch(url);
        this.props.setProgress(20)
        let parsedData = await data.json();
        console.log(parsedData);
        this.setState({
            articles: parsedData.articles,
            totalArticles: parsedData.totalResults,
            loading: false
        });
        this.props.setProgress(100)
    }
    handlePreviousClick = async () => {
        // console.log("Previous");
        // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
        // this.setState({ loading: true })
        // let data = await fetch(url);
        // let parsedData = await data.json();
        // console.log(parsedData);
        // this.setState({
        //     articles: parsedData.articles,
        //     page: this.state.page - 1,
        //     loading: false
        // });
        this.setState({ page: this.state.page - 1 });
        this.updateNews();
    }
    handleNextClick = async () => {
        // console.log("Next");
        // if (this.state.page < Math.ceil(this.state.totalArticles / this.props.pageSize)) {
        //     let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
        //     this.setState({ loading: true })
        //     let data = await fetch(url);
        //     let parsedData = await data.json();
        //     console.log(parsedData);
        //     this.setState({
        //         articles: parsedData.articles,
        //         page: this.state.page + 1,
        //         loading: false

        //     });
        // }
        this.setState({ page: this.state.page + 1 });
        this.updateNews();

    }
    fetchMoreData = async () => {
        this.setState({ page: this.state.page + 1 })
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        let data = await fetch(url);
        let parsedData = await data.json();
        console.log(parsedData);
        this.setState({
            articles: this.state.articles.concat(parsedData.articles),
            totalArticles: parsedData.totalResults,
            loading: false
        });
    };

    render() {
        const filteredArticles = this.state.articles.filter(article => !article.url.includes("removed.com"));
        return (
            <div className='container my-3'>
                <h1 className='text-center' style={{ margin: '35px 0px' }}>Phoenix Pulse - Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h1>
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
                            {/* {!this.state.loading && filteredArticles.map((elements) => { */}
                            {filteredArticles.map((elements, index) => {
                                return (
                                    <div className='col-md-4' key={`${elements.url}-${index}`} >
                                        <NewsItem title={elements.title ? elements.title.slice(0, 150) : " "} description={elements.description ? elements.description : " "} imageUrl={elements.urlToImage} newsUrl={elements.url} author={elements.author} date={elements.publishedAt} source={elements.source.name} />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </InfiniteScroll >
                {/* Used for previous and next buttons
                <div className='d-flex justify-content-between'>
                    <button type="button " disabled={this.state.page <= 1} className="btn btn-dark" onClick={this.handlePreviousClick}> &laquo; Previous</button>
                    <button type="button" disabled={this.state.page >= Math.ceil((this.state.totalArticles) / (this.props.pageSize))} className="btn btn-dark" onClick={this.handleNextClick}>Next &raquo; </button>
                </div> */}
            </div >
        )
    }
}
