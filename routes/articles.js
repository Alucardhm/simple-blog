const express = require('express')
const { findByIdAndDelete } = require('../models/article')
const Article = require('../models/article')
const router = express.Router()

router.get('/new', (req,res) => {
    res.render('articles/new',{article: ""})
})

router.get('/edit/:id', async(req,res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit',{article})
})

router.get('/:slug', async(req,res) => {
    let article;
    try {
        article = await Article.findOne({slug: req.params.slug})
        res.render('articles/show',{article})
    } catch (error) {
        if(article == null) res.redirect('/')
    }
})

router.post('/', async(req,res,next) => {
   req.article = new Article()
   next() // ir para o saveArticleAndRedirect
}, saveArticleAndRedirect('new') ) // cria uma sequencia de middleware functions

router.put('/:id', async(req,res,next) => {
    req.article = await Article.findById(req.params.id)
    next() // ir para o saveArticleAndRedirect
 }, saveArticleAndRedirect('edit') ) // cria uma sequencia de middleware functions
 

router.delete('/:id', async(req,res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

 function saveArticleAndRedirect(path){
     return async (req,res) => { // como é uma middleware function ela tem acesso ao req,res
        let article = req.article
        article.title = req.body.title,
        article.description = req.body.description,
        article.markdown = req.body.markdown
        try {
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
        } catch (error) {
            res.render(`articles/${path}`,{article})
        }
    }
}

module.exports = router