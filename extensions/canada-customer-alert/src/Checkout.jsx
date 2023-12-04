import {
  Banner,
  BlockStack,
  View,
  useSettings,
  reactExtension,
  useShippingAddress,
  useCartLines,

} from '@shopify/ui-extensions-react/checkout';
import { useEffect, useState } from 'react';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

function Extension() {
  
  const { countryCode } = useShippingAddress()
  const cartLines = useCartLines();
  const [isFlag, setIsFlag] = useState(false);

  
  const { description, collapsible } = useSettings();


  useEffect(()=>{

    if(countryCode == "CA"){

      for(const item of cartLines){

        console.log(item)
        const title = item.merchandise.title
        const variant = item.merchandise.selectedOptions.length && item.merchandise.selectedOptions[0].value
        const quantity = item.quantity
  
        if(!variant.includes("Single")) { 
  
          setIsFlag(true); 
          console.log("true: single",true); 
          break 
        
        } 
        if(!(title.includes("Akkermansia") || title === "Butyricum" || title === "Pendulum Metabolic Daily")) { 
  
          console.log("true: variant",true);
          setIsFlag(true); 
          break 
  
        }
        if(quantity > 3) { 
  
          console.log("true: qunatity",true); 
          setIsFlag(true); 
          break
  
        }
            
      }
      

    } 
    else{
      setIsFlag(false)
    }

    
   
  },[countryCode, cartLines])

  // Set a default status for the banner if a merchant didn't configure the banner in the checkout editor
  const status = useSettings().merchantStatus ?? 'info';
  const title = useSettings().merchantTitle ?? '';

 
  return (
 
    isFlag ?  
    <Banner title={title} status={status} collapsible={collapsible}>
      {description}
    </Banner> :
    null
   
  );
}