import React from 'react';
import { useSelector } from 'react-redux';
import { Paper } from '@mantine/core';
import { selectUser } from '../features/user/userSlice';

export function PaperStyled(props) {

    const user = useSelector(selectUser);

    return (
        <Paper withBorder bg={user.theme === 'light' ? '#FFFFFF' : '#1f1f1f'} {...props} >
            {props.children}
        </Paper>
    );

}

