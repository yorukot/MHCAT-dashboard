import connectMongodb from "../../../util/connectMongodb";
import Test from "../../../util/schemas/test";

/**
 *
 * @param { import('next').NextApiRequest} req
 * @param { import('next').NextApiResponse } res
 */

export default async function addTest(req, res) {
    try {
        console.log("CONNECTING TO MONGO");

        await connectMongodb();
      
        console.log("CONNECTED TO MONGO");
        console.log("CREATE DOCUMENT ");
        console.log(req.body);
        const test = await Test.create(JSON.parse(req.body));
        console.log("CREATE DOCUMENT");
      
        res.json({ test });
    } catch (error) {
        res.json({error})
    }

}
