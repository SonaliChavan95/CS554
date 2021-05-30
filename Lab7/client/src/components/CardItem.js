import React from 'react';
import { Link } from 'react-router-dom';

function CardItem(props) {
  // console.log(props);
  return (
    <>
      <li className='cards__item'>
        <Link className='cards__item__link' to={`/${props.type}/${props.item.id}`}>
          <figure className='cards__item__pic-wrap' data-category={props.type}>
            <img
              className='cards__item__img'
              alt={props.item.name || props.item.title}
              src={props.item.thumbnail && props.item.thumbnail.path ? `${props.item.thumbnail.path}/landscape_amazing.${props.item.thumbnail.extension}` : ''}
            />
          </figure>
          <div className='cards__item__info'>
            <span className='cards__item__text'>{props.item.name || props.item.title}</span>
          </div>
        </Link>
      </li>
    </>
  );
}

export default CardItem;