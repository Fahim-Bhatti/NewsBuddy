import React, { Component } from 'react'
import NewsItem from './NewsItem'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from './Spinner'

export class News extends Component {

    static defaultProps = {
        country: 'us',
        pageSize: 8,
        category: 'general'
    }

    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            loading: true,
            currentPage: 1,
        };
        document.title = `${this.capitalizeFirstLetter(this.props.category)} - WhatsNew`;
    }

    async fetchData(pageNumber) {
        try {
            this.setState({ loading: 'true' });
            const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=0fd96f5cc4724730b118bc0dab316db5&page=${pageNumber}&pageSize=${this.props.pageSize}`;
            const data = await fetch(url);
            if (!data.ok) {
                throw new Error('Failed to fetch articles')
            }
            const fetchedData = await data.json();
            console.log(fetchedData);

            const totalResults = fetchedData.totalResults;
            const totalPages = Math.ceil(totalResults / this.props.pageSize);

            this.setState({ articles: fetchedData.articles, totalPages: totalPages, loading: false });
        } catch (error) {
            console.error('Error fetching articles', error);
            this.setstate({ loading: 'false' });
        }
    }

    async componentDidMount() {
        await this.fetchData(this.state.currentPage);
    }

    handlePageChange = (pageNumber) => {
        this.setState({ currentPage: pageNumber }, () => {
            this.fetchData(pageNumber);
        });
    };

    fetchMoreData = async () => {
        this.setState({ page: this.state.page + 1 })
        try {
            this.setState({ loading: 'true' });
            const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=0fd96f5cc4724730b118bc0dab316db5&page=${this.state.pageNumber}&pageSize=${this.props.pageSize}`;
            const data = await fetch(url);
            if (!data.ok) {
                throw new Error('Failed to fetch articles')
            }
            const fetchedData = await data.json();
            console.log(fetchedData);

            const totalResults = fetchedData.totalResults;
            const totalPages = Math.ceil(totalResults / this.props.pageSize);

            this.setState({ articles: this.state.articles.concat(fetchedData.articles), totalPages: totalPages, loading: false });
        } catch (error) {
            console.error('Error fetching articles', error);
            this.setstate({ loading: 'false' });
        }
    };


    render() {
        const { articles } = this.state;
        // const { pageSize } = this.props;
        // const isFirstPage = currentPage === 1;
        // const isLastPage = currentPage === totalPages;

        return (
            <>
                <h1 className='text-center'>WhatsNew - Top <strong>{this.capitalizeFirstLetter(this.props.category)}</strong> Headlines</h1>
                {/* {loading && (
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )} */}
                <CurrentCategory />

                <InfiniteScroll
                    dataLength={this.state.articles.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.articles.length !== this.state.totalResults}
                    loader={<Spinner />}
                >
                    <div className="container">
                        <div className="row my-3">
                            {articles.map((element) => {
                                return (
                                    <div className="col-md-4" key={element.url}>
                                        <NewsItem
                                            title={element.title ? element.title : ''}
                                            description={element.description ? element.description : ''}
                                            imageURL={element.urlToImage ? element.urlToImage : ''}
                                            url={element.url} author={element.author} date={element.publishedAt} source={element.source.name}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </InfiniteScroll>
                </>

                /*{ <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-between">
                        <li className={`page-item ${isFirstPage ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => this.handlePageChange(currentPage - 1)}>
                                &larr; Previous
                            </button>
                        </li>
                        <li className="page-item">
                            <button className="page-link" onClick={() => this.handlePageChange(1)}>1</button>
                        </li>
                        <li className="page-item">
                            <button className="page-link" onClick={() => this.handlePageChange(2)}>2</button>
                        </li>
                        <li className={`page-item ${isLastPage ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => this.handlePageChange(currentPage + 1)}>
                                Next &rarr;
                            </button>
                        </li>
                    </ul>
                </nav>} */
        );
        function CurrentCategory() {
            const [currentCategory, setCurrentCategory] = useState('');
            const location = useLocation();

            useEffect(() => {
                const path = location.pathname;
                const category = path.substring(1);
                setCurrentCategory(category);
            }, [location.pathname]);

            return (
                currentCategory && (
                    <h3 className="text-center text-danger mt-3"><mark><em>{currentCategory.toUpperCase()}</em></mark></h3>
                )
            );
        }
    }
}

export default News