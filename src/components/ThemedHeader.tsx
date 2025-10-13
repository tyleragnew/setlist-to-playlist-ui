import { Text } from "@chakra-ui/react";

import { TextProps } from "@chakra-ui/react";

export function ThemedHeader({ children, ...props }: { children?: React.ReactNode } & TextProps) {
    return (
        <Text
            fontSize={props.fontSize ?? { base: '2xl', md: '2.5xl' }}
            fontWeight={props.fontWeight ?? 'bold'}
            color={props.color ?? 'spotify.green'}
            mb={props.mb ?? 2}
            textAlign={props.textAlign ?? 'center'}
            {...props}
        >
            {children}
        </Text>
    );
}
