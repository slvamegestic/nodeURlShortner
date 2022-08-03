const express = require('express')

const router = express.Router()

const validUrl = require('valid-url')
const shortid = require('shortid')

const Url = require('../models/Url')

//@route    POST /api/url/shorten
//@desc     Create short URL

const baseUrl = 'http:localhost:5000'
router.post('/shorten', async(req,res)=>{
    const {longUrl} = req.body
    const {urlAlias} = req.body
   
    //check base url
    if(!validUrl.isUri(baseUrl)){
        return res.status(401).json('Invalid base URL')
    }
   
    
    //check long url
    checkLongUrl();
    async function checkLongUrl(){
    const urlCode = shortid.generate();

    if(validUrl.isUri(longUrl)){
            try{
                let url = await Url.findOne({longUrl})
                if(url){
                    res.json(url)
                }
                else{
                    let shortcode=await checkCodeexists(urlCode)
                    console.log(shortcode)
    //if shortcode alreadyexist creare newone
    if(shortcode){
        checkLongUrl();return
    }
    
                    const shortUrl = baseUrl + '/'+ urlCode
                    url = new Url({
                        longUrl,
                        shortUrl,
                        urlCode,
                        urlAlias,
                        date: new Date()
                    })
                    await url.save()
                    res.json(url)
                }
            }
            catch(err){
                console.log(err)
                res.status(500).json('Server Error')
            }
        }
        else{
            res.status(401).json('Invalid longUrl')
        }

    }
    
})
 function checkCodeexists(urlCode){
return Url.findOne({urlCode})
}
module.exports = router
