import { firestore, increment, auth, _delete } from "../../firebase";

export const ADD_TO_CART = "ADD_TO_CART";
export const DECREASE_QUANTITY = "DECREASE_QUANTITY";
export const DELETE_FROM_CART = "DELETE_FROM_CART";
export const DELETE_ALL_FROM_CART = "DELETE_ALL_FROM_CART";

//add to cart
export const addToCart = (
  item,
  addToast,
  quantityCount,
) => {

  return dispatch => {
    dispatch({
      type: 'REQUESTING',
      requesting: true
    })
    firestore.collection('users').doc(auth.currentUser.uid)
        .set({cartItems: {[item.id]: increment(quantityCount ? quantityCount : 1)}}, { merge: true })
      .then(result => {
        dispatch({
          type: ADD_TO_CART,
          payload: {...item, quantity: quantityCount}
        });
        dispatch({
          type: 'REQUESTING',
          requesting: false
        })
        if (addToast) {
          addToast("Added To Cart", { appearance: "success", autoDismiss: true });
        }
      }).catch(err => {
        if (addToast) {
          addToast("Failed To Add To Cart", { appearance: "error", autoDismiss: true });
          dispatch({
            type: 'REQUESTING',
            requesting: false
          })
        }
      })

    
  };
};
//decrease from cart
export const decreaseQuantity = (item, addToast, user) => {
  return dispatch => {
    dispatch({
      type: 'REQUESTING',
      requesting: true
    })
    firestore.collection('users').doc(auth.currentUser.uid)
    .set({cartItems: {[item.id]: increment(-1)}}, { merge: true })
      .then(result => {
        dispatch({
          type: DECREASE_QUANTITY, payload: item
        });
        dispatch({
          type: 'REQUESTING',
          requesting: false
        })
        if (addToast) {
          addToast("Item Decremented From Cart", {
            appearance: "warning",
            autoDismiss: true
          });
        }
      }).catch(err => {
        if (addToast) {
          addToast("Item Decrement failed From Cart", {
            appearance: "error",
            autoDismiss: true
          });
        }
        dispatch({
          type: 'REQUESTING',
          requesting: false
        })
      })

    
  };
};
//delete from cart
export const deleteFromCart = (item, addToast, user) => {
  return dispatch => {
    dispatch({
      type: 'REQUESTING',
      requesting: true
    })
    firestore.collection('users').doc(auth.currentUser.uid)
    .set({cartItems: {[item.id]: _delete}}, { merge: true })
      .then(result => {
        dispatch({
          type: DELETE_FROM_CART, payload: item
        });
        dispatch({
          type: 'REQUESTING',
          requesting: false
        })
        if (addToast) {
          addToast("Removed From Cart", { appearance: "error", autoDismiss: true });
        }
      }).catch(err => {
        if (addToast) {
          addToast("Failed To Remove From Cart", { appearance: "error", autoDismiss: true });
        }
        dispatch({
          type: 'REQUESTING',
          requesting: false
        })
      })
  };
};
//delete all from cart
export const deleteAllFromCart = addToast => {
  return dispatch => {
    dispatch({
      type: 'REQUESTING',
      requesting: true
    })
    firestore.collection('users').doc(auth.currentUser.uid)
    .set({cartItems: _delete}, { merge: true })
      .then(result => {
        dispatch({
          type: 'REQUESTING',
          requesting: false
        })
        if (addToast) {
          addToast("Removed All From Cart", {
            appearance: "error",
            autoDismiss: true
          });
        }
        dispatch({ type: DELETE_ALL_FROM_CART });
        
      }).catch(err => {
        if (addToast) {
          addToast("Failed To Remove From Cart", { appearance: "error", autoDismiss: true });
        }
        dispatch({
          type: 'REQUESTING',
          requesting: false
        })
      })
  };
};

// get stock of cart item
export const cartItemStock = (item, color, size) => {
  if (item.stock) {
    return item.stock;
  } else {
    return item.stock;
    return item.variation
      .filter(single => single.color === color)[0]
      .size.filter(single => single.name === size)[0].stock;
  }
};
