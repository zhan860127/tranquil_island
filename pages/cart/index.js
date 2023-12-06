import Head from "next/head";
import styles from "./cart.module.scss";
import Button from "@/components/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Layout from "components/Layout";
import CartItem from "@/components/CartItem";
import { useCart, useCartOnce } from "hooks/cart.hook";
import React, { useEffect, useState } from "react";
import { auth, db } from "@/config/firebase";
import { useAuth } from "@/firebase/context";
import { addToCart } from "@/firebase/product";
import{addOrder} from "@/firebase/product";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

const schema = yup.object().shape({
  addressid: yup
    .string()
    .required("* Current Password is required.")
    .min(2, "* Password is too short - should be 8 chars minimum."),
  cart: yup.array().of(yup.string()),
  date: yup.
  date().
  required()
});


export default function CartPage() {
  const { user, loading } = useAuth();
  const { data } = useCart();
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });


  const onSubmit = (data) => {addOrder(data);}

  const cartLength = Object.keys(data).reduce((a, b) => a + data[b].length, 0);

  const cartItems =
    cartLength > 0
      ? Object.keys(data)
          .map((item) => {
            return data[item].map((size) => {
              return {
                name: item,
                size,
              };
            });
          })
          .flat(1)
      : [];

  const sizeCount = cartItems.reduce(
    (acc, value) => ({
      ...acc,
      [value.name + "__size__" + value.size]:
        (acc[value.name + "__size__" + value.size] || 0) + 1,
    }),
    {}
  );

  const cartItemsArray = [
    ...new Set(
      cartItems.filter(
        (v, i, a) =>
          a.findIndex((t) => t.name === v.name && t.size === v.size) === i
      )
    ),
  ].map((item) => {
    return { ...item, count: sizeCount[item.name + "__size__" + item.size] };
  });

  const addCartEvent = (id, size) => {
    console.log(...data[id])
    const newCart = size
      ? {
          ...data,
          [id]: data.hasOwnProperty(id) ? [...data[id], size] : [size],
        }
      : {
          ...data,
          [id]: data.hasOwnProperty(id) ? [...data[id], "-"] : ["-"],
        };
    addToCart(newCart);

    console.log(...data[id])
    console.log(...newCart[id])
  };
  const delCartEvent = (id, size) => {
    var newarray=data;
    console.log([...newarray[id]].indexOf(size));
    var index = [...newarray[id]].indexOf(size);


    const newCart =  {
          ...data,
          [id]: [...newarray[id]].slice(0,index).concat([...newarray[id]].slice(index+1,))
        }
   
    addToCart(newCart);
    console.log(
      ...newCart[id],
    )
  };
  const router = useRouter();

  if (!loading && !user && typeof window !== "undefined") router.push("/login");

  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>清嶼 Tranquil island</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <div className={styles.header}>
            <h1 className={styles.title}>My Cart</h1>
            <h4>You have {cartLength} items in your cart</h4>
            
          </div>
          {cartItemsArray.map((item, index) => {
            return (
              <CartItem
                key={index}
                id={item.name}
                size={item.size}
                count={item.count}
                onAdd={addCartEvent}
                ondel={delCartEvent}
              />
            );
          })}
           <div className={styles.header}>
           <div className={styles.headerButtons}>
      {cartItemsArray.length!==0? <Button type="sort" style={{ marginRight: 20 }} onClick={onSubmit} >送出訂單</Button>: <></>}
     </div>
           </div>
          
        </main>
       
      </div>
    </Layout>
  );
}
