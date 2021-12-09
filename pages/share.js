import { useEffect, useState } from "react"
import axios from 'axios';
import { useRouter } from 'next/router'

import styles from '../styles/Play.module.css'
import CenterContainer from '../components/centercontainer'

export default function Share() {
    return (
        <CenterContainer flash>
            <h1>You Got 60% of my-name-is-jeff</h1>
            <ul style={{ listStyle: 'none' }}>
                <li style={{ color: 'green' }}>Song 1</li>
                <li style={{ color: 'red' }}>Song 2</li>
                <li style={{ color: 'green' }}>Song 3</li>
                <li style={{ color: 'green' }}>Song 4</li>
                <li style={{ color: 'red' }}>Song 5</li>
            </ul>
            <button>Make Your Own</button>
        </CenterContainer>
    )
}