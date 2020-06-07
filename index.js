import * as React from 'react';
import EP from './endpoints.js';

const defaultHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
}

const Options = (method, headers, params, body) => {
  let obj = {}
  if(method == "post"){
    obj = {method: method, body: JSON.stringify(body), headers: headers || defaultHeaders, params: params}
  }else if(method == "get"){
    obj = {method: method, headers: headers || defaultHeaders, params: params}
  }
  return obj
}

export default async function API(endpoint, method, headers, params, body, onSuccess, onError) {
  // console.log("body", body._parts)
  // console.log("body", body)
  // console.log("endpoint", EP[endpoint])
  try {
    if(method == "post"){
      let Head = {
          'Accept': headers.Accept ? headers.Accept : 'application/json',
          'Content-Type': headers['Content-Type'] ? headers['Content-Type'] : 'application/json',
          'Authorization': headers.Authorization || '',
          'card_number': headers.card_number || ''
      }
      let response = await fetch(endpoint.includes(":") ? endpoint : EP[endpoint], {
        method: method,
        body: body?._parts ? body : JSON.stringify(body),
        headers: Head,
        params: params
      });
      // console.log("headers", Head)
      // console.log("body", body)
      let json = await response.json();
      onSuccess(json)
      return json
    }else if(method == "get"){
      let url = !params.noID ? (EP[endpoint] + "?" + params) : EP[endpoint] + "/" + params.value
      console.log("URL", url)
      if(headers.Authorization){
        let response = await fetch(endpoint.includes(":") ? endpoint : url, {
          method: method,
          headers: new Headers({
            'Accept': 'application/json',
            'Authorization': `${headers.Authorization || ''}`,
            'card_number': `${headers.card_number}` || ''
          })
        });
        let json = await response.json();
        onSuccess(json)
        return json
      }else{
        let response = await fetch(endpoint.includes(":") ? endpoint : url);
        let json = await response.json();
        onSuccess(json)
        return json
      }
    }else if(method == "delete"){
      let url = !params.noID ? (EP[endpoint] + "?" + params) : EP[endpoint] + "/" + params.value
      if(headers.Authorization){
        let response = await fetch(endpoint.includes(":") ? endpoint : url, {
          method: method,
          headers: new Headers({
            'Accept': 'application/json',
            'Authorization': `${headers.Authorization || ''}`,
            'card_number': `${headers.card_number}` || ''
          })
        });
        let json = await response.json();
        onSuccess(json)
        return json
      }else{
        let response = await fetch(endpoint.includes(":") ? endpoint : url);
        let json = await response.json();
        onSuccess(json)
        return json
      }
    }

  } catch (error) {
    onError(error)
    return error
  }
}
