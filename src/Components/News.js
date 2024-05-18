import React, { Component } from 'react';
import NewsItem from './NewsItem';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from './Spinner';
import { Button } from 'react-bootstrap';

export class News extends Component {

    static defaultProps = {
        country: 'us',
        pageSize: 8,
        category: 'general'
    }

    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string,
        apiKey: PropTypes.string.isRequired,
        setProgress: PropTypes.func.isRequired,
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            loading: false,
            page: 1,
            totalResults: 0,
            showToTopButton: false,
        };
        document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsBuddy`;
    }

    async updateNews(page) {
        this.props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${page}&pageSize=${this.props.pageSize}`;
        this.setState({ loading: true });
        let data = await fetch(url);
        this.props.setProgress(30);
        let fetchedData = await data.json();
        this.props.setProgress(70);
        this.setState((prevState) => ({
            articles: page === 1 ? fetchedData.articles : [...prevState.articles, ...fetchedData.articles],
            totalResults: fetchedData.totalResults,
            loading: false,
            page: page,
        }));
        this.props.setProgress(100);
    }

    async componentDidMount() {
        await this.updateNews(1);
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        const scrollPosition = window.scrollY;
        const scrollThreshold = 400;
        if (scrollPosition > scrollThreshold) {
            this.setState({ showToTopButton: true });
        } else {
            this.setState({ showToTopButton: false });
        }
    };

    scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    // handlePrevClick = async () => {
    //     this.setState({ page: this.state.Page - 1 });
    //     this.updateNews();
    // }

    // handleNextClick = async () => {
    //     this.setState({ page: this.state.Page + 1 });
    //     this.updateNews()
    // }

    fetchMoreData = async () => {
        const nextPage = this.state.page + 1;
        await this.updateNews(nextPage);
    };

    // fetchMoreData = async () => {
    //     const nextPage = this.state.page + 1;
    //     const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${nextPage}&pageSize=${this.props.pageSize}`;
    //     try {
    //         this.setState({ loading: true });
    //         const response = await fetch(url);
    //         if (!response.ok) {
    //             throw new Error('Failed to fetch articles');
    //         }
    //         const fetchedData = await response.json();
    //         console.log(fetchedData);
    //         if (fetchedData.articles.length > 0) {
    //             this.setState(prevState => ({
    //                 articles: [...prevState.articles, ...fetchedData.articles],
    //                 page: nextPage,
    //                 loading: false 
    //             }));
    //         } else {
    //             this.setState({ loading: false });
    //         }
    //     } catch (error) {
    //         console.error('Error fetching articles', error);
    //         this.setState({ loading: false });
    //     }
    // };


    render() {
        return (
            <>
                <div className="container my-3">
                    <h1 className='text-center'>NewsBuddy - Top <strong>{this.capitalizeFirstLetter(this.props.category)}</strong> Headlines</h1>
                    {this.state.loading && <Spinner />}
                    <CurrentCategory />
                    <InfiniteScroll
                        dataLength={this.state.articles.length}
                        next={this.fetchMoreData}
                        hasMore={this.state.articles.length < this.state.totalResults}
                        loader={<Spinner />}
                    >
                        <div className="container">
                            <div className="row my-3">
                                {this.state.articles.map((element, index) => (
                                    <div className="col-md-4" key={element.url + index}>
                                        <NewsItem
                                            title={element.title ? element.title : ''}
                                            description={element.description ? element.description : ''}
                                            imageURL={element.urlToImage ? element.urlToImage : ''}
                                            url={element.url}
                                            author={element.author}
                                            date={element.publishedAt}
                                            source={element.source.name}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </InfiniteScroll>

                    {/* <nav aria-label="Page navigation example">
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
                </nav> */}
                    {this.state.showToTopButton && (
                        <Button variant="primary" onClick={this.scrollToTop} style={styles.toTopButton}>
                            &uarr;
                        </Button>
                    )}
                </div>
            </>
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
const styles = {
    toTopButton: {
        position: 'fixed',
        bottom: '20px',
        right: '20px'
    }
};

export default News