import AsyncStorage from "@react-native-async-storage/async-storage";

// returns null if the request failed. Will print and alert any errors.
export const makeHTTPRequest = async (requestOptions, url) => {
    console.log("making request: " + JSON.stringify(requestOptions))
    var response;
    try {
        response = await fetch(url, requestOptions)
    } catch (e) {
        console.log('fetch error:', e.message)
        return null;
    }

    if (response.status && response.status != 200) {
        response = await response.text()
        console.log("request not 200 OK! response: " + response);
        alert(response)
        return null;
    }

    response = await response.json();

    console.log("request succeeded, response: " + JSON.stringify(response))
    return response
}

export const getUserPersonalFridgeObject = async () => {
    let fridgeIds = await getUserFridgeIds();
    let personalFridgeId = fridgeIds[0]
    var requestOptions = {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        }
      };
    
    var response = await makeHTTPRequest(requestOptions, "https://looking-glass-api.herokuapp.com/api/fridge/" + personalFridgeId);
    if (response === null) {
        alert("failed to get your fridge.")
        return;
      }
      console.log(JSON.stringify(response));
      return response;
}

export const getUserFridgeIds = async () => {
  var requestOptions = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "email" : await AsyncStorage.getItem("user_email")
    })
  };

  var response = await makeHTTPRequest(requestOptions, "https://looking-glass-api.herokuapp.com/api/me");
  if (response === null) {
    alert("failed to get your login info.")
    return;
  }
  console.log("api/me response: " + JSON.stringify(response));
  return response.fridge_ids
}

export const getUserSharedFridgeObject = async () => {
  let fridgeIds = await getUserFridgeIds();
  if (fridgeIds.length < 2) {
    return "NO SHARED FRIDGE"
  }
  let sharedFridgeId = fridgeIds[1];
  var requestOptions = {
    method: 'GET',
    headers: {
      "Content-Type": "application/json"
    }
  };

  var response = await makeHTTPRequest(requestOptions, "https://looking-glass-api.herokuapp.com/api/fridge/" + sharedFridgeId);
  if (response === null) {
      alert("failed to get your fridge.")
      return;
    }
    console.log(JSON.stringify(response));
    return response;
}

export const addOrRemoveFoodFromFridge = async (fridgeId, foodArray, action) => {
  var requestOptions = {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "foods": JSON.stringify(foodArray),
      "action": action
    })
  };

  var response = await makeHTTPRequest(requestOptions, "https://looking-glass-api.herokuapp.com/api/fridge/" + fridgeId + "/foods")
  if (response === null) {
    alert("failed to add or remove foods")
    return
  }
  console.log(JSON.stringify(response))
  return response;
}

export const createFridge = async (email, slug) => {
  console.log("creating fridge", email, slug)
  var body = {
    email,
    slug
  }
  var requestOptions = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };

  var response = makeHTTPRequest(requestOptions, "https://looking-glass-api.herokuapp.com/api/fridge");

  if (!response) {
    alert("fridge creation failed")
    return;
  }

  console.log("fridge creation succeeded, response: " + JSON.stringify(response))
}
