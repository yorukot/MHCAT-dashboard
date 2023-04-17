
/**
 *
 * @param { import('next').NextApiRequest} req
 * @param { import('next').NextApiResponse } res
 */

export default async function addTest(req, res) {
    try {            
        res.json({ code: '1' });
    } catch (error) {
        res.json({error})
    }

}
