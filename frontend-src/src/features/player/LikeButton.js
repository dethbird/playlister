import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ActionIcon } from '@mantine/core';
import {
  IconHeart
} from '@tabler/icons-react';
import {
  liked,
  like,
  unlike,
  selectIsLiked
} from './playerSlice';

export function LikeButton({ trackId }) {

  const isLiked = useSelector(selectIsLiked);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(liked(trackId));
  }, [dispatch, trackId]);


  return (
    <ActionIcon
      aria-label="Like / Unlike"
      onClick={() => isLiked ? dispatch(unlike(trackId)) : dispatch(like(trackId))}
      color='pink'
      variant={ isLiked ? 'filled' : 'outline'}
    >
      <IconHeart
        style={{ width: '70%', height: '70%' }}
      />
    </ActionIcon>
    // <button onClick={() => isLiked ? dispatch(unlike(trackId)) : dispatch(like(trackId))}>{isLiked ? 'Unlike' : 'Like'}</button>
  );

}
