import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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

  if (isLiked) {
    return <button onClick={() => dispatch(unlike(trackId))}>Unlike</button>
  }

  return <button onClick={() => dispatch(like(trackId))}>Like</button>;

}
