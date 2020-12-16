import { firestore, increment, auth, _delete } from "../../firebase";

export const ADD_TO_WISHLIST = "ADD_TO_WISHLIST";
export const DELETE_FROM_WISHLIST = "DELETE_FROM_WISHLIST";
export const DELETE_ALL_FROM_WISHLIST = "DELETE_ALL_FROM_WISHLIST";

// add to wishlist
export const addToWishlist = (item, addToast) => {
  return dispatch => {
    
    dispatch({
      type: 'REQUESTING',
      requesting: true
    })
    firestore.collection('users').doc(auth.currentUser.uid)
        .set({wishlist: {[item.id]: 1 }}, { merge: true })
      .then(result => {
        dispatch({
          type: ADD_TO_WISHLIST,
          payload: item
        });
        dispatch({
          type: 'REQUESTING',
          requesting: false
        })
        if (addToast) {
          addToast("Added To Wishlist", {
            appearance: "success",
            autoDismiss: true
          });
        }
      }).catch(err => {
        if (addToast) {
          addToast("Failed To Add To Wishlist", { appearance: "error", autoDismiss: true });
          dispatch({
            type: 'REQUESTING',
            requesting: false
          })
        }
      })
  };

  
};

// delete from wishlist
export const deleteFromWishlist = (item, addToast) => {
  return dispatch => {
    
    dispatch({
      type: 'REQUESTING',
      requesting: true
    })
    firestore.collection('users').doc(auth.currentUser.uid)
    .set({wishlist: {[item.id]: _delete}}, { merge: true })
      .then(result => {
        dispatch({
          type: DELETE_FROM_WISHLIST, payload: item
        });
        dispatch({
          type: 'REQUESTING',
          requesting: false
        })
        if (addToast) {
          addToast("Removed From Wishlist", {
            appearance: "error",
            autoDismiss: true
          });
        }
      }).catch(err => {
        if (addToast) {
          addToast("Failed To Remove From Wishlist", { appearance: "error", autoDismiss: true });
        }
        dispatch({
          type: 'REQUESTING',
          requesting: false
        })
      })
  };
};

//delete all from wishlist
export const deleteAllFromWishlist = addToast => {
  return dispatch => {
    
    dispatch({ type: DELETE_ALL_FROM_WISHLIST });
    dispatch({
      type: 'REQUESTING',
      requesting: true
    })
    firestore.collection('users').doc(auth.currentUser.uid)
    .set({wishlist: _delete}, { merge: true })
      .then(result => {
        dispatch({
          type: 'REQUESTING',
          requesting: false
        })
        if (addToast) {
          addToast("Removed All From Wishlist", {
            appearance: "error",
            autoDismiss: true
          });
        }
        dispatch({ type: DELETE_ALL_FROM_WISHLIST });
        
      }).catch(err => {
        if (addToast) {
          addToast("Failed To Remove All From Wishlist", { appearance: "error", autoDismiss: true });
        }
        dispatch({
          type: 'REQUESTING',
          requesting: false
        })
      })
  };
};
