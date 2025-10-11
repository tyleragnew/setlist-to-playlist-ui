import { extendTheme } from '@chakra-ui/react';

const spotifyGreen = '#1DB954';
const spotifyBlack = '#191414';
const spotifyGray = '#282828';
const spotifyWhite = '#FFFFFF';

const theme = extendTheme({
    colors: {
        spotify: {
            green: spotifyGreen,
            black: spotifyBlack,
            gray: spotifyGray,
            white: spotifyWhite,
        },
        brand: {
            50: '#e6fbe6',
            100: '#b3f0c2',
            200: '#80e59e',
            300: '#4ddb7a',
            400: '#1db954', // Spotify green
            500: '#1db954',
            600: '#189e47',
            700: '#137a38',
            800: '#0e5529',
            900: '#092f1a',
        },
        black: spotifyBlack,
        white: spotifyWhite,
        gray: {
            900: spotifyBlack,
            800: spotifyGray,
            700: '#404040',
            600: '#606060',
            500: '#808080',
            400: '#a0a0a0',
            300: '#c0c0c0',
            200: '#e0e0e0',
            100: '#f5f5f5',
            50: '#fafafa',
        },
    },
    fonts: {
        heading: 'Circular, Helvetica, Arial, sans-serif',
        body: 'Circular, Helvetica, Arial, sans-serif',
    },
    styles: {
        global: {
            body: {
                bg: spotifyBlack,
                color: spotifyWhite,
            },
        },
    },
    components: {
        Button: {
            baseStyle: {
                fontWeight: 'bold',
                borderRadius: 'full',
            },
            variants: {
                solid: {
                    bg: spotifyGreen,
                    color: spotifyBlack,
                    _hover: { bg: '#1ed760' },
                },
                outline: {
                    borderColor: spotifyGreen,
                    color: spotifyGreen,
                },
            },
        },
        Box: {
            baseStyle: {
                borderRadius: 'md',
            },
        },
    },
});

export default theme;
