import { extendTheme } from '@chakra-ui/react';

const spotifyGreen = '#1DB954';
const spotifyGreenDark = '#1aa34a'; // slightly darker for light mode legibility

const theme = extendTheme({
    config: {
        initialColorMode: 'dark',
        useSystemColorMode: false,
    },
    colors: {
        spotify: {
            green: spotifyGreen,
            black: '#191414',
            gray: '#282828',
            white: '#FFFFFF',
        },
        brand: {
            50: '#e6fbe6',
            100: '#b3f0c2',
            200: '#80e59e',
            300: '#4ddb7a',
            400: spotifyGreen,
            500: spotifyGreen,
            600: '#189e47',
            700: '#137a38',
            800: '#0e5529',
            900: '#092f1a',
        },
    },
    semanticTokens: {
        colors: {
            'bg.page': {
                default: '#f7f7f7',
                _dark: '#0d0d0d',
            },
            'bg.card': {
                default: '#ffffff',
                _dark: '#181818',
            },
            'bg.surface': {
                default: '#ffffff',
                _dark: '#111111',
            },
            'bg.overlay': {
                default: 'rgba(255,255,255,0.92)',
                _dark: 'rgba(17,17,17,0.92)',
            },
            'text.primary': {
                default: '#191414',
                _dark: '#ffffff',
            },
            'text.muted': {
                default: '#6b6b6b',
                _dark: '#a0a0a0',
            },
            'border.subtle': {
                default: '#e5e5e5',
                _dark: '#282828',
            },
            'accent.green': {
                default: spotifyGreenDark,
                _dark: spotifyGreen,
            },
        },
    },
    fonts: {
        heading: '"Circular", "Inter", Helvetica, Arial, sans-serif',
        body: '"Circular", "Inter", Helvetica, Arial, sans-serif',
    },
    styles: {
        global: {
            body: {
                bg: 'bg.page',
                color: 'text.primary',
                transition: 'background-color 0.2s ease, color 0.2s ease',
            },
        },
    },
    components: {
        Button: {
            baseStyle: {
                fontWeight: 'bold',
                borderRadius: 'full',
                transition: 'all 0.2s ease',
            },
            variants: {
                solid: (props: { colorScheme: string }) => {
                    if (props.colorScheme === 'spotify') {
                        return {
                            bg: 'accent.green',
                            color: '#ffffff',
                            _hover: {
                                bg: spotifyGreen,
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 16px rgba(29,185,84,0.35)',
                            },
                            _active: { transform: 'translateY(0)' },
                        };
                    }
                    return {};
                },
                outline: (props: { colorScheme: string }) => {
                    if (props.colorScheme === 'spotify') {
                        return {
                            borderColor: 'accent.green',
                            color: 'accent.green',
                            borderWidth: '2px',
                            _hover: {
                                bg: 'transparent',
                                borderColor: spotifyGreen,
                                color: spotifyGreen,
                                transform: 'translateY(-1px)',
                            },
                            _active: { transform: 'translateY(0)' },
                        };
                    }
                    return {};
                },
                ghost: {
                    _hover: {
                        bg: 'border.subtle',
                    },
                },
            },
        },
        Input: {
            variants: {
                outline: {
                    field: {
                        bg: 'bg.card',
                        borderColor: 'border.subtle',
                        color: 'text.primary',
                        _placeholder: { color: 'text.muted' },
                        _hover: { borderColor: 'accent.green' },
                        _focus: {
                            borderColor: 'accent.green',
                            boxShadow: '0 0 0 1px var(--chakra-colors-accent-green)',
                        },
                    },
                },
            },
            defaultProps: {
                variant: 'outline',
            },
        },
        Card: {
            baseStyle: {
                container: {
                    bg: 'bg.card',
                    borderWidth: '1px',
                    borderColor: 'border.subtle',
                    borderRadius: 'xl',
                    transition: 'all 0.2s ease',
                    _hover: {
                        transform: 'translateY(-2px)',
                        boxShadow: 'lg',
                        borderColor: 'accent.green',
                    },
                },
            },
        },
        Stepper: {
            baseStyle: {
                step: {},
                indicator: {
                    borderColor: 'border.subtle',
                },
            },
        },
    },
});

export default theme;
