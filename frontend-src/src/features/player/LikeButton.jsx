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
        onClick={(e) => {
          const node = e.currentTarget || e.target;
          try {
            const color = window.getComputedStyle(node).color || 'rgb(255,105,180)';
            const start = color.replace(/rgba?\(([^)]+)\)/, 'rgba($1,0.0)');
            const bloom = color.replace(/rgba?\(([^)]+)\)/, 'rgba($1,0.55)');
            // lazy-load gsap here to avoid adding runtime cost if not available
            // but gsap is already installed/used elsewhere so just import dynamically
            import('gsap').then(({ gsap }) => {
              gsap.fromTo(node, { boxShadow: `0 0 0 ${start}` }, { boxShadow: `0 0 20px ${bloom}`, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' });
            }).catch(() => {
              // fallback: no animation
            });
          } catch (err) { /* ignore animation errors */ }

          if (isLiked) {
            dispatch(unlike(trackId));
          } else {
            dispatch(like(trackId));
          }
        }}
        color='pink'
        variant='light'
      >
        {isLiked ? <IconHeartFilled /> : <IconHeart />}
      </ActionIcon>
    </Tooltip>
  );

}
