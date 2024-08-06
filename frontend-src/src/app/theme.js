import {
    createTheme,
    rem
} from '@mantine/core';

export const theme = createTheme({
    defaultGradient: {
        from: 'green',
        to: 'red',
        deg: 45,
    },
    fontSizes: {
        xs: rem(10),
        sm: rem(11),
        md: rem(14),
        lg: rem(16),
        xl: rem(20),
    },
    primaryColor: 'pale-purple',
    primaryShade: { light: 6, dark: 8 },
    colors: {
        'red': [
            "#ffe8fc",
            "#ffd0f0",
            "#fd9edc",
            "#fa69c8",
            "#f83eb8",
            "#f722ad",
            "#f711a8",
            "#dd0193",
            "#c50083",
            "#ae0072"
        ],
        'green': [
            "#e2ffeb",
            "#ccffda",
            "#9bfeb7",
            "#66fb90",
            "#3afa70",
            "#1dfa5b",
            "#02f94f",
            "#00de3e",
            "#00c635",
            "#00aa28"
        ],
        'pale-purple': [
            "#f6efff",
            "#e7def3",
            "#cbbce0",
            "#af97cd",
            "#9677bd",
            "#8763b3",
            "#7f59af",
            "#6d4a9a",
            "#61408b",
            "#54367b"
        ]
    }
});
