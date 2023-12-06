import Head from "next/head";
import styles from "./index.module.scss";
import ProductCard from "@/components/ProductCard/product-card";

import Button from "components/FilterButton";
import HorizontalCard from "components/HomeCard/horizontal-card";
import VerticalCard from "components/HomeCard/vertical-card";
import Products from "components/HomeProducts";

import { db } from "config/firebase";
import Layout from "components/Layout";

import { useAuth } from "../firebase/context";
import { useState, useEffect } from "react";

export default function Home() {
  const auth = useAuth();
  const [data, setData] = useState([]);

  const { user, loading } = useAuth();
  useEffect(() => {
    async function fetchFromFirestore() {
      await db
      .collection("Products")
      .get()
      .then(function (querySnapshot) {
        const products = querySnapshot.docs.map(function (doc) {
          return { id: doc.id, ...doc.data() };
        });
        setData(products)
        console.log(products)
        // console.log(doc.id)
      })
    }

    fetchFromFirestore();
  }, []);
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>清嶼 Tranquil island</title>
          <link rel="icon" href="/banner.jpg" />
        </Head>

        <main className={styles.main}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              <span className={styles.emoji}>⚡</span>新品介紹
            </h1>
            {/* <div className={styles.headerButtons}>
              <Button type="sort" style={{ marginRight: 20 }} />
              <Button count={0} />
            </div> */}
          </div>
          <div className={styles.products}>
            {!loading &&
              data.map((product) => {
                return (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    brand={product.brand}
                    name={product.product_name}
                    image={product.cover_photo}
                    price={product.price}
                    sale_price={product.sale_price}
                    favorite={user?.favorites?.includes(product.id)}
                  />
                );
              })}
          </div>
      
        </main>
      </div>
    </Layout>
  );
}
