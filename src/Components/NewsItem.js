import React, { Component } from 'react'

export class NewsItem extends Component {
    render() {
        let { title, description, imageURL, url, author, date, source} = this.props
        return (
            <div className='my-3'>
                <div className="card" style={{width: `22rem`}}>
                    <img src={!imageURL ? "https://blog.logrocket.com/wp-content/uploads/2024/03/modern-api-data-fetching-methods-react.png" : imageURL} className="card-img-top" style={{ height: "200px", objectFit: "cover" }} alt="No Image" />
                    <div className="card-body">
                        <span className="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-danger">{source}</span>
                        <h5 className="card-title">{title}..</h5>
                        <p className="card-text">{description}...</p>
                        <p className="card-text"><small className="text-body-secondary">By <span style={{color:'red'}}>{author ? author : "Unknown"}</span> on {new Date(date).toTimeString()}</small></p>
                        <a href={url} className="btn btn-sm btn-dark">Read More</a>
                    </div>
                </div>
            </div>
        )
    }
}

export default NewsItem