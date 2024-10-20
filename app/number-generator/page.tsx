'use client';

import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material";
import { Grid2 as Grid } from '@mui/material';
import { ConfigData } from '@/app/fake-db';
import { useEffect, useState } from "react";
import { db } from "@/firebaseconfig";
import { doc, getDoc } from "firebase/firestore";

export default function NumberGenerator() {
    // Current bug: if you update config in Firebase the page seems to only notice the update after you go through full cycle of normal mode to forced mode.
    const [randomNumber, setRandomNumber] = useState<number>(0);
    const [forcedRandomNumber, setForcedRandomNumber] = useState<number | null>(null);
    const [configData, setConfigData] = useState<ConfigData>();
    const [nextRandomNumberButtonClicked, setNextRandomNumberButtonClicked] = useState<number>(0);

    useEffect(() => {
        dataFetcher();
    }, []);

    useEffect(() => {
        if (configData == null) return;

        const getNextRandomNumber = setTimeout(() => {
            if (forcedRandomNumber != null) {
                setRandomNumber(forcedRandomNumber);
            } else {
                const nextRandomNumber = generateRandomNumber(configData.numberRange.lowLimit, configData?.numberRange.highLimit);
                setRandomNumber(nextRandomNumber);
            }
        }, 200)
        
        return () => {
            clearTimeout(getNextRandomNumber);
        }
    }, [nextRandomNumberButtonClicked]);
    
    useEffect(() => {
        if (randomNumber === forcedRandomNumber || nextRandomNumberButtonClicked === 0) {
            setForcedRandomNumber(null);
            return;
        }

        const forcedModeTimer = setTimeout(async () => {

            const configurationData = await dataFetcher();

            let nextForcedNumber: number | null = null;
            switch (configurationData?.mode) {
                case 'even':
                    nextForcedNumber = generateEvenNumber(configurationData.numberRange.lowLimit, configurationData?.numberRange.highLimit);
                    break;
                case 'odd':
                    nextForcedNumber = generateOddNumber(configurationData.numberRange.lowLimit, configurationData?.numberRange.highLimit);
                    break;
                case 'specific':
                    nextForcedNumber = configurationData.specificNumber;
                    break;
                case 'random':
                    nextForcedNumber = generateRandomNumber(configurationData.numberRange.lowLimit, configurationData?.numberRange.highLimit);
                    break;
            }

            console.log('Next forced number: ' + nextForcedNumber);

            setConfigData((configurationData as ConfigData));
            setForcedRandomNumber(nextForcedNumber);
        }, (configData?.delay ?? 2) * 1000); // Known bug: updating the delay will need a page refresh to take effect. Not sure how to fix this

        return () => clearTimeout(forcedModeTimer);
    }, [randomNumber])

    async function dataFetcher() {
        const docRef = doc(db, "default", "configs");
        const docSnap = await getDoc(docRef);

        const configurationData = docSnap.data();
        if (configurationData == null) {
            throw new Error('Config data is not set in database');
        }

        setConfigData((configurationData as ConfigData));

        return configurationData;
    }

    function handleNextNumber() {
        setNextRandomNumberButtonClicked(nextRandomNumberButtonClicked + 1);     
    }

    function generateRandomNumber(min: number, max: number) {
        // Ensure min is less than max
        if (min >= max) {
            throw new Error('Min should be less than Max');
        }
        
        return Math.floor(Math.random() * (max - min + 1)) + min;       
    }

    function generateEvenNumber(min: number, max: number) {
        // Adjust min to be even if it's odd
        if (min % 2 !== 0) {
            min++;
        }

        // Adjust max to be even if it's odd
        if (max % 2 !== 0) {
            max--;
        }
        
        const randomEven = Math.floor(Math.random() * ((max - min) / 2 + 1)) * 2 + min;
        return randomEven;
    }

    function generateOddNumber(min: number, max: number) {
        // Adjust min to be odd if it's even
        if (min % 2 === 0) {
            min++;
        }

        // Adjust max to be odd if it's even
        if (max % 2 === 0) {
            max--;
        }
        
        const randomOdd = Math.floor(Math.random() * ((max - min) / 2 + 1)) * 2 + min;
        return randomOdd;
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ backgroundColor: '#415f41' }}>
            <Toolbar>
                {/* Leave in to force height */}
                <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                >
                {/* <MenuIcon /> */}
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Random Number Generator</Typography>
            </Toolbar>
            </AppBar>

            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} sx={{ height: '93vh', alignContent: 'center', alignItems: 'center' }}>
                    <Grid size={3} sx={{ textAlign: 'center' }}>
                        <Button variant="contained" size="large" color="inherit" onClick={handleNextNumber}>Next</Button>
                    </Grid>
                    <Grid size={9} sx={{ textAlign: 'center' }}>
                        <Typography variant="h1" sx={{ fontSize: '70vh', color: '#415f41' }}>{randomNumber}</Typography>
                    </Grid>
                </Grid>
            </Box>
            {/* Show notification pixel when the forcedRandomNumber is set, but isn't displayed yet */}
            {forcedRandomNumber != null && forcedRandomNumber != randomNumber ?
                <div style={{
                    position: 'fixed',
                    bottom: '15px',
                    right: '15px',
                    height: '7px',
                    width: '7px',
                    backgroundColor: '#a3a3a3'
                    }}>
                </div>
                : <></>
            }
        </Box>
    );
}
