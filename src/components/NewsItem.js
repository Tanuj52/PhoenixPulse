import React, { Component } from 'react'

export class NewsItem extends Component {
    render() {
        let { title, description, imageUrl, newsUrl, author, date, source } = this.props;
        const imageStyle = {
            height: imageUrl ? (imageUrl.height > 200 ? '200px' : 'auto') : '200px',
            objectFit: 'cover',
            width: '100%',
            maxHeight: '230px'
        };
        const cardStyle = {
            minHeight: '575px', // Minimum height for the card container
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        };
        const cardBodyStyle = {
            flex: '1', // This makes the card body take up available space
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between' // Ensures button is at the bottom
        };
        return (
            <div className='container my-3 mt-5'>
                <div className="card" style={cardStyle}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        position: 'absolute',
                        right: '0'
                    }}>
                        <span className="badge rounded-pill bg-danger" style={{ left: '93%', zIndex: '1' }}>
                            {source}
                        </span>
                    </div>
                    <img
                        src={imageUrl ? imageUrl : "https://cdn.pixabay.com/photo/2017/06/26/19/03/news-2444778_960_720.jpg"}
                        onError={(e) => e.target.src = "https://cdn.pixabay.com/photo/2017/06/26/19/03/news-2444778_960_720.jpg"}
                        alt="News thumbnail"
                        style={imageStyle}
                    />

                    <div className="card-body" style={cardBodyStyle}>
                        <h5 className="card-title">{title}</h5>
                        <p className="card-text">{description}</p>
                        <p className="card-text"><small className="text-danger">By {!author ? "unknown" : author} on {new Date(date).toGMTString()}</small></p>
                        <a href={newsUrl} className="btn btn-sm btn-dark" style={{ width: '88px', alignSelf: 'start' }}>Read More</a>
                    </div>
                </div>
            </div>
        )
    }
}

export default NewsItem
