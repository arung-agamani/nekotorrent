import { Router, Request, Response} from 'express'
import { fetchNyaaRss } from '../../nyaa/nyaa';

const router = Router();

router.get('/rss', async (req: Request, res: Response) => {
    const nyaaRss = await fetchNyaaRss();
    if (nyaaRss) {
        let obj = {}
        nyaaRss.forEach((value, key) => {
            obj[key] = value
        })
        res.json({
            status: 'success',
            data: obj
        })
    }
})

export default router;