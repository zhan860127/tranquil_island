import { firebase, auth, db } from "../config/firebase";
import React, { useState } from 'react';

function addFavorite(id) {
  const currentUser = auth.currentUser.uid;

  return db
    .collection("Users")
    .doc(currentUser)
    .update({
      favorites: firebase.firestore.FieldValue.arrayUnion(id),
    });
}

function removeFavorite(id) {
  const currentUser = auth.currentUser.uid;

  return db
    .collection("Users")
    .doc(currentUser)
    .update({
      favorites: firebase.firestore.FieldValue.arrayRemove(id),
    });
}

function addToCart(newCart) {
  const currentUser = auth.currentUser.uid;

  return db.collection("Users").doc(currentUser).update({
    cart: newCart,
  });
}

 async function addOrder() {
  const currentUser = auth.currentUser.uid;
  let total_price = 0
  const citiesRef = db.collection('Products');
  let doc = []
  let product = []
  const sfRef = await db.collection('Users').doc(currentUser).get();
  let product_photo = []
  let order_item = []
  // console.log(sfRef.data().cart)
  
  Object.keys(sfRef.data().cart).map( (item) => {
    doc.push(item)
  }
  );
console.log(doc)


    for (var item = 0; item < doc.length; item++) {
    var price = await citiesRef.doc(doc[item]).get()
    // console.log(doc[item])
    // console.log(sfRef.data().cart[doc[item]].length)
    console.log(price.data().sale_price)
    total_price = total_price + price.data().sale_price * sfRef.data().cart[doc[item]].length
    product.push(...sfRef.data().cart[doc[item]])
    product_photo.push(price.data().cover_photo)
    order_item.push({
      Number:sfRef.data().cart[doc[item]].length,
      Name:price.data().product_name,
      list:{...sfRef.data().cart[doc[item]]},
    })
    // console.log(total_price)

    }
//   doc.forEach(async (item)=>{
//     var price = await citiesRef.doc(item).get()
//     console.log(price.data().sale_price)
//     total_price = total_price +price
//   })
console.log(total_price)
console.log(product)
  // db.collection("Users")
  //   .doc(currentUser)
  //   .onSnapshot( function (doc) {

  //      Object.keys(doc.data().cart).map(async (item) => {


  //       console.log(total_price)
        
      
  //     }
  //     )
  //   });
  
  var address = sfRef.data().addresses
  // const addressRef = await db.collection("Addresses").doc(address[0]).get()
  //   console.log(address[0])
  //   console.log(addressRef.data())
  return db.collection("Orders").add({
    total_price:total_price,
    address:address[0],
    products:product,
    date:Date.now(),
    status:"undeliver",
    product_photo,order_item
  })
  .then((doc) => {
    console.log(doc.id)
    db.collection("Users")
      .doc(currentUser)
      .update({
        orders: firebase.firestore.FieldValue.arrayUnion(doc.id),
        cart: "",
      })
      .finally(() => window.location.reload(false)); // reload page
  });



  // console.log({});
  return db.collection("Users").doc(currentUser).update({
    orders: {},
  });
}

export { addFavorite, removeFavorite, addToCart ,addOrder};
