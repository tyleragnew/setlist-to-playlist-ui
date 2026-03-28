import { Box, Text } from '@chakra-ui/react';
import { keyframes as emotionKeyframes } from '@emotion/react';
import { useEffect, useMemo, useRef, useState } from 'react';

const spin = emotionKeyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const GRID = 11;
const TICK_MS = 80;
const MUSIC_CHARS = ['♩', '♪', '♫', '♬', '𝄞', '𝄢'];
const MUSIC_CHANCE = 0.50; // ~50% chance a cell shows a music char

function randomChar(): string {
    if (Math.random() < MUSIC_CHANCE) {
        return MUSIC_CHARS[Math.floor(Math.random() * MUSIC_CHARS.length)];
    }
    return String(Math.round(Math.random()));
}

// Precompute which cells fall on the ring (circle outline)
function buildCircleMask(gridSize: number): boolean[] {
    const center = (gridSize - 1) / 2;
    const outerRadius = gridSize / 2;
    const innerRadius = outerRadius - 1.5;
    const mask: boolean[] = [];
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            const dx = c - center;
            const dy = r - center;
            const dist = Math.sqrt(dx * dx + dy * dy);
            mask.push(dist <= outerRadius && dist >= innerRadius);
        }
    }
    return mask;
}

// Get ring cell indices sorted by angle so the highlight travels smoothly
function buildRingOrder(gridSize: number, mask: boolean[]): number[] {
    const center = (gridSize - 1) / 2;
    const cells: { idx: number; angle: number }[] = [];
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            const idx = r * gridSize + c;
            if (mask[idx]) {
                const angle = Math.atan2(r - center, c - center);
                cells.push({ idx, angle });
            }
        }
    }
    cells.sort((a, b) => a.angle - b.angle);
    return cells.map((c) => c.idx);
}

export function BinarySpinner({ size = 'md', fullScreen = false }: { size?: 'sm' | 'md' | 'lg'; fullScreen?: boolean }) {
    const mask = useMemo(() => buildCircleMask(GRID), []);
    const ringOrder = useMemo(() => buildRingOrder(GRID, mask), [mask]);
    const cellCount = GRID * GRID;

    const [grid, setGrid] = useState<string[]>(() =>
        Array.from({ length: cellCount }, () => randomChar()),
    );
    const highlightPos = useRef(0);
    const [highlightIdx, setHighlightIdx] = useState(ringOrder[0]);

    useEffect(() => {
        const id = setInterval(() => {
            setGrid((prev) => {
                const next = [...prev];
                const flips = 4 + Math.floor(Math.random() * 6);
                for (let i = 0; i < flips; i++) {
                    const idx = Math.floor(Math.random() * next.length);
                    if (mask[idx]) {
                        next[idx] = randomChar();
                    }
                }
                return next;
            });

            // Advance the white highlight around the ring
            highlightPos.current = (highlightPos.current + 1) % ringOrder.length;
            setHighlightIdx(ringOrder[highlightPos.current]);
        }, TICK_MS);
        return () => clearInterval(id);
    }, [mask, ringOrder]);

    const fontSize = size === 'sm' ? '14px' : size === 'lg' ? '24px' : '18px';
    const dimension = size === 'sm' ? '160px' : size === 'lg' ? '280px' : '220px';

    return (
        <Box display='flex' justifyContent='center' alignItems='center' {...(fullScreen ? { flex: 1, minH: dimension } : {})}>
            <Box
                w={dimension}
                h={dimension}
                display='grid'
                gridTemplateColumns={`repeat(${GRID}, 1fr)`}
                fontFamily='monospace'
                lineHeight='1'
                userSelect='none'
                css={{ animation: `${spin} 4s linear infinite` }}
            >
                {grid.map((bit, i) => {
                    const isHighlight = i === highlightIdx;
                    return (
                        <Text
                            key={i}
                            fontSize={fontSize}
                            color={isHighlight ? '#ffffff' : 'accent.green'}
                            textAlign='center'
                            display='flex'
                            alignItems='center'
                            justifyContent='center'
                            opacity={mask[i] ? (isHighlight ? 1 : bit === '0' ? 0.15 : 1) : 0}
                            transition='opacity 0.1s ease'
                            fontWeight={isHighlight ? 'bold' : 'normal'}
                        >
                            {bit}
                        </Text>
                    );
                })}
            </Box>
        </Box>
    );
}
