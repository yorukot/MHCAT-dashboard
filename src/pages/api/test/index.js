import connectMongodb from "../../../util/connectMongodb";
import Test from "../../../util/schemas/test";

/**
 *
 * @param { import('next').NextApiRequest} req
 * @param { import('next').NextApiResponse } res
 */

export default async function addTest(req, res) {
    try {

        await connectMongodb();
      
        console.log(req.body);
        const test = await Test.create(JSON.parse(req.body));
      
        res.json({ test });
    } catch (error) {
        res.json({error})
    }

}
