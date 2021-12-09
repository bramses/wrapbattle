import db from '../../utils/db';
import dashify from 'dashify';
import id from 'uuid-readable';
import {v4 as uuid} from 'uuid';


export default async function handler(req, res) {
    try {
        const songIDs = {
            "1": "3USxtqRwSYz57Ewm6wWRMp",
            "2": "5J6rTmMjF9DVIAF8G3M9n4",
            "3": "4ZtFanR9U6ndgddUvNcjcG",
            "4": "3Vi5XqYrmQgOYBajMWSvCi",
            "5": "4iN16F8JtVxG2UTzp3avGl",
            "6": "50nfwKoDiSYg8zOCREWAm5",
            "7": "3Kkjo3cT83cw09VJyrLNwX",
            "8": "3QPBocWfIcOCdFFvmqn60F",
            "9": "5GzpstdtupjJcu0JR5j3v6",
            "10": "00Blm7zeNqgYLPtW6zg8cj"
        }

        const shortId = dashify(id.short(uuid()));
        const username = 'test';
        const obj = {
            slug: shortId,
            songIDs,
            username
        }

        const { slug } = req.body;
        const sessions = await db.collection('sessions').get();
        const sessionsData = sessions.docs.map(session => session.data());

        if (sessionsData.some(session => session.slug === slug)) {
            res.status(400).end();
        } else {
            console.log(obj);
            const { id } = await db.collection('sessions').add({
                ...obj,
                created: new Date().toISOString(),
            });
            res.status(200).json({ id });
        }
    } catch (e) {
        console.error(e);
        res.status(400).end();
    }
}
