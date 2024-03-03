'use client';

import { useEffect, useState } from 'react';
import { getSeenIndexes, getValues, onSubmit } from './lib/values';
import styles from './page.module.css';

export default function Page(): JSX.Element {
    const [values, setValues] = useState<Record<string, string>>({});
    const [seenIndexes, setSeenIndexes] = useState<{ number: number }[]>([]);

    useEffect(() => {
        getValues()
            .then((data) => {
                console.log(data);
                setValues(data);
            })
            .catch(console.error);
        getSeenIndexes()
            .then((data) => {
                console.log(data);
                setSeenIndexes(data);
            })
            .catch(console.error);
    }, []);

    return (
        <main className={styles.main}>
            <h1>Fibonacci Calculator</h1>
            <p>Find the Fibonacci value for a given index</p>
            <form onSubmit={onSubmit}>
                <input type='number' name='index' />
                <button>Submit</button>
            </form>
            <h3>Indexes I have seen:</h3>
            <ul
                style={{
                    display: 'flex',
                }}>
                {seenIndexes.map(({ number }, i) => (
                    <li key={i}>{number}</li>
                ))}
            </ul>
            <h3>Calculated Values:</h3>
            <ul>
                {Object.keys(values).map((key, i) => (
                    <li key={i}>
                        For index {key} I calculated {values[key]}
                    </li>
                ))}
            </ul>
        </main>
    );
}

