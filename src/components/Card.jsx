import React from 'react';

import CardInfo from './CardInfo';

function Card({ item, onToggle }) {
    const detailsId = `project-${item.id}-details`;

    return (
        <div className="d-inline-block n-card">
            <button
                type="button"
                className="n-card-toggle"
                aria-label={item.title}
                aria-expanded={item.selected}
                aria-controls={detailsId}
                onClick={onToggle}
            >
                <img className="n-card-image" src={item.imgSrc} alt="" />
            </button>
            <div id={detailsId} hidden={!item.selected}>
                {item.selected && <CardInfo title={item.title} subTitle={item.subTitle} link={item.link} />}
            </div>
        </div>
    );
}

export default Card;
