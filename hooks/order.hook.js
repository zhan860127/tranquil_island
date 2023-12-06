import { useEffect, useState } from "react";
import { auth, db } from "../config/firebase";

const useOrders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFromFirestore() {
      auth.currentUser &&
        db
          .collection("Users")
          .doc(auth.currentUser.uid)
          .get()
          .then(function (doc) {
            console.log(doc.data())
            const orders = doc.data().orders;
            console.log(orders);
            if (orders) {
              db.collection("Orders")
                .get()
                .then(function (querySnapshot) {
                  const ordersArray = querySnapshot.docs
                    .filter((doc) => orders.includes(doc.id))
                    .map(function (doc) {
                      console.log(doc.data())
                      return {
                        id: doc.id,
                        ...doc.data(),
                        date: doc.data().date,
                      };
                    });
                  setData(ordersArray);
                  setLoading(false);
                });
            }
          });
    }

    fetchFromFirestore();
  }, [auth.currentUser]);

  return {
    data,
    loading,
    error,
  };
};

export { useOrders };
