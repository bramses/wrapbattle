import db from '../../utils/db';
import dashify from 'dashify';
import id from 'uuid-readable';
import {v4 as uuid} from 'uuid';


export default async function handler(req, res) {
    try {
        const { songIDs, username } = req.body;
        

        const shortId = dashify(id.short(uuid()));
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
            const { fbId } = await db.collection('sessions').add({
                ...obj,
                created: new Date().toISOString(),
            });
            res.status(200).json({...obj});
        }
    } catch (e) {
        console.error(e);
        res.status(400).end();
    }
}
