const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('' , (req , res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Sachin Chaudhary'
    })
})

app.get('/about', (req , res) => {
    res.render('about', {
        title: 'About',
        name: 'Sachin Chaudhary'
    })
})

app.get('/weather' , ({ query } , res) => {
    if(!query.address) {
        return res.send({
            error: 'You must provide a address'
        })
    }
    geocode(query.address , (error , {latitude , longitude , location} = {}) => {
        if(error) {
            return res.send({ error })
        }
    
        forecast(latitude, longitude, (error, forecastData) => {
            if(error) {
                return res.send({ error })
            }
            res.send({
                forecast: forecastData,
                location,
                address: query.address
            })
        })
    })
})

app.get('/products' , (req , res) => {
    if(!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    
    console.log(req.query.search);
    res.send({
        products: []
    })
})

app.get('/help/*' , (req , res) => {
    res.render('404' , {
        title: '404',
        name: 'Sachin Chaudhary',
        errorMessage: 'Help article not found.'
    })
})

app.get('*' , (req , res) => {
    res.render('404', {
        title: '404',
        name: 'Sachin Chaudhary',
        errorMessage: 'Page not found.'
    })
})


app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})