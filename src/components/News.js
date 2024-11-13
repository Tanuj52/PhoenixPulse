import React, { Component } from 'react';
import NewsItem from './NewsItem';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from './Spinner';

export default class News extends Component {
    static defaultProps = {
        country: 'us',
        pageSize: 10,
        category: 'general'
    };

    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string
    };

    capitalizeFirstLetter = (string) => {
        if (string.length === 0) return ""; // Return empty string if input is empty
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            loading: true,
            page: 1,
            totalArticles: 0
        };
        document.title = `Phoenix Pulse - ${this.capitalizeFirstLetter(this.props.category)}`;
    }

    async componentDidMount() {
        this.updateNews();
    }

    updateNews = async () => {
        const { country, category, pageSize } = this.props;
        let url = `https://gnews.io/api/v4/top-headlines?country=${country}&category=${category}&lang=en&max=${pageSize}&apikey=c08d449b54ac53290dfea215e6e1a112`;

        this.props.setProgress(10);
        this.setState({ loading: true });

        let data = await fetch(url);
        let parsedData = await data.json();
        console.log(parsedData);

        this.setState({
            articles: parsedData.articles,
            totalArticles: parsedData.totalArticles,
            loading: false
        });

        this.props.setProgress(100);
    };

    fetchMoreData = async () => {
        this.setState({ page: this.state.page + 1 });

        const { country, category, pageSize } = this.props;
        let url = `https://gnews.io/api/v4/top-headlines?country=${country}&category=${category}&lang=en&max=${pageSize}&apikey=c08d449b54ac53290dfea215e6e1a112&page=${this.state.page}`;

        let data = await fetch(url);
        let parsedData = await data.json();
        console.log(parsedData);

        this.setState({
            articles: this.state.articles.concat(parsedData.articles),
            totalArticles: parsedData.totalArticles,
            loading: false
        });
    };

    render() {
        const filteredArticles = this.state.articles.filter(article => !article.url.includes("removed.com"));

        return (
            <div className='container my-3'>
                <h1 className='text-center' style={{ margin: '35px 0px',marginTop:'90px', color: '#FFD700', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}>
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
                                        title={element.title ? element.title.slice(0, 200) : " "}
                                        description={element.description || " "}
                                        imageUrl={element.image}
                                        newsUrl={element.url}
                                        author={element.author}
                                        date={element.publishedAt}
                                        source={element.source.name}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </InfiniteScroll>
            </div>
        );
    }
}
