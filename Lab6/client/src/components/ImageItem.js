import React from 'react';
import { useMutation } from '@apollo/client';
import { Button } from '@material-ui/core';
import Queries from '../Queries';

function ImageItem({ img, content }) {
  const [ updatedPost ] = useMutation(Queries.UPDATE_POST);
  const [ removePost ] = useMutation(Queries.REMOVE_POST);

  return (
    <>
      <li className='cards__item'>
        <div className='cards__item__link'>
          <figure className='cards__item__pic-wrap' data-category={img.posterName}>
            <img
              className='cards__item__img'
              alt={img.posterName}
              src={img.url}
            />
          </figure>
          <div className='cards__item__info'>
            <span className='cards__item__text'>{img.description}</span>
            <br />
            <br />
            <Button
              variant="contained"
              color="primary"
              onClick={async () => {
                try {
                  await updatedPost({ variables: { ...img, binned: !img.binned } });
                } catch (error) {
                  alert('Failed to update Image');
                }
              }}
            >
              { img.binned ? "Remove from Bin" : "Add To Bin" }
            </Button>

            { content === 'my-posts' ?
              <Button
                variant="contained"
                onClick={async () => {
                  try {
                    await removePost({ variables: { id: img.id } });
                  } catch (error) {
                    alert('Failed to Delete Image');
                  }
                }}
              >
                Delete Post
              </Button> : ''}
          </div>
        </div>
      </li>
    </>
  );
}

export default ImageItem;