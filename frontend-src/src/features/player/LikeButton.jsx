import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ActionIcon, Tooltip } from '@mantine/core';
import {
  IconHeart,
  IconHeartFilled
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
    <Tooltip label="Like / Unlike">
      <ActionIcon
        role='button'
        name="Like / Unlike"
        aria-label="Like / Unlike"
        onClick={() => isLiked ? dispatch(unlike(trackId)) : dispatch(like(trackId))}
        color='pink'
        variant='light'
      >
        {isLiked ? <IconHeartFilled /> : <IconHeart />}
      </ActionIcon>
    </Tooltip>
  );

}
