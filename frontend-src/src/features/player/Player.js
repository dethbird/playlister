import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getCurrentTrack,
  selectCurrentTrack,
  selectStatus
} from './playerSlice';
// import styles from './Counter.module.css';

export function Player() {

  const dispatch = useDispatch();

  // const currentTrack = useSelector(selectCurrentTrack);
  // const status = useSelector(selectStatus);

  useEffect(() => {
    dispatch(getCurrentTrack());
  }, [dispatch]);

  // if (status === 'pending') {
  //   return <div>Loading...</div>;
  // }

  return (
    <div>
      {/* Track: {currentTrack.id} */}Track
    </div>
  );
}
