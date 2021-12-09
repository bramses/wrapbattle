import db from '../../utils/db';

export default async function handler(req, res) {

    try {
        const { slug } = req.body;
        const sessions = await db.collection('sessions').get();
    
        const sessionsData = sessions.docs.map(session => ({
            id: session.id,
            ...session.data()
        }));
        console.log(slug)
        if (sessionsData.some(session => session.slug === slug)) {
            console.log('Session found');
            const session = sessionsData.find(session => session.slug === slug);
            res.status(200).json(session);
        } else {
            res.status(404).json({
                message: 'Session not found'
            });
        }
    } catch (err) {
        console.log(err);
        res.status(400).end();
    }



}