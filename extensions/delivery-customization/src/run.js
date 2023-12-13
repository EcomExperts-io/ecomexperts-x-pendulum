// @ts-check

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @type {FunctionRunResult}
 */
const NO_CHANGES = {
  operations: [],
};

/*
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {

  const deliveryOptions =  input.cart.deliveryGroups[0].deliveryOptions
  const countryCode = input.cart.deliveryGroups[0].deliveryAddress.countryCode
  

  const handleValues = deliveryOptions.map(option => option.handle);

  console.log(JSON.stringify(handleValues))
  // creating hide handles

  
 
  const hideHandles = {
    operations:handleValues.map(handle => ({
      hide: {
        deliveryOptionHandle: handle
      }
    }))

  }
  if (deliveryOptions.length && countryCode === "CA" ) {

    for(const item of input.cart.lines){

      const title = item.merchandise.product.title

      if(!(title.includes("Akkermansia") || title === "Butyricum" || title === "Pendulum Metabolic Daily")) { 
        return hideHandles

      }               
    }
   
  }
  
  return {
    operations: []
  };
};