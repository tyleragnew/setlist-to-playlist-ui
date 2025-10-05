import { Button, FormControl, FormHelperText, FormLabel, Input, Radio, RadioGroup, SimpleGrid, Stack } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { ListenerContext } from "../App";
import { ProjectedSetlist } from "../components/ProjectedSetlist";


export function SetSetlistMetadata() {

    //@ts-ignore
    const { chosenArtist, token, setSetlistMetadata } = useContext(ListenerContext);

    const [setlistLoaded, setSetlistLoaded] = useState(false);

    // @TODO - add debouncing here instead of using OnBlur event.
    const fetchData = async () => {
        try {
            const response = await fetch(
                `https://setlist-to-playlist-api.vercel.app/setlists?artistMBID=${chosenArtist.mbid}&numberOfSets=20`
            );
            const jsonData = await response.json();
            setSetlistMetadata(jsonData);
            setSetlistLoaded(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <>
            <SimpleGrid alignItems='center'>
                <h1>{chosenArtist.artistName}</h1>
                <FormControl>
                    <FormHelperText>Include the last X sets for {chosenArtist.artistName}</FormHelperText>
                    <Input type='number' />
                    <RadioGroup defaultValue='1' alignItems='center'>
                        <Stack spacing={4} direction='row'>
                            <Radio value='1'>
                                Include Songs on Tape
                            </Radio>
                            <Radio value='2'>
                                Don't Include Songs on Tape
                            </Radio>
                        </Stack>
                    </RadioGroup>
                    <br />
                    <Button colorScheme="blue" onClick={fetchData}>Generate Projected Setlist</Button>
                </FormControl>
                <br />
                {setlistLoaded ? <ProjectedSetlist /> : null}
            </SimpleGrid>
        </>
    );
}
