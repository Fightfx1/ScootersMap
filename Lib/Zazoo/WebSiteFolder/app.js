const express = require("express");
const bodyParser = require("body-parser");
const nunjucks = require('nunjucks');
var path = require('path');
const router = express.Router();
const STRIPE_API = require('./api/stripe-functions.js');


function stripe(app)
{
  console.log(__dirname)
  app.use(express.static(__dirname));
  app.use('/styles', express.static('styles'));
  nunjucks.configure(__dirname + '/views', { autoescape: true, express: app });
  app.use(bodyParser());
  app.use('/', router);

  router.get('/', (req, res) => {
    STRIPE_API.getAllProductsAndPlans().then(products => {
      res.render('customerView.html', {products: products});
    });
  });

  router.get('/createProduct', (req, res) => {
    res.render('createProduct.html');
  });
  
  
  router.post('/createProduct', (req, res) => {
    STRIPE_API.createProduct(req.body).then(() => {
      res.render('createProduct.html', { success: true });
    });
  });
  
  
  /* Create Plan */
  router.post('/createPlan', (req, res) => {
    res.render('createPlan.html', { 
      productId: req.body.productId, 
      productName: req.body.productName 
    });
  });
  
  
  router.post('/createPlanForReal', (req, res) => {
    STRIPE_API.createPlan(req.body).then(() => {
      res.render('createPlan.html', { success: true });
    });
  });
  
  router.get('/customerView', (req, res) => {
    STRIPE_API.getAllProductsAndPlans().then(products => {
      products = products.filter(product => {
        return product.plans.length > 0;
      });
  
      res.render('customerView.html', {products: products});
    });
  });
  
  
  router.post('/signUp', (req, res) => {
    var product = {
      name: req.body.productName
    };
  
    var plan = {
      id: req.body.planId,
      name: req.body.planName,
      amount: req.body.planAmount,
      interval: req.body.planInterval,
      interval_count: req.body.planIntervalCount
    }
  
    res.render('signUp.html', {product: product, plan: plan});
  });
  
  
  router.post('/processPayment', (req, res) => {
    var product = {
      name: req.body.productName
    };
  
    var plan = {
      id: req.body.planId,
      name: req.body.planName,
      amount: req.body.planAmount,
      interval: req.body.planInterval,
      interval_count: req.body.planIntervalCount
    }
  
    STRIPE_API.createCustomerAndSubscription(req.body).then(() => {
      res.render('signup.html', {product: product, plan: plan, success: true});
    }).catch(err => {
      res.render('signup.html', {product: product, plan: plan, error: true});
    });
  });
}

module.exports.WebSite = stripe;
