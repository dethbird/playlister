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
            "#f2f0ff",
            "#e0dff2",
            "#bfbdde",
            "#9b98ca",
            "#7d79ba",
            "#6a65b0",
            "#605bac",
            "#504c97",
            "#464388",
            "#3b3979"
        ]
    }
});
